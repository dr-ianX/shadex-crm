import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../db'

export const usersController = {
  list: async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, phone: true, isActive: true, createdAt: true }
      })
      res.json({ success: true, data: users })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list users' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { name, email, password, role, phone } = req.body
      const hashed = await bcrypt.hash(password, 10)
      const created = await prisma.user.create({
        data: { name, email, password: hashed, role, phone },
        select: { id: true, name: true, email: true, role: true, phone: true, isActive: true, createdAt: true }
      })
      res.status(201).json({ success: true, data: created })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create user' })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data: any = { ...req.body }
      if (data.password) data.password = await bcrypt.hash(data.password, 10)

      const updated = await prisma.user.update({
        where: { id },
        data,
        select: { id: true, name: true, email: true, role: true, phone: true, isActive: true, createdAt: true }
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update user' })
    }
  },

  toggleActive: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) return res.status(404).json({ success: false, error: 'User not found' })
      const updated = await prisma.user.update({
        where: { id },
        data: { isActive: !user.isActive },
        select: { id: true, name: true, email: true, role: true, isActive: true }
      })
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to toggle user' })
    }
  }
}
