import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DocumentsController {
  async getAll(req: Request, res: Response) {
    try {
      const documents = await prisma.document.findMany({
        include: {
          client: true,
          technology: true,
          supplier: true,
        },
      });
      return res.json(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      return res.status(500).json({ error: 'Failed to fetch documents' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const document = await prisma.document.findUnique({
        where: { id },
        include: {
          client: true,
          technology: true,
          supplier: true,
        },
      });
      
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
      
      return res.json(document);
    } catch (error) {
      console.error('Error fetching document:', error);
      return res.status(500).json({ error: 'Failed to fetch document' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { client_id, technology_id, supplier_id, title, description, file_path, mime_type, category, tags, is_public } = req.body;
      
      const document = await prisma.document.create({
        data: {
          client_id,
          technology_id,
          supplier_id,
          title,
          description,
          file_path,
          mime_type,
          category,
          tags: JSON.parse(tags || '[]'),
          is_public: is_public || false,
        },
      });
      
      return res.status(201).json(document);
    } catch (error) {
      console.error('Error creating document:', error);
      return res.status(500).json({ error: 'Failed to create document' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      
      const document = await prisma.document.update({
        where: { id },
        data,
      });
      
      return res.json(document);
    } catch (error) {
      console.error('Error updating document:', error);
      return res.status(500).json({ error: 'Failed to update document' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await prisma.document.delete({
        where: { id },
      });
      
      return res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Error deleting document:', error);
      return res.status(500).json({ error: 'Failed to delete document' });
    }
  }

  async getByClientId(req: Request, res: Response) {
    try {
      const { client_id } = req.params;
      
      const documents = await prisma.document.findMany({
        where: { client_id },
        include: {
          client: true,
          technology: true,
          supplier: true,
        },
      });
      
      return res.json(documents);
    } catch (error) {
      console.error('Error fetching documents by client:', error);
      return res.status(500).json({ error: 'Failed to fetch documents' });
    }
  }

  async getByTechnologyId(req: Request, res: Response) {
    try {
      const { technology_id } = req.params;
      
      const documents = await prisma.document.findMany({
        where: { technology_id },
        include: {
          client: true,
          technology: true,
          supplier: true,
        },
      });
      
      return res.json(documents);
    } catch (error) {
      console.error('Error fetching documents by technology:', error);
      return res.status(500).json({ error: 'Failed to fetch documents' });
    }
  }

  async getBySupplierId(req: Request, res: Response) {
    try {
      const { supplier_id } = req.params;
      
      const documents = await prisma.document.findMany({
        where: { supplier_id },
        include: {
          client: true,
          technology: true,
          supplier: true,
        },
      });
      
      return res.json(documents);
    } catch (error) {
      console.error('Error fetching documents by supplier:', error);
      return res.status(500).json({ error: 'Failed to fetch documents' });
    }
  }

  async getByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      
      const documents = await prisma.document.findMany({
        where: { category },
        include: {
          client: true,
          technology: true,
          supplier: true,
        },
      });
      
      return res.json(documents);
    } catch (error) {
      console.error('Error fetching documents by category:', error);
      return res.status(500).json({ error: 'Failed to fetch documents' });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const { q } = req.query;
      
      const documents = await prisma.document.findMany({
        where: {
          OR: [
            { title: { contains: String(q), mode: 'insensitive' } },
            { description: { contains: String(q), mode: 'insensitive' } },
            { tags: { hasSome: String(q) } },
          ],
        },
        include: {
          client: true,
          technology: true,
          supplier: true,
        },
      });
      
      return res.json(documents);
    } catch (error) {
      console.error('Error searching documents:', error);
      return res.status(500).json({ error: 'Failed to search documents' });
    }
  }
}