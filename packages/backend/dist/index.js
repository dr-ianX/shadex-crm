"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Static files for uploads
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'SHADEX OS API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// API Routes (implemented partially)
const quotations_controller_1 = require("./controllers/quotations.controller");
const auth_controller_1 = require("./controllers/auth.controller");
const auth_middleware_1 = require("./middleware/auth.middleware");
app.get('/api/v1', (req, res) => {
    res.json({
        message: 'SHADEX OS API v1',
        version: '1.0.0',
        endpoints: {
            transformations: '/api/v1/transformations',
            clients: '/api/v1/clients',
            technologies: '/api/v1/technologies',
            inventory: '/api/v1/inventory',
            finance: '/api/v1/finance',
            support: '/api/v1/support',
            suppliers: '/api/v1/suppliers',
            quotations: '/api/v1/quotations',
            auth_login: '/api/v1/auth/login',
            auth_refresh: '/api/v1/auth/refresh',
            auth_logout: '/api/v1/auth/logout'
        }
    });
});
// Auth
app.post('/api/v1/auth/login', auth_controller_1.authController.login);
app.post('/api/v1/auth/refresh', auth_controller_1.authController.refresh);
app.post('/api/v1/auth/logout', auth_controller_1.authController.logout);
// Quotations (protected for create/update/convert/pdf)
app.get('/api/v1/quotations', quotations_controller_1.quotationsController.list);
app.get('/api/v1/quotations/:id', quotations_controller_1.quotationsController.getById);
app.post('/api/v1/quotations', auth_middleware_1.authMiddleware, (0, auth_middleware_1.requireRole)(['Admin', 'Sales']), quotations_controller_1.quotationsController.create);
app.put('/api/v1/quotations/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.requireRole)(['Admin', 'Sales']), quotations_controller_1.quotationsController.update);
app.post('/api/v1/quotations/:id/convert', auth_middleware_1.authMiddleware, (0, auth_middleware_1.requireRole)(['Admin', 'Sales']), quotations_controller_1.quotationsController.convertToInvoice);
app.get('/api/v1/quotations/:id/pdf', auth_middleware_1.authMiddleware, (0, auth_middleware_1.requireRole)(['Admin', 'Sales']), quotations_controller_1.quotationsController.pdf);
// Clients
const clients_controller_1 = require("./controllers/clients.controller");
app.get('/api/v1/clients', clients_controller_1.clientsController.list);
app.post('/api/v1/clients', auth_middleware_1.authMiddleware, (0, auth_middleware_1.requireRole)(['Admin', 'Sales']), clients_controller_1.clientsController.create);
app.put('/api/v1/clients/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.requireRole)(['Admin']), clients_controller_1.clientsController.update);
app.get('/api/v1/clients/:id', clients_controller_1.clientsController.getById);
// Transformations
const transformations_controller_1 = require("./controllers/transformations.controller");
app.get('/api/v1/transformations', transformations_controller_1.transformationsController.list);
app.get('/api/v1/transformations/:id', transformations_controller_1.transformationsController.getById);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.path} not found`
    });
});
const seed_1 = require("./seeds/seed");
// Start server
app.listen(PORT, async () => {
    console.log(`🚀 SHADEX OS API running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API: http://localhost:${PORT}`);
    console.log(`❤️  Health: http://localhost:${PORT}/health`);
    // seed demo data if missing
    await (0, seed_1.seedDemoClients)();
    await (0, seed_1.seedDemoUsers)();
});
exports.default = app;
//# sourceMappingURL=index.js.map