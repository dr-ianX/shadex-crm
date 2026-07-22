"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'replace-with-a-long-random-string-ChangeMeNow!';
const authMiddleware = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer '))
        return res.status(401).json({ success: false, error: 'Missing Authorization header' });
    const token = auth.split(' ')[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        if (!roles.includes(req.user.role))
            return res.status(403).json({ success: false, error: 'Forbidden' });
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.middleware.js.map