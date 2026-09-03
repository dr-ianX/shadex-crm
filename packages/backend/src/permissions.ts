import { Request, Response, NextFunction } from 'express'

export type UserRole =
  | 'ADMIN_GENERAL'
  | 'MINI_ADMIN'
  | 'VENTAS'
  | 'OPERACIONES'
  | 'INSTALADOR'
  | 'FINANZAS'
  | 'ALMACEN'
  | 'MANTENIMIENTO'
  | 'SOLO_LECTURA'

type Permission = 'read' | 'create' | 'update' | 'delete' | 'approve'

type Module =
  | 'dashboard'
  | 'leads'
  | 'clients'
  | 'projects'
  | 'quotations'
  | 'products'
  | 'inventory'
  | 'installations'
  | 'agenda'
  | 'warranties'
  | 'tasks'
  | 'calendar'
  | 'finance'
  | 'search'
  | 'analytics'
  | 'salesPerformance'
  | 'audit'
  | 'import'
  | 'users'
  | 'company'

const rolePermissions: Record<UserRole, Record<Module, Permission[]>> = {
  ADMIN_GENERAL: {
    dashboard: ['read', 'create', 'update', 'delete', 'approve'],
    leads: ['read', 'create', 'update', 'delete', 'approve'],
    clients: ['read', 'create', 'update', 'delete'],
    projects: ['read', 'create', 'update', 'delete'],
    quotations: ['read', 'create', 'update', 'delete', 'approve'],
    products: ['read', 'create', 'update', 'delete'],
    inventory: ['read', 'create', 'update', 'delete'],
    installations: ['read', 'create', 'update', 'delete'],
    agenda: ['read', 'create', 'update', 'delete'],
    warranties: ['read', 'create', 'update', 'delete'],
    tasks: ['read', 'create', 'update', 'delete'],
    calendar: ['read', 'create', 'update', 'delete'],
    finance: ['read', 'create', 'update', 'delete'],
    search: ['read'],
    analytics: ['read'],
    salesPerformance: ['read'],
    audit: ['read'],
    import: ['create'],
    users: ['read', 'create', 'update', 'delete'],
    company: ['read', 'update'],
  },
  MINI_ADMIN: {
    dashboard: ['read'],
    leads: ['read', 'create', 'update'],
    clients: ['read', 'create', 'update'],
    projects: ['read', 'create', 'update'],
    quotations: ['read', 'create', 'update'],
    products: ['read', 'create', 'update'],
    inventory: ['read', 'create', 'update'],
    installations: ['read', 'create', 'update'],
    agenda: ['read', 'create', 'update', 'delete'],
    warranties: ['read', 'create', 'update'],
    tasks: ['read', 'create', 'update', 'delete'],
    calendar: ['read', 'create', 'update', 'delete'],
    finance: ['read'],
    search: ['read'],
    analytics: ['read'],
    salesPerformance: ['read'],
    audit: ['read'],
    import: ['create'],
    users: ['read'],
    company: ['read'],
  },
  VENTAS: {
    dashboard: ['read'],
    leads: ['read', 'create', 'update'],
    clients: ['read', 'create', 'update'],
    projects: ['read', 'create', 'update'],
    quotations: ['read', 'create', 'update'],
    products: ['read'],
    inventory: ['read'],
    installations: ['read'],
    agenda: ['read', 'create', 'update'],
    warranties: ['read'],
    tasks: ['read', 'create', 'update'],
    calendar: ['read', 'create', 'update'],
    finance: [],
    search: ['read'],
    analytics: ['read'],
    salesPerformance: ['read'],
    audit: [],
    import: [],
    users: [],
    company: [],
  },
  OPERACIONES: {
    dashboard: ['read'],
    leads: ['read'],
    clients: ['read'],
    projects: ['read', 'update'],
    quotations: ['read'],
    products: ['read'],
    inventory: ['read', 'create', 'update'],
    installations: ['read', 'create', 'update', 'delete'],
    agenda: ['read', 'create', 'update', 'delete'],
    warranties: ['read', 'create', 'update'],
    tasks: ['read', 'create', 'update', 'delete'],
    calendar: ['read', 'create', 'update', 'delete'],
    finance: [],
    search: ['read'],
    analytics: ['read'],
    salesPerformance: [],
    audit: [],
    import: [],
    users: [],
    company: [],
  },
  INSTALADOR: {
    dashboard: ['read'],
    leads: [],
    clients: [],
    projects: ['read'],
    quotations: [],
    products: ['read'],
    inventory: ['read'],
    installations: ['read', 'update'],
    agenda: ['read'],
    warranties: [],
    tasks: ['read', 'update'],
    calendar: ['read'],
    finance: [],
    search: ['read'],
    analytics: [],
    salesPerformance: [],
    audit: [],
    import: [],
    users: [],
    company: [],
  },
  FINANZAS: {
    dashboard: ['read'],
    leads: ['read'],
    clients: ['read'],
    projects: ['read'],
    quotations: ['read'],
    products: ['read'],
    inventory: ['read'],
    installations: ['read'],
    agenda: ['read'],
    warranties: ['read'],
    tasks: ['read'],
    calendar: ['read'],
    finance: ['read', 'create', 'update', 'delete'],
    search: ['read'],
    analytics: ['read'],
    salesPerformance: ['read'],
    audit: ['read'],
    import: [],
    users: [],
    company: ['read'],
  },
  ALMACEN: {
    dashboard: ['read'],
    leads: [],
    clients: [],
    projects: ['read'],
    quotations: [],
    products: ['read', 'create', 'update'],
    inventory: ['read', 'create', 'update', 'delete'],
    installations: [],
    agenda: [],
    warranties: [],
    tasks: ['read', 'create', 'update'],
    calendar: [],
    finance: [],
    search: ['read'],
    analytics: [],
    salesPerformance: [],
    audit: [],
    import: [],
    users: [],
    company: [],
  },
  MANTENIMIENTO: {
    dashboard: ['read'],
    leads: [],
    clients: ['read'],
    projects: ['read'],
    quotations: [],
    products: ['read'],
    inventory: ['read'],
    installations: ['read'],
    agenda: ['read', 'create', 'update'],
    warranties: ['read', 'create', 'update'],
    tasks: ['read', 'create', 'update'],
    calendar: ['read'],
    finance: [],
    search: ['read'],
    analytics: [],
    salesPerformance: [],
    audit: [],
    import: [],
    users: [],
    company: [],
  },
  SOLO_LECTURA: {
    dashboard: ['read'],
    leads: ['read'],
    clients: ['read'],
    projects: ['read'],
    quotations: ['read'],
    products: ['read'],
    inventory: ['read'],
    installations: ['read'],
    agenda: ['read'],
    warranties: ['read'],
    tasks: ['read'],
    calendar: ['read'],
    finance: ['read'],
    search: ['read'],
    analytics: ['read'],
    salesPerformance: ['read'],
    audit: ['read'],
    import: [],
    users: ['read'],
    company: ['read'],
  },
}

export function hasPermission(role: UserRole, module: Module, permission: Permission): boolean {
  // Super-admin bypass: ADMIN_GENERAL can do anything
  if (role === 'ADMIN_GENERAL') return true
  return (rolePermissions[role]?.[module] || []).includes(permission)
}

export function requirePermission(module: Module, permission: Permission) {
  return (req: Request & { user?: { userId: string; role: string } }, res: Response, next: NextFunction) => {
    const user = req.user as { userId: string; role: UserRole } | undefined
    if (!user) return res.status(401).json({ success: false, error: 'No autenticado' })
    if (!hasPermission(user.role, module, permission)) {
      return res.status(403).json({ success: false, error: 'No autorizado' })
    }
    next()
  }
}
