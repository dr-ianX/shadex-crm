import { Request, Response } from 'express'
import prisma from '../db'
import { z } from 'zod'
import PDFDocument from 'pdfkit'
import path from 'path'

async function getNextSequence(key: string) {
  const seq = await prisma.sequence.upsert({
    where: { key },
    update: { last: { increment: 1 } as any },
    create: { key, last: 1 },
  })
  return seq.last
}

const createQuotationSchema = z.object({
  clientId: z.string().optional(),
  createdBy: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  taxPercent: z.number().optional(),
  lines: z.array(z.object({ description: z.string(), quantity: z.number().min(0), unitPrice: z.number().min(0) })).min(1),
  transformationId: z.string().nullable().optional(),
})

export const quotationsController = {
  list: async (req: Request, res: Response) => {
    try {
      const quotes = await prisma.quotation.findMany({ include: { lines: true, client: true } })
      res.json({ success: true, data: quotes })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list quotations' })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const quote = await prisma.quotation.findUnique({ where: { id }, include: { lines: true, client: true } })
      if (!quote) return res.status(404).json({ success: false, error: 'Quotation not found' })
      res.json({ success: true, data: quote })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get quotation' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const parse = createQuotationSchema.safeParse(req.body)
      if (!parse.success) return res.status(400).json({ success: false, error: parse.error.flatten() })
      const payload = parse.data

      const seq = await getNextSequence('quotation')
      const padded = String(seq).padStart(4, '0')
      const quotationNumber = `COT-${padded}`

      const lines = payload.lines || []
      let subtotal = 0
      for (const l of lines) {
        const lineTotal = Number(l.quantity) * Number(l.unitPrice)
        const tmp: any = l
        tmp.lineTotal = lineTotal
        subtotal += lineTotal
      }
      const taxPercent = payload.taxPercent != null ? Number(payload.taxPercent) : 16
      const taxAmount = (Number(subtotal) * Number(taxPercent)) / 100
      const totalAmount = subtotal + taxAmount

      const created = await prisma.quotation.create({
        data: {
          quotationNumber,
          transformationId: payload.transformationId || null,
          clientId: payload.clientId || null,
          version: 1,
          status: 'Draft',
          subtotal: subtotal,
          taxPercent: taxPercent,
          taxAmount: taxAmount,
          totalAmount: totalAmount,
          currency: 'MXN',
          notes: payload.notes || null,
          createdBy: payload.createdBy || null,
          lines: {
            create: lines.map((l: any) => ({
              productId: l.productId || null,
              description: l.description || '',
              quantity: l.quantity || 0,
              unitPrice: l.unitPrice || 0,
              lineTotal: l.lineTotal || 0,
            })),
          },
        },
        include: { lines: true, client: true },
      })

      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create quotation' })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const payload = req.body
      const existing = await prisma.quotation.findUnique({ where: { id }, include: { lines: true } })
      if (!existing) return res.status(404).json({ success: false, error: 'Quotation not found' })

      if (payload.lines) {
        await prisma.quotationLine.deleteMany({ where: { quotationId: id } })
        let subtotal = 0
        for (const l of payload.lines) {
          const lineTotal = Number(l.quantity) * Number(l.unitPrice)
          subtotal += lineTotal
          await prisma.quotationLine.create({ data: {
            quotationId: id,
            productId: l.productId || null,
            description: l.description || '',
            quantity: l.quantity || 0,
            unitPrice: l.unitPrice || 0,
            lineTotal: lineTotal,
          }})
        }
        const taxPercent = payload.taxPercent != null ? Number(payload.taxPercent) : existing.taxPercent
        const taxAmount = (Number(subtotal) * Number(taxPercent)) / 100
        const totalAmount = subtotal + taxAmount
        payload.subtotal = subtotal
        payload.taxAmount = taxAmount
        payload.totalAmount = totalAmount
      }

      const updated = await prisma.quotation.update({ where: { id }, data: payload, include: { lines: true, client: true } })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update quotation' })
    }
  },

  convertToInvoice: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const quote = await prisma.quotation.findUnique({ where: { id }, include: { lines: true, client: true } })
      if (!quote) return res.status(404).json({ success: false, error: 'Quotation not found' })

      const seq = await getNextSequence('invoice')
      const padded = String(seq).padStart(4, '0')
      const invoiceNumber = `INV-${padded}`

      if (!quote.clientId) return res.status(400).json({ success: false, error: 'Quotation has no clientId, cannot convert to invoice' })

      const created = await prisma.invoice.create({
        data: {
          invoiceNumber,
          transformationId: quote.transformationId || '',
          clientId: quote.clientId,
          amount: quote.subtotal,
          taxAmount: quote.taxAmount,
          totalAmount: quote.totalAmount,
          currency: quote.currency,
          invoiceDate: new Date(),
          status: 'Draft',
        }
      })

      res.json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to convert quotation' })
    }
  },

  pdf: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const quote = await prisma.quotation.findUnique({ where: { id }, include: { lines: true, client: true } })
      if (!quote) return res.status(404).json({ success: false, error: 'Quotation not found' })

      const doc = new PDFDocument({ size: 'A4', margin: 50 })
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename=\"${quote.quotationNumber}.pdf\"`)

      // attempt to locate the logo in the frontend public assets
      const logoPath = path.resolve(__dirname, '..', '..', '..', 'frontend', 'public', 'assets', 'shadex-logo-print.png')
      try {
        // include logo if available
        doc.image(logoPath, 50, 45, { width: 60 })
      } catch (err) {
        // ignore if not found
        console.warn('Logo not embedded in PDF:', err)
      }

      // Header
      doc.fontSize(18).font('Helvetica-Bold').text('SHADEX', 120, 50)
      doc.fontSize(10).font('Helvetica').text('Cotización', 120, 70)

      // Company block (address, contact)
      const companyInfoY = 105
      doc.fontSize(9).font('Helvetica').text('ShadeX LLC', 50, companyInfoY)
      doc.fontSize(8).text('Av. Ejemplo 123, Col. Centro, CDMX, México', 50, companyInfoY + 12)
      doc.text('Tel: +52 55 1234 5678', 50, companyInfoY + 24)
      doc.text('Email: contacto@shadex.local', 50, companyInfoY + 36)

      // Client / Project block on right
      const rightX = 320
      doc.fontSize(9).font('Helvetica-Bold').text('Cliente / Proyecto', rightX, companyInfoY)
      doc.fontSize(9).font('Helvetica').text(quote.client ? quote.client.name : '—', rightX, companyInfoY + 14)
      if (quote.transformationId) doc.text(`Proyecto ID: ${quote.transformationId}`, rightX, companyInfoY + 28)

      doc.moveDown(6)

      const fmt = (v: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v)

      // metadata
      doc.fontSize(10).text(`Número: ${quote.quotationNumber}`, 50)
      doc.text(`Fecha: ${new Date(quote.createdAt).toLocaleDateString()}`)

      if (quote.client) {
        doc.moveDown()
        doc.fontSize(10).text(`Cliente: ${quote.client.name}`)
        if (quote.client.email) doc.fontSize(9).text(`Email: ${quote.client.email}`)
        if (quote.client.phone) doc.fontSize(9).text(`Tel: ${quote.client.phone}`)
      }

      doc.moveDown()
      doc.font('Helvetica-Bold')
      doc.text('Líneas:')
      doc.moveDown(0.5)

      const tableTop = doc.y
      doc.text('Descripción', 50, tableTop)
      doc.text('Cantidad', 320, tableTop)
      doc.text('Precio', 390, tableTop)
      doc.text('Importe', 470, tableTop)
      doc.font('Helvetica')

      let y = tableTop + 20
      for (const line of quote.lines) {
        // wrap description if needed
        doc.font('Helvetica').fontSize(9)
        doc.text(line.description, 50, y, { width: 250 })
        doc.text(String(line.quantity), 320, y)
        doc.text(fmt(Number(line.unitPrice)), 390, y)
        doc.text(fmt(Number(line.lineTotal)), 470, y)
        y += 20
        if (y > 700) { doc.addPage(); y = 50 }
      }

      // terms block
      if (y + 140 > 750) { doc.addPage(); y = 50 }
      doc.moveDown(1)
      const termsY = y + 20
      doc.fontSize(8).font('Helvetica')
      doc.text('Términos y condiciones: Los precios son válidos por 15 días. Tiempo estimado de entrega sujeto a disponibilidad de stock. Formas de pago: transferencia bancaria o depósito a cuenta. Garantía según contrato.', 50, termsY, { width: 440 })
      y = termsY + 60

      // totals
      if (y + 80 > 750) { doc.addPage(); y = 50 }
      doc.moveTo(50, y + 10).lineTo(540, y + 10).stroke()
      doc.moveDown()
      doc.font('Helvetica-Bold')
      doc.text(`Subtotal: ${fmt(Number(quote.subtotal || 0))}`, { align: 'right' })
      doc.text(`IVA (${quote.taxPercent}%): ${fmt(Number(quote.taxAmount || 0))}`, { align: 'right' })
      doc.text(`Total: ${fmt(Number(quote.totalAmount || 0))}`, { align: 'right' })

      // footer and page numbering
      let pageNumber = 1
      const drawFooter = () => {
        const bottom = doc.page.height - 40
        doc.fontSize(8).fillColor('gray')
        doc.text('SHADEX — https://shadex.local | RFC: XAXX010101000', 50, bottom, { align: 'left', width: 300 })
        doc.text(`Página ${pageNumber}`, 0, bottom, { align: 'right', width: doc.page.width - 100 })
        doc.fillColor('black')
      }

      // draw footer for current page
      drawFooter()

      // if additional pages were added during generation, attempt to draw footers for them
      // We already call doc.addPage() in the loop; we can listen for 'pageAdded' events to increment pageNumber and draw footer
      doc.on('pageAdded', () => { pageNumber += 1; drawFooter() })

      // pipe then end
      doc.pipe(res)
      doc.end()
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to generate PDF' })
    }
  }
}
