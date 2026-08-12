import express from 'express';
import { body, query, param, validationResult } from 'express-validator';
import cron from 'node-cron';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Import controllers
import { 
  getDashboardMetrics,
  getTransformationProgress,
  getClientOverview,
  getTechnologiesList,
  getDocumentsList,
  getCalendarEvents,
  getTasksByUser,
  getOverdueTasks,
  getHighPriorityPendingTasks,
  getUpcomingTasks,
  getTasksByStatus,
  getTasksByTransformation
} from './controllers/dashboard.controller';

import { 
  getTransformations,
  getTransformationById,
  createTransformation,
  updateTransformation,
  deleteTransformation,
  closeTransformation,
  scheduleInstallation
} from './controllers/transformations.controller';

import { 
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  searchClients
} from './controllers/clients.controller';

import { 
  generateQuotation,
  getQuotations,
  getQuotationById
} from './controllers/quotations.controller';

import { 
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  uploadDocumentToTask
} from './controllers/documents.controller';

import { 
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getCalendarEventsByUser
} from './controllers/calendar.controller';

import { 
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  getWorkflows,
  executeWorkflow
} from './controllers/workflow.controller';

import { 
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  uploadDocumentToTask
} from './controllers/tasks.controller';

import { 
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from './controllers/users.controller';

const router = express.Router();

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|csv|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
    }
  }
});

// ==================== DASHBOARD ROUTES ====================
router.get('/api/dashboard/metrics', getDashboardMetrics);
router.get('/api/dashboard/transformation/:id/progress', getTransformationProgress);
router.get('/api/dashboard/client/:id/overview', getClientOverview);

// ==================== TECHNOLOGIES ROUTES ====================
router.get('/api/technologies', getTechnologiesList);

// ==================== DOCUMENTS ROUTES ====================
router.post(
  '/api/documents',
  upload.single('file'),
  body('name').notEmpty().withMessage('Document name is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const document = await uploadDocument(req, res);
      res.status(201).json(document);
    } catch (error) {
      console.error('Error uploading document:', error);
      res.status(500).json({ error: 'Failed to upload document' });
    }
  }
);

router.get('/api/documents', getDocuments);
router.get('/api/documents/:id', getDocumentById);
router.delete('/api/documents/:id', deleteDocument);

// ==================== CALENDAR ROUTES ====================
router.post(
  '/api/calendar/events',
  body('title').notEmpty().withMessage('Event title is required'),
  body('start').notEmpty().withMessage('Start time is required'),
  body('end').notEmpty().withMessage('End time is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const event = await createCalendarEvent(req, res);
      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating calendar event:', error);
      res.status(500).json({ error: 'Failed to create calendar event' });
    }
  }
);

router.get('/api/calendar/events', getCalendarEventsByUser);
router.put('/api/calendar/events/:id', updateCalendarEvent);
router.delete('/api/calendar/events/:id', deleteCalendarEvent);

// ==================== TASKS ROUTES ====================
router.get('/api/tasks', getTasks);
router.get('/api/tasks/overdue', getOverdueTasks);
router.get('/api/tasks/high-priority-pending', getHighPriorityPendingTasks);
router.get('/api/tasks/upcoming', getUpcomingTasks);
router.get('/api/tasks/status/:status', getTasksByStatus);
router.get('/api/tasks/transformation/:transformationId', getTasksByTransformation);
router.get('/api/tasks/user/:userId', getTasksByUser);
router.post('/api/tasks', createTask);
router.put('/api/tasks/:id', updateTask);
router.delete('/api/tasks/:id', deleteTask);
router.get('/api/tasks/:id', getTaskById);

// ==================== WORKFLOW ROUTES ====================
router.post('/api/workflows', createWorkflow);
router.put('/api/workflows/:id', updateWorkflow);
router.delete('/api/workflows/:id', deleteWorkflow);
router.get('/api/workflows', getWorkflows);
router.post('/api/workflows/execute/:id', executeWorkflow);

// ==================== CLIENTS ROUTES ====================
router.get('/api/clients', getClients);
router.get('/api/clients/search', searchClients);
router.get('/api/clients/:id', getClientById);
router.post('/api/clients', createClient);
router.put('/api/clients/:id', updateClient);
router.delete('/api/clients/:id', deleteClient);

// ==================== QUOTATIONS ROUTES ====================
router.post('/api/quotations', generateQuotation);
router.get('/api/quotations', getQuotations);
router.get('/api/quotations/:id', getQuotationById);

// ==================== TRANSFORMATIONS ROUTES ====================
router.get('/api/transformations', getTransformations);
router.get('/api/transformations/close/:id', closeTransformation);
router.post('/api/transformations/schedule-installation/:id', scheduleInstallation);
router.put('/api/transformations/:id', updateTransformation);
router.delete('/api/transformations/:id', deleteTransformation);
router.post('/api/transformations/:id/installation', scheduleInstallation);
router.get('/api/transformations/:id', getTransformationById);
router.post('/api/transformations', createTransformation);

// ==================== USERS ROUTES ====================
router.get('/api/users', getUsers);
router.get('/api/users/:id', getUserById);
router.post('/api/users', createUser);
router.put('/api/users/:id', updateUser);
router.delete('/api/users/:id', deleteUser);

// ==================== TASKS - DOCUMENT UPLOAD (SEPARATE ROUTE) ====================
router.post(
  '/api/tasks/:id/documents/upload',
  upload.single('file'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const document = await uploadDocumentToTask(req, res);
      res.status(201).json(document);
    } catch (error) {
      console.error('Error uploading document to task:', error);
      res.status(500).json({ error: 'Failed to upload document' });
    }
  }
);

// ==================== EXPORT FUNCTIONS FOR TESTING ====================
export { 
  getDashboardMetrics,
  getTransformationProgress,
  getClientOverview,
  getTechnologiesList,
  getDocumentsList,
  getCalendarEvents,
  getTasksByUser,
  getOverdueTasks,
  getHighPriorityPendingTasks,
  getUpcomingTasks,
  getTasksByStatus,
  getTasksByTransformation
};

export { 
  getTransformations,
  getTransformationById,
  createTransformation,
  updateTransformation,
  deleteTransformation,
  closeTransformation,
  scheduleInstallation
};

export { 
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  searchClients
};

export { 
  generateQuotation,
  getQuotations,
  getQuotationById
};

export { 
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  uploadDocumentToTask
};

export { 
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getCalendarEventsByUser
};

export { 
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  getWorkflows,
  executeWorkflow
};

export { 
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  uploadDocumentToTask
};

export { 
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};

export default router;