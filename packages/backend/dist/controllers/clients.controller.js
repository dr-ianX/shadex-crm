"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientsController = void 0;
const db_1 = __importDefault(require("../db"));
exports.clientsController = {
    list: async (req, res) => {
        try {
            const clients = await db_1.default.client.findMany({ orderBy: { name: 'asc' } });
            res.json({ success: true, data: clients });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Failed to list clients' });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const client = await db_1.default.client.findUnique({ where: { id } });
            if (!client)
                return res.status(404).json({ success: false, error: 'Client not found' });
            res.json({ success: true, data: client });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Failed to get client' });
        }
    },
    create: async (req, res) => {
        try {
            const payload = req.body;
            const created = await db_1.default.client.create({ data: payload });
            res.status(201).json({ success: true, data: created });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Failed to create client' });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const payload = req.body;
            const existing = await db_1.default.client.findUnique({ where: { id } });
            if (!existing)
                return res.status(404).json({ success: false, error: 'Client not found' });
            const updated = await db_1.default.client.update({ where: { id }, data: payload });
            res.json({ success: true, data: updated });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Failed to update client' });
        }
    },
};
//# sourceMappingURL=clients.controller.js.map