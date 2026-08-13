import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==================== SUPPLIER CRUD OPERATIONS ====================

/**
 * Get all suppliers with optional filtering and pagination
 */
export const getSuppliers = async (req: Request, res: Response): Promise<any[]> => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { contactName: { contains: search as string, mode: 'insensitive' } },
        { taxId: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    if (status) {
      where.status = status as any;
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        select: {
          id: true,
          name: true,
          contactName: true,
          email: true,
          phone: true,
          taxId: true,
          address: true,
          website: true,
          status: true,
          notes: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum
      }),
      prisma.supplier.count({ where })
    ]);

    return {
      data: suppliers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
    throw error;
  }
};

/**
 * Get a single supplier by ID
 */
export const getSupplierById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        contactName: true,
        email: true,
        phone: true,
        taxId: true,
        address: true,
        website: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    return res.json(supplier);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: 'Failed to fetch supplier' });
    throw error;
  }
};

/**
 * Create a new supplier
 */
export const createSupplier = async (req: Request, res: Response): Promise<any> => {
  try {
    const { 
      name, 
      contactName, 
      email, 
      phone, 
      taxId, 
      address, 
      website, 
      status = 'active',
      notes 
    } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const existingSupplier = await prisma.supplier.findUnique({
      where: { email }
    });

    if (existingSupplier) {
      return res.status(409).json({ error: 'A supplier with this email already exists' });
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        contactName,
        email,
        phone,
        taxId,
        address,
        website,
        status,
        notes
      },
      select: {
        id: true,
        name: true,
        contactName: true,
        email: true,
        phone: true,
        taxId: true,
        address: true,
        website: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(201).json(supplier);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Failed to create supplier' });
    throw error;
  }
};

/**
 * Update an existing supplier
 */
export const updateSupplier = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Fields that cannot be updated
    const forbiddenFields = ['id', 'createdAt', 'updatedAt'];
    const filteredUpdates: any = {};
    
    for (const [key, value] of Object.entries(updates)) {
      if (!forbiddenFields.includes(key)) {
        filteredUpdates[key] = value;
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const supplier = await prisma.supplier.update({
      where: { id },
      data: filteredUpdates,
      select: {
        id: true,
        name: true,
        contactName: true,
        email: true,
        phone: true,
        taxId: true,
        address: true,
        website: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.json(supplier);
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Failed to update supplier' });
    throw error;
  }
};

/**
 * Delete a supplier
 */
export const deleteSupplier = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    await prisma.supplier.delete({
      where: { id }
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Failed to delete supplier' });
    throw error;
  }
};

/**
 * Delete a supplier by ID (alternative method with direct ID parameter)
 */
export const deleteSupplierById = async (id: string): Promise<any> => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id }
    });

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    await prisma.supplier.delete({
      where: { id }
    });

    return { message: 'Supplier deleted successfully' };
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw error;
  }
};

/**
 * Search suppliers by name, email, phone or tax ID
 */
export const searchSuppliers = async (req: Request, res: Response): Promise<any[]> => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return [];
    }

    const suppliers = await prisma.supplier.findMany({
      where: {
        OR: [
          { name: { contains: query as string, mode: 'insensitive' } },
          { email: { contains: query as string, mode: 'insensitive' } },
          { contactName: { contains: query as string, mode: 'insensitive' } },
          { phone: { contains: query as string, mode: 'insensitive' } },
          { taxId: { contains: query as string, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        contactName: true,
        email: true,
        phone: true,
        taxId: true,
        address: true,
        website: true,
        status: true,
        createdAt: true
      },
      take: 50
    });

    return suppliers;
  } catch (error) {
    console.error('Error searching suppliers:', error);
    res.status(500).json({ error: 'Failed to search suppliers' });
    throw error;
  }
};

/**
 * Get active suppliers only
 */
export const getActiveSuppliers = async (req: Request, res: Response): Promise<any> => {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        name: true,
        contactName: true,
        email: true,
        phone: true,
        taxId: true,
        address: true,
        website: true,
        status: true,
        createdAt: true
      },
      orderBy: { name: 'asc' }
    });

    return suppliers;
  } catch (error) {
    console.error('Error fetching active suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch active suppliers' });
    throw error;
  }
};

/**
 * Get inactive suppliers only
 */
export const getInactiveSuppliers = async (req: Request, res: Response): Promise<any> => {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: { status: 'inactive' },
      select: {
        id: true,
        name: true,
        contactName: true,
        email: true,
        phone: true,
        taxId: true,
        address: true,
        website: true,
        status: true,
        createdAt: true
      },
      orderBy: { name: 'asc' }
    });

    return suppliers;
  } catch (error) {
    console.error('Error fetching inactive suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch inactive suppliers' });
    throw error;
  }
};

/**
 * Get supplier statistics
 */
export const getSupplierStats = async (req: Request, res: Response): Promise<any> => {
  try {
    const [total, active, inactive] = await Promise.all([
      prisma.supplier.count(),
      prisma.supplier.count({ where: { status: 'active' } }),
      prisma.supplier.count({ where: { status: 'inactive' } })
    ]);

    return {
      total,
      active,
      inactive,
      percentageActive: Math.round((active / total) * 100) || 0
    };
  } catch (error) {
    console.error('Error fetching supplier stats:', error);
    res.status(500).json({ error: 'Failed to fetch supplier statistics' });
    throw error;
  }
};

/**
 * Get supplier statistics by category
 */
export const getSupplierStatsByCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const [total, active, inactive] = await Promise.all([
      prisma.supplier.count(),
      prisma.supplier.count({ where: { status: 'active' } }),
      prisma.supplier.count({ where: { status: 'inactive' } })
    ]);

    return {
      total,
      active,
      inactive,
      percentageActive: Math.round((active / total) * 100) || 0,
      percentageInactive: Math.round((inactive / total) * 100) || 0
    };
  } catch (error) {
    console.error('Error fetching supplier stats by category:', error);
    res.status(500).json({ error: 'Failed to fetch supplier statistics by category' });
    throw error;
  }
};

export default {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  deleteSupplierById,
  searchSuppliers,
  getActiveSuppliers,
  getInactiveSuppliers,
  getSupplierStats,
  getSupplierStatsByCategory
};
