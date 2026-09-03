import { Request, Response, NextFunction } from 'express'
import { hasPermission, UserRole } from '../permissions'

type Permission = 'read' | 'create' | 'update' | 'delete' | 'approve'

const prefixMap: Record<string, string> = {
  '/clients': 'clients',
  '/leads': 'leads',
  '/projects': 'projects',
  '/quotations': 'quotations',
  '/products': 'products',
  '/inventory': 'inventory',
  '/installations': 'installations',
  '/appointments': 'agenda',
  '/warranties': 'warranties',
  '/tasks': 'tasks',
  '/calendar': 'calendar',
  '/finance': 'finance',
  '/analytics': 'analytics',
  '/sales-performance': 'salesPerformance',
  '/audit': 'audit',
  '/users': 'users',
  '/company': 'company',
  '/search': 'search',
  '/import': 'import',
}

function methodToPermission(method: string): Permission {
  switch (method.toUpperCase()) {
    case 'GET': return 'read'
    case 'POST': return 'create'
    case 'PUT':
    case 'PATCH': return 'update'
    case 'DELETE': return 'delete'
    default: return 'read'
  }
}

export function permissionMiddleware(req: Request & { user?: { userId: string; role: string } }, res: Response, next: NextFunction) {
  const user = req.user
  if (!user) return next() // allow unauthenticated? auth should block before

  // Super-admin bypass
  if (user.role === 'ADMIN_GENERAL') return next()

  const module = Object.keys(prefixMap).find((p) => req.path.startsWith(p))
  if (!module) return next()

  const permission = methodToPermission(req.method)
  if (hasPermission(user.role as UserRole, prefixMap[module] as any, permission)) {
    return next()
  }

  return res.status(403).json({ success: false, error: 'No autorizado para este módulo' })
}
