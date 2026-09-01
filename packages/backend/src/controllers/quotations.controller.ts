import { Request, Response } from 'express'
import prisma from '../db'

export const quotationsController = {
  list: async (req: Request, res: Response) => {
    try {
      const { status, projectId, clientId } = req.query
      
      const where: any = {}
      
      if (status) {
        where.status = status as string
      }
      
      if (projectId) {
        where.projectId = projectId as string
      }
      
      if (clientId) {
        where.clientId = clientId as string
      }
      
      const quotations = await prisma.quotation.findMany({
        where,
        include: {
          client: true,
          project: true,
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      
      res.json({ success: true, data: quotations })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list quotations' })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const quotation = await prisma.quotation.findUnique({ 
        where: { id },
        include: {
          client: true,
          project: true,
          items: {
            include: {
              product: true
            }
          },
          payments: true
        }
      })
      
      if (!quotation) return res.status(404).json({ success: false, error: 'Quotation not found' })
      res.json({ success: true, data: quotation })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get quotation' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const payload = req.body
      
      // Generate folio if not provided
      if (!payload.folio) {
        const count = await prisma.quotation.count()
        const year = new Date().getFullYear()
        payload.folio = `SX-Q-${year}-${String(count + 1).padStart(6, '0')}`
      }
      
      // Calculate valid until
      if (!payload.validUntil && payload.validityDays) {
        const validUntil = new Date()
        validUntil.setDate(validUntil.getDate() + payload.validityDays)
        payload.validUntil = validUntil
      }
      
      // Calculate totals
      if (payload.items && Array.isArray(payload.items)) {
        let subtotal = 0
        payload.items.forEach((item: any) => {
          const itemSubtotal = item.quantity * item.unitPrice
          subtotal += itemSubtotal
          item.subtotal = itemSubtotal
          
          // Apply discount
          if (item.discountPercent) {
            item.discountAmount = itemSubtotal * (item.discountPercent / 100)
            item.finalPrice = itemSubtotal - item.discountAmount
          } else {
            item.finalPrice = itemSubtotal
          }
        })
        
        payload.subtotal = subtotal
        payload.discounts = payload.discounts || 0
        payload.taxAmount = (subtotal - payload.discounts) * (payload.taxRate || 0.16)
        payload.total = subtotal - payload.discounts + payload.taxAmount
      }
      
      const { items, ...quotationData } = payload
      
      const created = await prisma.quotation.create({ 
        data: {
          ...quotationData,
          items: {
            create: items || []
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          client: true,
          project: true
        }
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
      
      const existing = await prisma.quotation.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Quotation not found' })
      
      // Don't allow update if already accepted
      if (existing.status === 'ACCEPTED') {
        return res.status(400).json({ 
          success: false, 
          error: 'Cannot update an accepted quotation. Create a new version instead.' 
        })
      }
      
      const updated = await prisma.quotation.update({ 
        where: { id }, 
        data: payload 
      })
      
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update quotation' })
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { status } = req.body
      
      if (!status) {
        return res.status(400).json({ success: false, error: 'Status is required' })
      }
      
      const existing = await prisma.quotation.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Quotation not found' })
      
      const updateData: any = { status }
      
      // If accepted, record acceptance date and update project
      if (status === 'ACCEPTED') {
        updateData.acceptedAt = new Date()
        if (existing.projectId) {
          await prisma.project.update({
            where: { id: existing.projectId },
            data: { status: 'WON' }
          })
        }
      }
      
      const updated = await prisma.quotation.update({ 
        where: { id }, 
        data: updateData,
        include: {
          client: true,
          project: true,
          items: { include: { product: true } }
        }
      })
      
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update quotation status' })
    }
  },

  pdf: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      
      const quotation = await prisma.quotation.findUnique({ 
        where: { id },
        include: {
          client: true,
          project: true,
          items: { include: { product: true } }
        }
      })
      
      if (!quotation) return res.status(404).json({ success: false, error: 'Quotation not found' })
      
      const client = quotation.client
      const items = quotation.items
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.subtotal || 0), 0)
      const discount = items.reduce((sum: number, item: any) => sum + (item.discountAmount || 0), 0)
      const tax = quotation.taxAmount || 0
      const total = quotation.total || 0
      
      const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cotización ${quotation.folio}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', Arial, sans-serif; color: #1f2937; background: #fff; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2aa6ff; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: 900; color: #2aa6ff; letter-spacing: -1px; }
    .tagline { font-size: 12px; color: #6b7280; }
    .folio { text-align: right; }
    .folio .number { font-size: 24px; font-weight: 700; color: #2aa6ff; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 12px; text-transform: uppercase; color: #6b7280; margin-bottom: 8px; letter-spacing: 1px; }
    .section-content { font-size: 14px; line-height: 1.6; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 13px; }
    th, td { padding: 12px 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f8fafc; color: #374151; font-weight: 600; }
    .text-right { text-align: right; }
    .totals { width: 320px; margin-left: auto; margin-top: 20px; font-size: 14px; }
    .totals .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .totals .row.total { font-size: 18px; font-weight: 700; color: #2aa6ff; border-top: 2px solid #2aa6ff; border-bottom: none; margin-top: 10px; }
    .terms { margin-top: 40px; font-size: 12px; color: #6b7280; }
    .stamp { text-align: center; margin-top: 50px; color: #6b7280; font-size: 12px; }
    .stamp strong { color: #2aa6ff; font-size: 14px; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
    .print-btn { position: fixed; top: 20px; right: 20px; background: #2aa6ff; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .print-btn:hover { background: #1e7bb8; }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">Imprimir / Guardar PDF</button>
  
  <div class="header">
    <div>
      <div class="logo">SHADEX</div>
      <div class="tagline">QUOD TANGO MUTO • Sistema de Transformaciones Arquitectónicas</div>
      <div class="tagline" style="margin-top: 6px;">Lilia Dinorah Mejia Trujeque • RFC: METL671227PP7</div>
    </div>
    <div class="folio">
      <div class="number">${quotation.folio}</div>
      <div style="font-size: 12px; color: #6b7280;">Cotización ${quotation.version || 1}</div>
      <div style="font-size: 12px; color: #6b7280;">${new Date(quotation.quotationDate || quotation.createdAt).toLocaleDateString('es-MX')}</div>
    </div>
  </div>

  <div class="grid">
    <div class="section">
      <div class="section-title">Cliente</div>
      <div class="section-content">
        <strong>${client?.name || ''} ${client?.lastName || ''}</strong><br>
        ${client?.companyName ? client.companyName + '<br>' : ''}
        ${client?.phone || ''}<br>
        ${client?.email || ''}
      </div>
    </div>
    <div class="section">
      <div class="section-title">Proyecto</div>
      <div class="section-content">
        <strong>${quotation.project?.name || 'Proyecto'}</strong><br>
        ${quotation.location || ''}<br>
        ${quotation.project?.description || ''}
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Concepto</th>
        <th class="text-right">Cantidad</th>
        <th class="text-right">Unidad</th>
        <th class="text-right">P. Unitario</th>
        <th class="text-right">Desc.</th>
        <th class="text-right">Importe</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((item: any) => `
        <tr>
          <td>
            <strong>${item.product?.name || item.description || 'Concepto'}</strong><br>
            <span style="color: #6b7280; font-size: 11px;">${item.product?.description || ''}</span>
          </td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">${item.unit}</td>
          <td class="text-right">${(item.unitPrice || 0).toLocaleString('es-MX', { style: 'currency', currency: quotation.currency })}</td>
          <td class="text-right">${item.discountPercent ? item.discountPercent + '%' : '-'}</td>
          <td class="text-right">${(item.subtotal || 0).toLocaleString('es-MX', { style: 'currency', currency: quotation.currency })}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="row"><span>Subtotal</span><span>${subtotal.toLocaleString('es-MX', { style: 'currency', currency: quotation.currency })}</span></div>
    <div class="row"><span>Descuento</span><span>-${discount.toLocaleString('es-MX', { style: 'currency', currency: quotation.currency })}</span></div>
    <div class="row"><span>IVA (16%)</span><span>${tax.toLocaleString('es-MX', { style: 'currency', currency: quotation.currency })}</span></div>
    <div class="row total"><span>Total</span><span>${total.toLocaleString('es-MX', { style: 'currency', currency: quotation.currency })}</span></div>
  </div>

  <div class="grid" style="margin-top: 30px;">
    <div class="section">
      <div class="section-title">Condiciones Comerciales</div>
      <div class="section-content">
        Anticipo: ${quotation.deposit ? (quotation.deposit * 100).toFixed(0) + '%' : 'Pendiente'}<br>
        Liquidación: ${quotation.liquidation ? (quotation.liquidation * 100).toFixed(0) + '%' : 'Pendiente'}<br>
        Vigencia: ${quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString('es-MX') : '30 días'}<br>
        Garantía: ${quotation.warrantyYears || 5} años
      </div>
    </div>
    <div class="section">
      <div class="section-title">Observaciones</div>
      <div class="section-content">
        ${quotation.notes || quotation.observations || 'Sin observaciones'}
      </div>
    </div>
  </div>

  <div class="terms">
    <strong>Términos y condiciones:</strong><br>
    ${quotation.terms || 'Los precios pueden variar sin previo aviso. La cotización está sujeta a disponibilidad de material y a la confirmación de medidas finales en sitio. No incluye trabajos adicionales no especificados.'}
  </div>

  <div class="stamp">
    <p><strong>SHADEX</strong> • Tel: 614 487 1005 • support@shadex.com.mx • shadex.com.mx</p>
    <p style="margin-top: 8px;">Documento generado por SHADEX OS</p>
  </div>
</body>
</html>
      `
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.send(html)
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to generate PDF' })
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const existing = await prisma.quotation.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'Quotation not found' })
      
      // Don't allow delete if already accepted
      if (existing.status === 'ACCEPTED') {
        return res.status(400).json({ 
          success: false, 
          error: 'Cannot delete an accepted quotation' 
        })
      }
      
      await prisma.quotation.delete({ where: { id } })
      res.status(204).send()
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to delete quotation' })
    }
  },

  createVersion: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const existing = await prisma.quotation.findUnique({
        where: { id },
        include: { items: true, client: true, project: true }
      })
      if (!existing) return res.status(404).json({ success: false, error: 'Quotation not found' })

      const count = await prisma.quotation.count({ where: { projectId: existing.projectId, folio: { startsWith: existing.folio.split('-v')[0] } } })
      const newVersion = existing.version + 1
      const newFolio = `${existing.folio.split('-v')[0]}-v${newVersion}`

      const { items, id: _, createdAt, updatedAt, acceptedAt, status, ...base } = existing as any

      const created = await prisma.quotation.create({
        data: {
          ...base,
          folio: newFolio,
          version: newVersion,
          status: 'DRAFT',
          items: {
            create: items.map((item: any) => {
              const { id, quotationId, createdAt, ...rest } = item
              return rest
            })
          }
        },
        include: {
          items: { include: { product: true } },
          client: true,
          project: true
        }
      })

      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create quotation version' })
    }
  }
}