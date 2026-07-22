"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokensForUser = exports.revokeRefreshToken = exports.rotateRefreshToken = exports.verifyRefreshToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = require("crypto");
const db_1 = __importDefault(require("../db"));
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'replace-with-a-long-random-string-ChangeMeNow!';
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'replace-with-a-longer-random-string-ChangeMeNow!';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = async (userId) => {
    const tokenId = (0, crypto_1.randomUUID)();
    const payload = { userId, tokenId };
    const token = jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
    const expiresAt = new Date(Date.now() + msFromJwtExp(REFRESH_TOKEN_EXPIRES_IN));
    const tokenHash = await bcryptjs_1.default.hash(token, 10);
    // persist hashed token with tokenId so we can compare later (use any to avoid TS client mismatch until prisma client is regenerated)
    await db_1.default.refreshToken.create({
        data: {
            tokenId,
            tokenHash,
            userId,
            expiresAt
        }
    });
    return token;
};
exports.generateRefreshToken = generateRefreshToken;
// Helper: convert simple JWT expiresIn like "7d" or "15m" into ms. Supports: s, m, h, d
function msFromJwtExp(exp) {
    // exp is like '7d' or '15m' or '3600s'
    const match = /^(\d+)([smhd])$/.exec(exp);
    if (!match)
        return 7 * 24 * 60 * 60 * 1000;
    const n = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
        case 's': return n * 1000;
        case 'm': return n * 60 * 1000;
        case 'h': return n * 60 * 60 * 1000;
        case 'd': return n * 24 * 60 * 60 * 1000;
        default: return n * 1000;
    }
}
const verifyRefreshToken = async (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, REFRESH_TOKEN_SECRET);
        if (!payload || !payload.tokenId)
            throw new Error('Invalid refresh token payload');
        // find refresh token record by tokenId
        const record = await db_1.default.refreshToken.findUnique({ where: { tokenId: payload.tokenId } });
        if (!record)
            throw new Error('Refresh token not found');
        if (record.revoked)
            throw new Error('Refresh token revoked');
        if (new Date(record.expiresAt) < new Date())
            throw new Error('Refresh token expired');
        // compare raw token with stored hash
        const ok = await bcryptjs_1.default.compare(token, record.tokenHash);
        if (!ok)
            throw new Error('Refresh token mismatch');
        return { userId: payload.userId, tokenId: payload.tokenId, record };
    }
    catch (err) {
        throw err;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const rotateRefreshToken = async (oldTokenId, userId) => {
    // Mark old token revoked and create a new refresh token
    const newToken = await (0, exports.generateRefreshToken)(userId);
    // find new token's tokenId from jwt
    const newPayload = jsonwebtoken_1.default.verify(newToken, REFRESH_TOKEN_SECRET);
    // update previous record replacedById and revoked
    await db_1.default.refreshToken.updateMany({ where: { tokenId: oldTokenId }, data: { revoked: true, replacedById: newPayload.tokenId } });
    return newToken;
};
exports.rotateRefreshToken = rotateRefreshToken;
const revokeRefreshToken = async (tokenId) => {
    await db_1.default.refreshToken.updateMany({ where: { tokenId }, data: { revoked: true } });
};
exports.revokeRefreshToken = revokeRefreshToken;
const generateTokensForUser = async (user) => {
    const access = (0, exports.generateAccessToken)({ userId: user.id, role: user.role || 'User', email: user.email });
    const refresh = await (0, exports.generateRefreshToken)(user.id);
    return { access, refresh };
};
exports.generateTokensForUser = generateTokensForUser;
//# sourceMappingURL=token.service.js.map