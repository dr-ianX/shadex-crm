"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformationsController = void 0;
const db_1 = __importDefault(require("../db"));
exports.transformationsController = {
    list: async (req, res) => {
        try {
            const items = await db_1.default.transformation.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
            res.json({ success: true, data: items });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Failed to list transformations' });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await db_1.default.transformation.findUnique({ where: { id } });
            if (!item)
                return res.status(404).json({ success: false, error: 'Transformation not found' });
            res.json({ success: true, data: item });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Failed to get transformation' });
        }
    }
};
//# sourceMappingURL=transformations.controller.js.map