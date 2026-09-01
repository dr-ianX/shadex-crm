import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: (process.env.CORS_ORIGIN || '*').split(',').filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'SHADEX OS API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes (simplified for new schema)
import { authController } from './controllers/auth.controller'
import { authMiddleware, requireRole } from './middleware/auth.middleware'
import { authRateLimit, apiRateLimit } from './middleware/rate-limit.middleware'
import { upload } from './middleware/upload.middleware'
import { uploadController } from './controllers/upload.controller'

app.use('/api/v1', apiRateLimit)

app.get('/api/v1', (req: Request, res: Response) => {
  res.json({
    message: 'SHADEX OS API v1',
    version: '1.0.0',
    status: 'Operational - Core modules implemented',
    endpoints: {
      auth: {
        login: 'POST /api/v1/auth/login',
        refresh: 'POST /api/v1/auth/refresh',
        logout: 'POST /api/v1/auth/logout'
      },
      clients: {
        list: 'GET /api/v1/clients',
        search: 'GET /api/v1/clients/search',
        getById: 'GET /api/v1/clients/:id',
        create: 'POST /api/v1/clients',
        update: 'PUT /api/v1/clients/:id',
        delete: 'DELETE /api/v1/clients/:id'
      },
      leads: {
        list: 'GET /api/v1/leads',
        getById: 'GET /api/v1/leads/:id',
        getByClient: 'GET /api/v1/leads/client/:clientId',
        funnelStats: 'GET /api/v1/leads/funnel-stats',
        search: 'GET /api/v1/leads/search',
        create: 'POST /api/v1/leads',
        update: 'PUT /api/v1/leads/:id',
        updateStatus: 'PATCH /api/v1/leads/:id/status',
        delete: 'DELETE /api/v1/leads/:id'
      },
      quotations: {
        list: 'GET /api/v1/quotations',
        getById: 'GET /api/v1/quotations/:id',
        create: 'POST /api/v1/quotations',
        update: 'PUT /api/v1/quotations/:id',
        updateStatus: 'PATCH /api/v1/quotations/:id/status',
        pdf: 'GET /api/v1/quotations/:id/pdf',
        delete: 'DELETE /api/v1/quotations/:id'
      },
      products: {
        list: 'GET /api/v1/products',
        categories: 'GET /api/v1/products/categories',
        search: 'GET /api/v1/products/search',
        getById: 'GET /api/v1/products/:id',
        getBySku: 'GET /api/v1/products/sku/:sku',
        create: 'POST /api/v1/products',
        update: 'PUT /api/v1/products/:id',
        delete: 'DELETE /api/v1/products/:id'
      },
      inventory: {
        listRolls: 'GET /api/v1/inventory/rolls',
        getRollById: 'GET /api/v1/inventory/rolls/:id',
        createRoll: 'POST /api/v1/inventory/rolls',
        updateRoll: 'PUT /api/v1/inventory/rolls/:id',
        getMovements: 'GET /api/v1/inventory/movements',
        createMovement: 'POST /api/v1/inventory/movements',
        listItems: 'GET /api/v1/inventory/items',
        getLowStock: 'GET /api/v1/inventory/low-stock',
        getStats: 'GET /api/v1/inventory/stats'
      },
      finance: {
        listPayments: 'GET /api/v1/finance/payments',
        getPaymentById: 'GET /api/v1/finance/payments/:id',
        createPayment: 'POST /api/v1/finance/payments',
        updatePayment: 'PUT /api/v1/finance/payments/:id',
        updatePaymentStatus: 'PATCH /api/v1/finance/payments/:id/status',
        getAccountsReceivable: 'GET /api/v1/finance/accounts-receivable',
        listExpenses: 'GET /api/v1/finance/expenses',
        createExpense: 'POST /api/v1/finance/expenses',
        calculateProjectMargin: 'GET /api/v1/finance/projects/:projectId/margin',
        getFinancialSummary: 'GET /api/v1/finance/summary'
      },
      warranties: {
        list: 'GET /api/v1/warranties',
        getById: 'GET /api/v1/warranties/:id',
        getByQRCode: 'GET /api/v1/warranties/qr/:qrCode',
        create: 'POST /api/v1/warranties',
        update: 'PUT /api/v1/warranties/:id',
        pdf: 'GET /api/v1/warranties/:id/pdf',
        getClaims: 'GET /api/v1/warranties/claims',
        createClaim: 'POST /api/v1/warranties/:warrantyId/claims',
        updateClaimStatus: 'PATCH /api/v1/warranties/claims/:claimId/status'
      },
      installations: {
        list: 'GET /api/v1/installations',
        getById: 'GET /api/v1/installations/:id',
        create: 'POST /api/v1/installations',
        update: 'PUT /api/v1/installations/:id',
        updateStatus: 'PATCH /api/v1/installations/:id/status',
        getChecklist: 'GET /api/v1/installations/:installationId/checklist',
        updateChecklist: 'PUT /api/v1/installations/:installationId/checklist',
        getEvidence: 'GET /api/v1/installations/:installationId/evidence',
        addEvidence: 'POST /api/v1/installations/:installationId/evidence',
        updateElectricalInfo: 'PUT /api/v1/installations/:installationId/electrical',
        workOrderPDF: 'GET /api/v1/installations/:id/work-order-pdf'
      },
      health: 'GET /health'
    }
  });
});

// Auth
app.post('/api/v1/auth/login', authRateLimit, authController.login)
app.post('/api/v1/auth/refresh', authController.refresh)
app.post('/api/v1/auth/logout', authController.logout)

// Require auth for all other /api/v1 routes
app.use('/api/v1', authMiddleware)

import { auditMiddleware } from './middleware/audit.middleware'
app.use('/api/v1', auditMiddleware)

// Auth (change password requires auth)
app.post('/api/v1/auth/change-password', authController.changePassword)

// Clients - Updated with new schema
import { clientsController } from './controllers/clients.controller'
app.get('/api/v1/clients', clientsController.list)
app.get('/api/v1/clients/search', clientsController.search)
app.get('/api/v1/clients/:id', clientsController.getById)
app.post('/api/v1/clients', clientsController.create)
app.put('/api/v1/clients/:id', clientsController.update)
app.delete('/api/v1/clients/:id', clientsController.delete)

// Company
import { companyController } from './controllers/company.controller'
app.get('/api/v1/company', companyController.get)
app.put('/api/v1/company', companyController.update)

// Leads
import { leadsController } from './controllers/leads.controller'
app.get('/api/v1/leads/funnel-stats', leadsController.getFunnelStats)
app.get('/api/v1/leads', leadsController.list)
app.get('/api/v1/leads/:id', leadsController.getById)
app.get('/api/v1/leads/client/:clientId', leadsController.getByClient)
app.get('/api/v1/leads/search', leadsController.search)
app.post('/api/v1/leads', leadsController.create)
app.put('/api/v1/leads/:id', leadsController.update)
app.patch('/api/v1/leads/:id/status', leadsController.updateStatus)
app.delete('/api/v1/leads/:id', leadsController.delete)

// Projects - Center of operations
import { projectsController } from './controllers/projects.controller'
app.get('/api/v1/projects', projectsController.list)
app.get('/api/v1/projects/:id', projectsController.getById)
app.post('/api/v1/projects', projectsController.create)
app.put('/api/v1/projects/:id', projectsController.update)
app.patch('/api/v1/projects/:id/status', projectsController.updateStatus)
app.get('/api/v1/projects/:id/profitability', projectsController.getProfitability)
app.delete('/api/v1/projects/:id', projectsController.delete)

// Spaces - Medidas y levantamiento
import { spacesController } from './controllers/spaces.controller'
app.get('/api/v1/projects/:projectId/spaces', spacesController.listByProject)
app.post('/api/v1/projects/:projectId/spaces', spacesController.create)
app.put('/api/v1/spaces/:id', spacesController.update)
app.delete('/api/v1/spaces/:id', spacesController.delete)

// Quotations - New implementation with versioning
import { quotationsController } from './controllers/quotations.controller'
app.get('/api/v1/quotations', quotationsController.list)
app.get('/api/v1/quotations/:id', quotationsController.getById)
app.post('/api/v1/quotations', quotationsController.create)
app.put('/api/v1/quotations/:id', quotationsController.update)
app.patch('/api/v1/quotations/:id/status', quotationsController.updateStatus)
app.post('/api/v1/quotations/:id/version', quotationsController.createVersion)
app.get('/api/v1/quotations/:id/pdf', quotationsController.pdf)
app.delete('/api/v1/quotations/:id', quotationsController.delete)

// Products - SHADEX catalog
import { productsController } from './controllers/products.controller'
app.get('/api/v1/products', productsController.list)
app.get('/api/v1/products/categories', productsController.getCategories)
app.get('/api/v1/products/search', productsController.search)
app.get('/api/v1/products/:id', productsController.getById)
app.get('/api/v1/products/sku/:sku', productsController.getBySku)
app.post('/api/v1/products', authMiddleware, requireRole(['Admin','InventoryManager']), productsController.create)
app.put('/api/v1/products/:id', authMiddleware, requireRole(['Admin','InventoryManager']), productsController.update)
app.delete('/api/v1/products/:id', productsController.delete)

// Inventory - Roll control and movements
import { inventoryController } from './controllers/inventory.controller'
app.get('/api/v1/inventory/rolls', inventoryController.listRolls)
app.get('/api/v1/inventory/rolls/:id', inventoryController.getRollById)
app.post('/api/v1/inventory/rolls/:rollId/reserve', inventoryController.reserveForProject)
app.post('/api/v1/inventory/rolls/:rollId/consume', inventoryController.consumeForProject)
app.post('/api/v1/inventory/rolls', authMiddleware, requireRole(['Admin','InventoryManager']), inventoryController.createRoll)
app.put('/api/v1/inventory/rolls/:id', authMiddleware, requireRole(['Admin','InventoryManager']), inventoryController.updateRoll)
app.get('/api/v1/inventory/movements', inventoryController.getMovements)
app.post('/api/v1/inventory/movements', authMiddleware, requireRole(['Admin','InventoryManager']), inventoryController.createMovement)
app.get('/api/v1/inventory/items', inventoryController.listItems)
app.get('/api/v1/inventory/low-stock', inventoryController.getLowStock)
app.get('/api/v1/inventory/stats', inventoryController.getStats)

// Finance - Payments, expenses, margins
import { financeController } from './controllers/finance.controller'
app.get('/api/v1/finance/payments', financeController.listPayments)
app.get('/api/v1/finance/payments/:id', financeController.getPaymentById)
app.post('/api/v1/finance/payments', financeController.createPayment)
app.put('/api/v1/finance/payments/:id', financeController.updatePayment)
app.patch('/api/v1/finance/payments/:id/status', financeController.updatePaymentStatus)
app.get('/api/v1/finance/accounts-receivable', financeController.getAccountsReceivable)
app.get('/api/v1/finance/expenses', financeController.listExpenses)
app.post('/api/v1/finance/expenses', authMiddleware, requireRole(['Admin']), financeController.createExpense)
app.get('/api/v1/finance/projects/:projectId/margin', financeController.calculateProjectMargin)
app.get('/api/v1/finance/summary', financeController.getFinancialSummary)

// Warranties - Digital warranties with QR
import { warrantiesController } from './controllers/warranties.controller'
app.get('/api/v1/warranties', warrantiesController.list)
app.get('/api/v1/warranties/:id', warrantiesController.getById)
app.get('/api/v1/warranties/qr/:qrCode', warrantiesController.getByQRCode)
app.post('/api/v1/warranties', warrantiesController.create)
app.put('/api/v1/warranties/:id', warrantiesController.update)
app.get('/api/v1/warranties/:id/claims', warrantiesController.getClaims)
app.post('/api/v1/warranties/:warrantyId/claims', warrantiesController.createClaim)
app.patch('/api/v1/warranties/:warrantyId/claims/:claimId/status', warrantiesController.updateClaimStatus)

// Installations - Work orders, checklists, evidence
import { installationsController } from './controllers/installations.controller'
app.get('/api/v1/installations', installationsController.list)
app.get('/api/v1/installations/:id', installationsController.getById)
app.post('/api/v1/installations', installationsController.create)
app.put('/api/v1/installations/:id', installationsController.update)
app.patch('/api/v1/installations/:id/status', installationsController.updateStatus)
app.get('/api/v1/installations/:installationId/checklist', installationsController.getChecklist)
app.put('/api/v1/installations/:installationId/checklist', installationsController.updateChecklist)
app.put('/api/v1/installations/:id/smart-film', installationsController.updateSmartFilm)
app.put('/api/v1/installations/:id/signatures', installationsController.updateSignatures)
app.get('/api/v1/installations/:installationId/evidence', installationsController.getEvidence)
app.post('/api/v1/installations/:installationId/evidence', installationsController.addEvidence)
app.delete('/api/v1/installations/evidence/:evidenceId', installationsController.deleteEvidence)
app.put('/api/v1/installations/:installationId/electrical', installationsController.updateElectricalInfo)
app.get('/api/v1/installations/:id/work-order-pdf', authMiddleware, requireRole(['Admin']), installationsController.generateWorkOrderPDF)

// Invoices - Facturación
import { invoicesController } from './controllers/invoices.controller'
app.get('/api/v1/invoices', invoicesController.list)
app.post('/api/v1/invoices', invoicesController.create)
app.get('/api/v1/invoices/:id', invoicesController.getById)
app.patch('/api/v1/invoices/:id/status', invoicesController.updateStatus)

// Notifications
import { notificationsController } from './controllers/notifications.controller'
app.get('/api/v1/notifications', notificationsController.list)
app.get('/api/v1/notifications/unread-count', notificationsController.getUnreadCount)
app.patch('/api/v1/notifications/:id/read', notificationsController.markAsRead)

// Audit log
import { auditController } from './controllers/audit.controller'
app.get('/api/v1/audit', auditController.list)
app.post('/api/v1/audit', auditController.create)

// Users
import { usersController } from './controllers/users.controller'
app.get('/api/v1/users', usersController.list)
app.post('/api/v1/users', usersController.create)
app.put('/api/v1/users/:id', usersController.update)
app.patch('/api/v1/users/:id/toggle', usersController.toggleActive)

// Analytics
import { analyticsController } from './controllers/analytics.controller'
app.get('/api/v1/analytics', analyticsController.get)

// Sales performance
import { salesPerformanceController } from './controllers/sales-performance.controller'
app.get('/api/v1/sales-performance', salesPerformanceController.list)

// Tasks
import { tasksController } from './controllers/tasks.controller'
app.get('/api/v1/tasks', tasksController.list)
app.post('/api/v1/tasks', tasksController.create)
app.put('/api/v1/tasks/:id', tasksController.update)
app.patch('/api/v1/tasks/:id/complete', tasksController.complete)
app.delete('/api/v1/tasks/:id', tasksController.delete)

app.post('/api/v1/upload', upload.single('file'), uploadController.uploadFile)
app.post('/api/v1/upload/multiple', upload.array('files', 10), uploadController.uploadMultiple)

// Search - Global search
import { searchController } from './controllers/search.controller'
app.get('/api/v1/search', searchController.global)

// Appointments - Agenda/Citas
import { appointmentsController } from './controllers/appointments.controller'
app.get('/api/v1/appointments', appointmentsController.list)
app.get('/api/v1/appointments/:id', appointmentsController.getById)
app.post('/api/v1/appointments', appointmentsController.create)
app.put('/api/v1/appointments/:id', appointmentsController.update)
app.patch('/api/v1/appointments/:id/status', appointmentsController.updateStatus)
app.delete('/api/v1/appointments/:id', appointmentsController.delete)

app.get('/api/v1/transformations', (req: Request, res: Response) => {
  res.json({ message: 'Transformations endpoint - migrating to new schema' })
})

app.get('/api/v1/technologies', (req: Request, res: Response) => {
  res.json({ message: 'Technologies endpoint - migrating to new schema' })
})

app.get('/api/v1/suppliers', (req: Request, res: Response) => {
  res.json({ message: 'Suppliers endpoint - migrating to new schema' })
})

app.get('/api/v1/quotations', (req: Request, res: Response) => {
  res.json({ message: 'Quotations endpoint - migrating to new schema' })
})

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`SHADEX OS API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;