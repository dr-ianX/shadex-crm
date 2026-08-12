import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../db'

export const usersController = {
  list: async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({ 
        where: { status: 'Active' },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          lastLoginAt: true,
          createdAt: true
        }
      })
      res.json({ success: true, data: users })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to list users' })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
          permissions: true
        }
      })
      
      if (!user) return res.status(404).json({ success: false, error: 'User not found' })
      res.json({ success: true, data: user })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get user' })
    }
  },

  getByUsername: async (req: Request, res: Response) => {
    try {
      const { username } = req.params
      
      if (!username || typeof username !== 'string') {
        return res.status(400).json({ success: false, error: 'Username required' })
      }
      
      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          lastLoginAt: true,
          createdAt: true
        }
      })
      
      if (!user) return res.status(404).json({ success: false, error: 'User not found' })
      res.json({ success: true, data: user })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get user by username' })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const payload = req.body
      
      if (!payload.username || !payload.password) {
        return res.status(400).json({ success: false, error: 'Username and password required' })
      }

      // Check if username already exists
      const existingUser = await prisma.user.findUnique({ where: { username: payload.username } })
      if (existingUser) {
        return res.status(409).json({ success: false, error: 'Username already exists' })
      }

      // Hash password
      const salt = await bcrypt.genSalt(12)
      const hashedPassword = await bcrypt.hash(payload.password, salt)
      
      // Remove password from payload before creating user
      const { password, ...userData } = payload
      
      const created = await prisma.user.create({ 
        data: { 
          ...userData,
          password: hashedPassword,
          status: 'Active'
        } 
      })
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = created
      
      res.status(201).json({ success: true, data: userWithoutPassword })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to create user' })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const payload = req.body
      
      const existing = await prisma.user.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'User not found' })

      // If password is being updated, hash it
      let userData: any = payload
      
      if (payload.password) {
        const salt = await bcrypt.genSalt(12)
        userData.password = await bcrypt.hash(payload.password, salt)
        delete userData.password
      }

      // Update status if provided
      if (payload.status !== undefined) {
        userData.status = payload.status
      }

      const updated = await prisma.user.update({ where: { id }, data: userData })
      
      // Remove password from response if it was in the payload
      const { password: _, ...updatedWithoutPassword } = updated
      
      res.json({ success: true, data: updatedWithoutPassword })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to update user' })
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      
      const existing = await prisma.user.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ success: false, error: 'User not found' })

      // Only admins can delete users
      const adminCount = await prisma.user.count({ where: { role: 'admin' } })
      if (adminCount <= 1) {
        return res.status(403).json({ success: false, error: 'Cannot delete the last admin' })
      }

      // Soft delete by changing status
      const updated = await prisma.user.update({ 
        where: { id }, 
        data: { status: 'Inactive' } 
      })
      
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to delete user' })
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body
      
      if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password required' })
      }

      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
          password: true,
          permissions: true
        }
      })

      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' })
      }

      // Check if user is active
      if (user.status !== 'Active') {
        return res.status(403).json({ success: false, error: 'Account is deactivated' })
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' })
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      })

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          username: user.username,
          role: user.role,
          permissions: user.permissions || []
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      )

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user
      
      res.json({ 
        success: true, 
        data: { 
          user: userWithoutPassword,
          token,
          expiresIn: '24h'
        } 
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to login' })
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      // JWT tokens expire automatically after 24h, no need to invalidate
      res.json({ success: true, message: 'Logged out successfully' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to logout' })
    }
  },

  changePassword: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { currentPassword, newPassword } = req.body
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, error: 'Current and new password required' })
      }

      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) return res.status(404).json({ success: false, error: 'User not found' })

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password)
      if (!isValidPassword) {
        return res.status(401).json({ success: false, error: 'Invalid current password' })
      }

      // Hash new password
      const salt = await bcrypt.genSalt(12)
      const hashedPassword = await bcrypt.hash(newPassword, salt)

      const updated = await prisma.user.update({
        where: { id },
        data: { password: hashedPassword }
      })

      res.json({ success: true, message: 'Password changed successfully' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to change password' })
    }
  },

  getProfile: async (req: Request, res: Response) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
          permissions: true
        }
      })

      if (!user) return res.status(404).json({ success: false, error: 'User not found' })
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user
      
      res.json({ success: true, data: userWithoutPassword })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Failed to get profile' })
    }
  }
}