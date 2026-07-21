"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quotationsController = void 0;
const db_1 = __importDefault(require("../db"));
const zod_1 = require("zod");
const pdfkit_1 = __importDefault(require("pdfkit"));
async function getNextSequence(key) {
    const seq = await db_1.default.sequence.upsert({
        where: { key },
        update: { last: { increment: 1 } },
        create: { key, last: 1 },
    });
    return seq.last;
}
const createQuotationSchema = zod_1.z.object({
    clientId: zod_1.z.string().optional(),
    createdBy: zod_1.z.string().nullable().optional(),
    notes: zod_1.z.string().nullable().optional(),
    taxPercent: zod_1.z.number().optional(),
    lines: zod_1.z.array(zod_1.z.object({ description: zod_1.z.string(), quantity: zod_1.z.number().min(0), unitPrice: zod_1.z.number().min(0) })).min(1),
    transformationId: zod_1.z.string().nullable().optional(),
});
exports.quotationsController = {
    list: async (req, res) => {
        try {
            const quotes = await db_1.default.quotation.findMany({ include: { lines: true, client: true } });
            res.json({ success: true, data: quotes });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Failed to list quotations' });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const quote = await db_1.default.quotation.findUnique({ where: { id }, include: { lines: true, client: true } });
            if (!quote)
                return res.status(404).json({ success: false, error: 'Quotation not found' });
            res.json({ success: true, data: quote });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Failed to get quotation' });
        }
    },
    create: async (req, res) => {
        try {
            const parse = createQuotationSchema.safeParse(req.body);
            if (!parse.success)
                return res.status(400).json({ success: false, error: parse.error.flatten() });
            const payload = parse.data;
            const seq = await getNextSequence('quotation');
            const padded = String(seq).padStart(4, '0');
            const quotationNumber = `COT-${padded}`;
            const lines = payload.lines || [];
            let subtotal = 0;
            for (const l of lines) {
                const lineTotal = Number(l.quantity) * Number(l.unitPrice);
                const tmp = l;
                tmp.lineTotal = lineTotal;
                subtotal += lineTotal;
            }
            const taxPercent = payload.taxPercent != null ? Number(payload.taxPercent) : 16;
            const taxAmount = (Number(subtotal) * Number(taxPercent)) / 100;
            const totalAmount = subtotal + taxAmount;
            const created = await db_1.default.quotation.create({
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
                        create: lines.map((l) => ({
                            productId: l.productId || null,
                            description: l.description || '',
                            quantity: l.quantity || 0,
                            unitPrice: l.unitPrice || 0,
                            lineTotal: l.lineTotal || 0,
                        })),
                    },
                },
                include: { lines: true, client: true },
            });
            res.status(201).json({ success: true, data: created });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Failed to create quotation' });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const payload = req.body;
            const existing = await db_1.default.quotation.findUnique({ where: { id }, include: { lines: true } });
            if (!existing)
                return res.status(404).json({ success: false, error: 'Quotation not found' });
            if (payload.lines) {
                await db_1.default.quotationLine.deleteMany({ where: { quotationId: id } });
                let subtotal = 0;
                for (const l of payload.lines) {
                    const lineTotal = Number(l.quantity) * Number(l.unitPrice);
                    subtotal += lineTotal;
                    await db_1.default.quotationLine.create({ data: {
                            quotationId: id,
                            productId: l.productId || null,
                            description: l.description || '',
                            quantity: l.quantity || 0,
                            unitPrice: l.unitPrice || 0,
                            lineTotal: lineTotal,
                        } });
                }
                const taxPercent = payload.taxPercent != null ? Number(payload.taxPercent) : existing.taxPercent;
                const taxAmount = (Number(subtotal) * Number(taxPercent)) / 100;
                const totalAmount = subtotal + taxAmount;
                payload.subtotal = subtotal;
                payload.taxAmount = taxAmount;
                payload.totalAmount = totalAmount;
            }
            const updated = await db_1.default.quotation.update({ where: { id }, data: payload, include: { lines: true, client: true } });
            res.json({ success: true, data: updated });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Failed to update quotation' });
        }
    },
    convertToInvoice: async (req, res) => {
        try {
            const { id } = req.params;
            const quote = await db_1.default.quotation.findUnique({ where: { id }, include: { lines: true, client: true } });
            if (!quote)
                return res.status(404).json({ success: false, error: 'Quotation not found' });
            const seq = await getNextSequence('invoice');
            const padded = String(seq).padStart(4, '0');
            const invoiceNumber = `INV-${padded}`;
            if (!quote.clientId)
                return res.status(400).json({ success: false, error: 'Quotation has no clientId, cannot convert to invoice' });
            const created = await db_1.default.invoice.create({
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
            });
            res.json({ success: true, data: created });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Failed to convert quotation' });
        }
    },
    pdf: async (req, res) => {
        try {
            const { id } = req.params;
            const quote = await db_1.default.quotation.findUnique({ where: { id }, include: { lines: true, client: true } });
            if (!quote)
                return res.status(404).json({ success: false, error: 'Quotation not found' });
            const doc = new pdfkit_1.default({ size: 'A4', margin: 50 });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=\"${quote.quotationNumber}.pdf\"`);
            doc.fontSize(20).text('SHADEX - Cotización', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Número: ${quote.quotationNumber}`);
            doc.text(`Fecha: ${new Date(quote.createdAt).toLocaleDateString()}`);
            doc.moveDown();
            if (quote.client) {
                doc.text(`Cliente: ${quote.client.name}`);
                if (quote.client.email)
                    doc.text(`Email: ${quote.client.email}`);
                if (quote.client.phone)
                    doc.text(`Tel: ${quote.client.phone}`);
            }
            doc.moveDown();
            doc.text('Líneas:');
            doc.moveDown(0.5);
            const tableTop = doc.y;
            doc.font('Helvetica-Bold');
            doc.text('Descripción', 50, tableTop);
            doc.text('Cantidad', 300, tableTop);
            doc.text('Precio', 370, tableTop);
            doc.text('Importe', 460, tableTop);
            doc.font('Helvetica');
            let y = tableTop + 20;
            for (const line of quote.lines) {
                doc.text(line.description, 50, y);
                doc.text(String(line.quantity), 300, y);
                doc.text(String(line.unitPrice), 370, y);
                doc.text(String(line.lineTotal), 460, y);
                y += 20;
            }
            doc.moveTo(50, y + 10).lineTo(540, y + 10).stroke();
            doc.moveDown();
            doc.text(`Subtotal: ${quote.subtotal}`, { align: 'right' });
            doc.text(`IVA (${quote.taxPercent}%): ${quote.taxAmount}`, { align: 'right' });
            doc.text(`Total: ${quote.totalAmount}`, { align: 'right' });
            doc.end();
            doc.pipe(res);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Failed to generate PDF' });
        }
    }
};
//# sourceMappingURL=quotations.controller.js.map