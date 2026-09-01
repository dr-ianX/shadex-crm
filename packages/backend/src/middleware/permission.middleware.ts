import { Request, Response, NextFunction } from 'express'
import { hasPermission, UserRole } from '../permissions'

type Permission = 'read' | 'create' | 'update' | 'delete' | 'approve'

const prefixMap: Record<string, string> = {
  '/api/v1/clients': 'clients',
  '/api/v1/leads': 'leads',
  '/api/v1/projects': 'projects',
  '/api/v1/quotations': 'quotations',
  '/api/v1/products': 'products',
  '/api/v1/inventory': 'inventory',
  '/api/v1/installations': 'installations',
  '/api/v1/appointments': 'agenda',
  '/api/v1/warranties': 'warranties',
  '/api/v1/tasks': 'tasks',
  '/api/v1/calendar': 'calendar',
  '/api/v1/finance': 'finance',
  '/api/v1/analytics': 'analytics',
  '/api/v1/sales-performance': 'salesPerformance',
  '/api/v1/audit': 'audit',
  '/api/v1/users': 'users',
  '/api/v1/company': 'company',
  '/api/v1/search': 'search',
  '/api/v1/import': 'import',
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

  const module = Object.keys(prefixMap).find((p) => req.path.startsWith(p))
  if (!module) return next()

  const permission = methodToPermission(req.method)
  if (hasPermission(user.role as UserRole, prefixMap[module] as any, permission)) {
    return next()
  }

  return res.status(403).json({ success: false, error: 'No autorizado para este módulo' })
}
