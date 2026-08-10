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
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
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

// API Routes (implemented partially)
import { quotationsController } from './controllers/quotations.controller'
import { authController } from './controllers/auth.controller'
import { authMiddleware, requireRole } from './middleware/auth.middleware'

app.get('/api/v1', (req: Request, res: Response) => {
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
app.post('/api/v1/auth/login', authController.login)
app.post('/api/v1/auth/refresh', authController.refresh)
app.post('/api/v1/auth/logout', authController.logout)

// Quotations (protected for create/update/convert/pdf)
app.get('/api/v1/quotations', quotationsController.list)
app.get('/api/v1/quotations/:id', quotationsController.getById)
app.post('/api/v1/quotations', authMiddleware, requireRole(['Admin','Sales']), quotationsController.create)
app.put('/api/v1/quotations/:id', authMiddleware, requireRole(['Admin','Sales']), quotationsController.update)
app.post('/api/v1/quotations/:id/convert', authMiddleware, requireRole(['Admin','Sales']), quotationsController.convertToInvoice)
app.get('/api/v1/quotations/:id/pdf', authMiddleware, requireRole(['Admin','Sales']), quotationsController.pdf)

// Clients
import { clientsController } from './controllers/clients.controller'
app.get('/api/v1/clients', clientsController.list)
app.get('/api/v1/clients/search', clientsController.search)
app.get('/api/v1/clients/:id', clientsController.getById)
app.post('/api/v1/clients', authMiddleware, requireRole(['Admin','Sales']), clientsController.create)
app.put('/api/v1/clients/:id', authMiddleware, requireRole(['Admin']), clientsController.update)
app.delete('/api/v1/clients/:id', authMiddleware, requireRole(['Admin']), clientsController.delete)

// Transformations
import { transformationsController } from './controllers/transformations.controller'
app.get('/api/v1/transformations', transformationsController.list)
app.get('/api/v1/transformations/:id', transformationsController.getById)
app.get('/api/v1/transformations/client/:clientId', transformationsController.getByClient)
app.post('/api/v1/transformations', authMiddleware, requireRole(['Admin','Sales','Architect']), transformationsController.create)
app.put('/api/v1/transformations/:id', authMiddleware, requireRole(['Admin','Sales','Architect']), transformationsController.update)
app.patch('/api/v1/transformations/:id/status', authMiddleware, requireRole(['Admin','Sales','Architect']), transformationsController.updateStatus)
app.delete('/api/v1/transformations/:id', authMiddleware, requireRole(['Admin']), transformationsController.delete)

// Technologies
import { technologiesController } from './controllers/technologies.controller'
app.get('/api/v1/technologies', technologiesController.list)
app.get('/api/v1/technologies/categories', technologiesController.getCategories)
app.get('/api/v1/technologies/search', technologiesController.search)
app.get('/api/v1/technologies/:id', technologiesController.getById)
app.post('/api/v1/technologies', authMiddleware, requireRole(['Admin','InventoryManager']), technologiesController.create)
app.put('/api/v1/technologies/:id', authMiddleware, requireRole(['Admin','InventoryManager']), technologiesController.update)
app.delete('/api/v1/technologies/:id', authMiddleware, requireRole(['Admin']), technologiesController.delete)

// Suppliers
import { suppliersController } from './controllers/suppliers.controller'
app.get('/api/v1/suppliers', suppliersController.list)
app.get('/api/v1/suppliers/search', suppliersController.search)
app.get('/api/v1/suppliers/:id', suppliersController.getById)
app.post('/api/v1/suppliers', authMiddleware, requireRole(['Admin','InventoryManager']), suppliersController.create)
app.put('/api/v1/suppliers/:id', authMiddleware, requireRole(['Admin','InventoryManager']), suppliersController.update)
app.delete('/api/v1/suppliers/:id', authMiddleware, requireRole(['Admin']), suppliersController.delete)
app.post('/api/v1/suppliers/:id/evaluations', authMiddleware, requireRole(['Admin','InventoryManager']), suppliersController.addEvaluation)

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

import prisma from './db'
import { seedDemoClients, seedDemoUsers } from './seeds/seed'

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 SHADEX OS API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);

  // seed demo data if missing
  await seedDemoClients()
  await seedDemoUsers()
});

export default app;