import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { randomUUID } from 'crypto'

const uploadsDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${randomUUID()}${ext}`
    cb(null, name)
  }
})

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
})
