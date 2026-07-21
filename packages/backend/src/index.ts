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
import { authMiddleware, requireRole } from './middleware/auth'

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
      auth_login: '/api/v1/auth/login'
    }
  });
});

// Auth
app.post('/api/v1/auth/login', authController.login)

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
app.post('/api/v1/clients', authMiddleware, requireRole(['Admin','Sales']), clientsController.create)
app.put('/api/v1/clients/:id', authMiddleware, requireRole(['Admin']), clientsController.update)
app.get('/api/v1/clients/:id', clientsController.getById)

// Transformations
import { transformationsController } from './controllers/transformations.controller'
app.get('/api/v1/transformations', transformationsController.list)
app.get('/api/v1/transformations/:id', transformationsController.getById)

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

async function seedDemoClients() {
  try {
    const count = await prisma.client.count()
    if (count === 0) {
      console.log('Seeding demo clients...')
      await prisma.client.createMany({
        data: [
          { code: 'CL-0001', name: 'Cliente Demo Uno', email: 'cliente1@example.com', phone: '+5215512345678', clientType: 'Regular' },
          { code: 'CL-0002', name: 'Cliente Demo Dos', email: 'cliente2@example.com', phone: '+5215512345679', clientType: 'Regular' },
        ],
      })
      console.log('Demo clients seeded')
    }
  } catch (err) {
    console.error('Failed to seed demo clients', err)
  }
}

async function seedDemoUsers() {
  try {
    const count = await prisma.user.count()
    if (count === 0) {
      console.log('Seeding demo users...')
      const bcrypt = require('bcryptjs')
      const adminPass = await bcrypt.hash('admin123', 10)
      const salesPass = await bcrypt.hash('sales123', 10)
      // create users individually so hashing values are preserved correctly in DB
      await prisma.user.create({ data: { email: 'admin@shadex.local', password: adminPass, name: 'Admin', role: 'Admin' } })
      await prisma.user.create({ data: { email: 'sales@shadex.local', password: salesPass, name: 'Sales', role: 'Sales' } })
      console.log('Demo users seeded')
    }
  } catch (err) {
    console.error('Failed to seed demo users', err)
  }
}

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