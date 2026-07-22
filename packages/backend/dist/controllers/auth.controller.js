"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const db_1 = __importDefault(require("../db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const token_service_1 = require("../services/token.service");
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
            const tokens = await (0, token_service_1.generateTokensForUser)({ id: user.id, email: user.email, role: user.role });
            res.json({ success: true, data: { accessToken: tokens.access, refreshToken: tokens.refresh, user: { id: user.id, email: user.email, name: user.name, role: user.role } } });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ success: false, error: 'Login failed' });
        }
    },
    refresh: async (req, res) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken)
                return res.status(400).json({ success: false, error: 'Missing refreshToken' });
            const verified = await (0, token_service_1.verifyRefreshToken)(refreshToken);
            // rotation: create a new refresh token and revoke the previous
            const newRefresh = await (0, token_service_1.rotateRefreshToken)(verified.tokenId, verified.userId);
            // create new access token
            const user = await db_1.default.user.findUnique({ where: { id: verified.userId } });
            if (!user)
                return res.status(401).json({ success: false, error: 'User not found' });
            const tokens = await (0, token_service_1.generateTokensForUser)({ id: user.id, email: user.email, role: user.role });
            // Note: generateTokensForUser will create a new refresh token in DB; rotateRefreshToken already revoked the old and linked replacedBy
            res.json({ success: true, data: { accessToken: tokens.access, refreshToken: tokens.refresh } });
        }
        catch (err) {
            console.error('Refresh failed', err && err.message ? err.message : err);
            return res.status(401).json({ success: false, error: 'Invalid refresh token' });
        }
    },
    logout: async (req, res) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken)
                return res.status(400).json({ success: false, error: 'Missing refreshToken' });
            // verify to obtain tokenId
            const verified = await (0, token_service_1.verifyRefreshToken)(refreshToken);
            await (0, token_service_1.revokeRefreshToken)(verified.tokenId);
            res.json({ success: true });
        }
        catch (err) {
            console.error('Logout failed', err);
            // still respond success to avoid leaking info
            return res.status(200).json({ success: true });
        }
    }
};
//# sourceMappingURL=auth.controller.js.map