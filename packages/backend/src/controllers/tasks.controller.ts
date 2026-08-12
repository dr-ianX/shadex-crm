import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        user: true,
        transformation: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        user: true,
        transformation: true,
      },
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, priority, dueDate, transformationId, assignedToId } = req.body;
    
    // Validate required fields
    if (!title || !description || !status || !priority || !transformationId) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        missing: ['title', 'description', 'status', 'priority', 'transformationId'].filter(f => !req.body[f])
      });
    }

    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate,
      transformationId,
    };

    // Only add assignedTo if provided (optional field)
    if (assignedToId) {
      const assignee = await prisma.user.findUnique({
        where: { id: parseInt(assignedToId) },
      });
      
      if (!assignee) {
        return res.status(404).json({ error: 'Assigned user not found' });
      }
      
      taskData.assignedTo = assignee;
    }

    const task = await prisma.task.create({
      data: taskData,
      include: {
        user: true,
        transformation: true,
      },
    });
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    const task = await prisma.task.update({
      where: { id },
      data: updates,
      include: {
        user: true,
        transformation: true,
      },
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    await prisma.task.delete({
      where: { id },
    });
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const getTasksByTransformation = async (req: Request, res: Response) => {
  try {
    const transformationId = parseInt(req.params.transformationId);
    const tasks = await prisma.task.findMany({
      where: { transformationId },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by transformation:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTasksByStatus = async (req: Request, res: Response) => {
  try {
    const status = req.params.status;
    const tasks = await prisma.task.findMany({
      where: { status },
      include: {
        user: true,
        transformation: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by status:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTasksByUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const tasks = await prisma.task.findMany({
      where: { userId },
      include: {
        transformation: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by user:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getOverdueTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        status: 'pending',
        dueDate: {
          lt: new Date(),
        },
      },
      include: {
        user: true,
        transformation: true,
      },
      orderBy: { dueDate: 'asc' },
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching overdue tasks:', error);
    res.status(500).json({ error: 'Failed to fetch overdue tasks' });
  }
};

export const getHighPriorityPendingTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        status: 'pending',
        priority: 'high',
      },
      include: {
        user: true,
        transformation: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching high priority pending tasks:', error);
    res.status(500).json({ error: 'Failed to fetch high priority pending tasks' });
  }
};

export const uploadDocumentToTask = async (req: Request, res: Response) => {
  try {
    // Validate task exists
    const taskId = parseInt(req.params.id);
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validate file is present
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { filename, mimetype, buffer } = req.file;

    // Generate unique document name
    const timestamp = Date.now();
    const uniqueName = `${timestamp}-${filename}`;
    const uploadPath = `uploads/documents/${uniqueName}`;

    // Save file to uploads/documents/ directory
    const fs = require('fs');
    const path = require('path');
    const docPath = path.join(__dirname, '..', '..', '..', uploadPath);
    
    fs.mkdirSync(path.dirname(docPath), { recursive: true });
    fs.writeFileSync(docPath, buffer);

    // Get user from request (assuming auth middleware sets req.user)
    const userId = req.user?.id || null;

    // Create document record with task association
    const documentData = {
      name: filename,
      mimeType: mimetype,
      size: req.file.size,
      path: uploadPath,
      taskId: taskId,
      uploadedBy: userId,
    };

    const document = await prisma.document.create({
      data: documentData,
      include: {
        task: true,
        uploader: true,
      },
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('Error uploading document to task:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};
