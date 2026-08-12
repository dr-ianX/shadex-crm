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

  async download(req: Request, res: Response) {
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
      
      // Verify access permissions for non-public documents
      if (!document.is_public && document.client_id) {
        const clientId = req.user?.client_id || req.body.client_id;
        if (clientId && clientId !== document.client_id) {
          return res.status(403).json({ error: 'Access denied' });
        }
      }
      
      // Construct file path
      let filePath = document.file_path;
      
      // Handle relative paths by resolving against uploads directory
      if (filePath && !path.isAbsolute(filePath)) {
        const uploadsDir = path.join(__dirname, '../../uploads');
        filePath = path.resolve(uploadsDir, filePath);
        
        // Security: prevent directory traversal attacks
        const normalizedPath = path.normalize(filePath);
        const normalizedUploads = path.normalize(uploadsDir);
        if (!normalizedPath.startsWith(normalizedUploads)) {
          return res.status(400).json({ error: 'Invalid file path' });
        }
      }
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }
      
      // Set appropriate headers for file download
      const contentType = document.mime_type || 'application/octet-stream';
      const fileName = path.basename(document.file_path);
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Cache-Control', 'private, max-age=0, no-store, no-cache, must-revalidate');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      
      // Stream file to response
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
    } catch (error) {
      console.error('Error downloading document:', error);
      return res.status(500).json({ error: 'Failed to download document' });
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

  async generateSummary(req: Request, res: Response) {
    try {
      const { documentId, filePath, prompt, options } = req.body;
      
      if (!documentId && !filePath) {
        return res.status(400).json({ error: 'Either documentId or filePath must be provided' });
      }
      
      // Fetch document data
      let documentData: any = null;
      
      if (documentId) {
        documentData = await prisma.document.findUnique({
          where: { id: documentId },
          include: { content: true, client: true, technology: true },
        });
      } else if (filePath) {
        documentData = await prisma.document.findFirst({
          where: { file_path: filePath },
          include: { client: true, technology: true },
        });
      }
      
      if (!documentData) {
        return res.status(404).json({ error: 'Document not found' });
      }
      
      // Generate AI summary using the AI service
      const aiSummary = await this.generateAISummary(
        documentData.content,
        prompt || 'Generate a comprehensive summary of this document',
        options || {}
      );
      
      return res.json({
        success: true,
        document: {
          id: documentData.id,
          title: documentData.title,
          description: documentData.description,
        },
        summary: aiSummary,
        metadata: {
          wordCount: this.countWords(documentData.content),
          estimatedReadTime: this.estimateReadTime(documentData.content),
          keyTopics: this.extractKeyTopics(documentData.content),
        },
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      return res.status(500).json({ error: 'Failed to generate summary' });
    }
  }

  private async generateAISummary(content: string, prompt: string, options: any = {}): Promise<string> {
    // Placeholder for AI service integration
    // In production, this would call an LLM API (OpenAI, Anthropic, etc.)
    
    // Simple implementation - replace with actual AI service call
    const summary = `This document covers the main topics discussed. Key points include: ${this.extractKeyPoints(content).join(', ')}. The document provides valuable insights on these subjects.`;
    
    return summary;
  }

  private countWords(text: string): number {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
  }

  private estimateReadTime(text: string): string {
    const words = this.countWords(text);
    const wpm = 200; // Average reading speed in words per minute
    const minutes = Math.ceil(words / wpm);
    
    if (minutes < 1) return '< 1 min';
    if (minutes < 3) return `${minutes} min`;
    return `${minutes}+ min`;
  }

  private extractKeyTopics(text: string): string[] {
    // Simple topic extraction - replace with NLP library in production
    const topics = [];
    
    // Common technical terms/topics
    const techKeywords = [
      'technology', 'software', 'hardware', 'API', 'database', 
      'project', 'client', 'implementation', 'deployment'
    ];
    
    const lowerText = text.toLowerCase();
    for (const keyword of techKeywords) {
      if (lowerText.includes(keyword)) {
        topics.push(keyword);
      }
    }
    
    return topics.slice(0, 5); // Return top 5 topics
  }

  private extractKeyPoints(text: string): string[] {
    // Simple point extraction - replace with NLP library in production
    const points = [];
    
    // Look for bullet points or numbered lists
    const lines = text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 20) {
        points.push(trimmed.substring(0, 100) + '...');
      }
    }
    
    return points.slice(0, 5); // Return top 5 points
  }
}
