"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const db_1 = __importDefault(require("../db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'replace-with-a-long-random-string-ChangeMeNow!';
exports.authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                return res.status(400).json({ success: false, error: 'Missing credentials' });
            const user = await db_1.default.user.findUnique({ where: { email } });
            if (!user)
                return res.status(401).json({ success: false, error: 'Invalid credentials' });
            const ok = await bcryptjs_1.default.compare(password, user.password);
            if (!ok)
                return res.status(401).json({ success: false, error: 'Invalid credentials' });
            // jwt.sign typing can be strict in TS — cast to any to avoid overload issues
            const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
            res.json({ success: true, data: { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } } });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ success: false, error: 'Login failed' });
        }
    }
};
//# sourceMappingURL=auth.controller.js.map