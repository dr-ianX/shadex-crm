import { Request, Response } from 'express'
import path from 'path'

export const uploadController = {
  uploadFile: (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' })
      }
      const fileUrl = `/uploads/${req.file.filename}`
      res.json({
        success: true,
        data: {
          originalName: req.file.originalname,
          filename: req.file.filename,
          url: fileUrl,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Upload failed' })
    }
  },

  uploadMultiple: (req: Request, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ success: false, error: 'No files uploaded' })
      }
      const files = (req.files as Express.Multer.File[]).map((file) => ({
        originalName: file.originalname,
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype
      }))
      res.json({ success: true, data: files })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Upload failed' })
    }
  }
}
