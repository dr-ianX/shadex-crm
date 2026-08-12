# 🔄 Especificaciones de Integración API - ShadeX CRM

## 📋 Resumen Ejecutivo

Este documento describe los puntos de integración entre todos los módulos del sistema ShadeX CRM, definiendo flujos de datos, dependencias y contratos de API para el desarrollo frontend.

---

## 🏗️ Arquitectura de Integración

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway Layer                        │
│                    /api/v1/* (Authentication)                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Core Business Modules                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Clients  │ │Transforms│ │Technologies│ │ Suppliers│          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │Documents │ │Calendar  │ │Tasks     │ │Finance   │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Cross-Module Services                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │Quotations│ │Workflows │ │Reports   │ │Dashboard │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Módulo: Clients (Clientes)

### Endpoints Principales

| Endpoint | Método | Descripción | Integración con |
|----------|--------|-------------|-----------------|
| `/api/v1/clients` | GET | Listar todos los clientes | Transformations, Quotations |
| `/api/v1/clients/search?query=xxx` | GET | Buscar clientes | Dashboard (KPIs) |
| `/api/v1/clients/:id` | GET | Obtener cliente detallado | Transformations, Tasks |
| `/api/v1/clients` | POST | Crear nuevo cliente | - |
| `/api/v1/clients/:id` | PUT | Actualizar cliente | - |
| `/api/v1/clients/:id` | DELETE | Eliminar lógico (status=Inactive) | - |

### Datos que fluyen desde Clients

```typescript
interface Client {
  id: string;
  code: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
}
```

**Destinos de los datos:**
- **Transformations**: Cada transformación pertenece a un cliente
- **Quotations**: Las cotizaciones se generan por cliente
- **Tasks**: Las tareas pueden asignarse a clientes
- **Dashboard**: KPIs como "Total Clientes", "Nuevos Clientes Mes"

---

## 📈 Módulo: Transformations (Transformaciones/Proyectos)

### Endpoints Principales

| Endpoint | Método | Descripción | Integración con |
|----------|--------|-------------|-----------------|
| `/api/v1/transformations` | GET | Listar transformaciones | Dashboard, Reports |
| `/api/v1/transformations/client/:clientId` | GET | Transformaciones por cliente | Clients |
| `/api/v1/transformations` | POST | Crear nueva transformación | Technologies, Suppliers |
| `/api/v1/transformations/:id` | PUT | Actualizar transformación | - |
| `/api/v1/transformations/:id/status` | PATCH | Cambiar estado | Workflows |
| `/api/v1/transformations/:id` | DELETE | Eliminar lógico (status=Cancelled) | - |

### Datos que fluyen desde Transformations

```typescript
interface Transformation {
  id: string;
  folioNumber: string; // SHA-0001, SHA-0002...
  clientId: string;
  projectName: string;
  projectType: 'Residential' | 'Commercial' | 'Industrial';
  status: string;
  journeyPhase: 'Discover' | 'Curate' | 'Design' | 'Transform' | 'Experience';
  technologies?: Technology[];
  quotations?: Quotation[];
  installations?: Installation[];
  payments?: Payment[];
  createdAt: Date;
}
```

**Destinos de los datos:**
- **Technologies**: Cada transformación usa tecnologías específicas
- **Quotations**: Se generan cotizaciones para transformaciones
- **Dashboard**: KPIs como "Transformaciones Activas", "Valor Pipeline"
- **Finance**: Seguimiento de pagos por proyecto

### Flujo de Creación de Transformación

```typescript
POST /api/v1/transformations

Request: {
  clientId: "client-id-here",
  projectName: "Solar Installation ABC",
  projectType: "Residential",
  status: "Lead",
  technologiesIds: ["tech-1", "tech-2"], // IDs de tecnologías a usar
  estimatedBudget: 50000,
  expectedCompletionDate: "2026-12-31"
}

Response: {
  success: true,
  data: {
    id: "trans-xxx",
    folioNumber: "SHA-0001", // Auto-generado
    clientId: "client-id-here",
    projectName: "Solar Installation ABC",
    status: "Lead",
    journeyPhase: "Discover"
  }
}
```

---

## 🛠️ Módulo: Technologies (Tecnologías)

### Endpoints Principales

| Endpoint | Método | Descripción | Integración con |
|----------|--------|-------------|-----------------|
| `/api/v1/technologies` | GET | Listar tecnologías | Transformations, Dashboard |
| `/api/v1/technologies/categories` | GET | Obtener categorías | Transformations (filtrado) |
| `/api/v1/technologies/search?query=xxx` | GET | Buscar tecnologías | Dashboard (búsqueda global) |
| `/api/v1/technologies/:id` | GET | Obtener tecnología detallada | Transformations |
| `/api/v1/technologies` | POST | Crear nueva tecnología | - |
| `/api/v1/technologies/:id` | PUT | Actualizar tecnología | - |
| `/api/v1/technologies/:id` | DELETE | Eliminar lógico | - |

### Datos que fluyen desde Technologies

```typescript
interface Technology {
  id: string;
  name: string;
  brand: string;
  category: 'Solar' | 'Storage' | 'Monitoring' | 'Safety' | 'Other';
  price: number;
  stockQuantity?: number;
  supplierId?: string; // Opcional - relación con proveedores
  createdAt: Date;
}
```

**Destinos de los datos:**
- **Transformations**: Selección de tecnologías para proyectos
- **Dashboard**: KPIs como "Inventario Tecnologías", "Valor Inventario"
- **Inventory**: Seguimiento de stock por tecnología

### Flujo de Asignación de Tecnologías a Transformación

```typescript
// GET /api/v1/technologies?categories=Solar,Storage
Response: {
  success: true,
  data: [
    { id: "tech-1", name: "Panel Solar 400W", category: "Solar", price: 250 },
    { id: "tech-2", name: "Batería Lithium 5kWh", category: "Storage", price: 800 }
  ]
}

// POST /api/v1/transformations con tecnologías seleccionadas
Request: {
  clientId: "client-123",
  technologiesIds: ["tech-1", "tech-2"], // Referencias a tecnologías
  ...
}
```

---

## 🏭 Módulo: Suppliers (Proveedores)

### Endpoints Principales

| Endpoint | Método | Descripción | Integración con |
|----------|--------|-------------|-----------------|
| `/api/v1/suppliers` | GET | Listar proveedores | Technologies, Inventory |
| `/api/v1/suppliers/search?query=xxx&type=Solar` | GET | Buscar proveedores | Dashboard (KPIs) |
| `/api/v1/suppliers/:id` | GET | Obtener proveedor detallado | - |
| `/api/v1/suppliers` | POST | Crear nuevo proveedor | Technologies |
| `/api/v1/suppliers/:id` | PUT | Actualizar proveedor | - |
| `/api/v1/suppliers/:id` | DELETE | Eliminar lógico | - |
| `/api/v1/suppliers/:id/evaluations` | POST | Agregar evaluación de desempeño | Quality Management |

### Datos que fluyen desde Suppliers

```typescript
interface Supplier {
  id: string;
  name: string;
  type: 'Solar' | 'Storage' | 'Monitoring' | 'Safety' | 'Other';
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  rating?: number; // Promedio de evaluaciones
  evaluationCount?: number;
  createdAt: Date;
}

interface SupplierEvaluation {
  supplierId: string;
  rating: number; // 1-5 estrellas
  comments?: string;
  dateAdded: Date;
}
```

**Destinos de los datos:**
- **Technologies**: Creación de productos tecnológicos con proveedor asociado
- **Inventory**: Gestión de stock por proveedor
- **Dashboard**: KPIs como "Mejores Proveedores", "Rating Promedio"

### Flujo de Creación de Tecnología con Proveedor

```typescript
// POST /api/v1/technologies
Request: {
  name: "Panel Solar Monocristalino 450W",
  brand: "SunPower",
  category: "Solar",
  price: 320.50,
  supplierId: "supplier-xyz", // Vincula con proveedor
  stockQuantity: 100
}

Response: {
  success: true,
  data: {
    id: "tech-new",
    name: "Panel Solar Monocristalino 450W",
    supplierId: "supplier-xyz",
    ...
  }
}
```

---

## 📄 Módulo: Documents (Documentos)

### Endpoints Principales

| Endpoint | Método | Descripción | Integración con |
|----------|--------|-------------|-----------------|
| `/api/v1/documents` | GET | Listar documentos | Transformations, Clients |
| `/api/v1/documents/upload` | POST | Subir documento | Todos los módulos |
| `/api/v1/documents/:id` | GET | Obtener documento | - |
| `/api/v1/documents/:id` | DELETE | Eliminar documento | - |

### Datos que fluyen desde Documents

```typescript
interface Document {
  id: string;
  name: string;
  type: 'Contract' | 'Invoice' | 'Certificate' | 'Manual' | 'Other';
  size: number; // bytes
  url: string; // URL de almacenamiento
  uploadedAt: Date;
  createdBy: string; // ID del usuario
}
```

**Destinos de los datos:**
- **Transformations**: Documentos asociados a proyectos (contratos, manuales)
- **Clients**: Facturas y documentos del cliente
- **Warranty**: Certificados de garantía

---

## 📅 Módulo: Calendar (Calendario)

### Endpoints Principales

| Endpoint | Método | Descripción | Integración con |
|----------|--------|-------------|-----------------|
| `/api/v1/calendar/events` | GET | Listar eventos | Transformations, Tasks |
| `/api/v1/calendar/events` | POST | Crear evento | - |
| `/api/v1/calendar/events/:id` | PUT | Actualizar evento | - |
| `/api/v1/calendar/events/:id` | DELETE | Eliminar evento | - |

### Datos que fluyen desde Calendar

```typescript
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: 'Installation' | 'Follow-up' | 'Meeting' | 'Maintenance';
  transformationId?: string; // Vinculado a transformación
  clientId?: string; // Vinculado a cliente
  location?: string;
}
```

**Destinos de los datos:**
- **Transformations**: Eventos de instalación programada
- **Tasks**: Tareas relacionadas con eventos del calendario

---

## ✅ Módulo: Tasks (Tareas)

### Endpoints Principales

| Endpoint | Método | Descripción | Integración con |
|----------|--------|-------------|-----------------|
| `/api/v1/tasks` | GET | Listar tareas | Calendar, Clients |
| `/api/v1/tasks` | POST | Crear tarea | - |
| `/api/v1/tasks/:id` | PUT | Actualizar tarea | - |
| `/api/v1/tasks/:id` | DELETE | Eliminar tarea | - |

### Datos que fluyen desde Tasks

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: Date;
  assignedTo?: string; // ID de usuario
  transformationId?: string;
  clientId?: string;
  createdAt: Date;
}
```

**Destinos de los datos:**
- **Calendar**: Creación de eventos a partir de tareas con fecha
- **Clients**: Tareas relacionadas con clientes específicos
- **Dashboard**: KPIs como "Tareas Pendientes", "Tareas por Completar"

---

## 💰 Módulo: Finance (Finanzas)

### Endpoints Principales

| Endpoint | Método | Descripción | Integración con |
|----------|--------|-------------|-----------------|
| `/api/v1/finance/payments` | GET | Listar pagos | Transformations, Clients |
| `/api/v1/finance/payments` | POST | Registrar pago | Transformations |
| `/api/v1/finance/invoices` | GET | Listar facturas | Transformations |
| `/api/v1/finance/reports` | GET | Reportes financieros | Reports Module |

### Datos que fluyen desde Finance

```typescript
interface Payment {
  id: string;
  transformationId: string;
  amount: number;
  status: 'Pending' | 'Partial' | 'Complete';
  method: 'Bank Transfer' | 'Check' | 'Cash' | 'Credit Card';
  paidAt?: Date;
  notes?: string;
}

interface Invoice {
  id: string;
  transformationId: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  issuedDate: Date;
  dueDate: Date;
}
```

**Destinos de los datos:**
- **Transformations**: Seguimiento de pagos por proyecto
- **Dashboard**: KPIs como "Ingresos Totales", "Pagos Pendientes"
- **Reports**: Reportes financieros mensuales/anuales

---

## 📊 Módulo: Dashboard (Panel de Control)

### Endpoints Principales

| Endpoint | Método | Descripción | Integración con |
|----------|--------|-------------|-----------------|
| `/api/v1/dashboard/kpis` | GET | KPIs principales | Todos los módulos |
| `/api/v1/dashboard/overview` | GET | Vista general | Todos los módulos |
| `/api/v1/dashboard/recent` | GET | Actividad reciente | Todos los módulos |

### KPIs del Dashboard (Flujo desde todos los módulos)

```typescript
interface DashboardKPIs {
  // Clients
  totalClients: number;
  newClientsThisMonth: number;
  
  // Transformations
  activeTransformations: number;
  completedTransformations: number;
  pipelineValue: number;
  
  // Technologies
  totalTechnologies: number;
  lowStockItems: number;
  
  // Suppliers
  topSuppliers: Supplier[];
  avgSupplierRating: number;
  
  // Finance
  totalRevenue: number;
  pendingPayments: number;
}
```

### Flujo de Datos para Dashboard

```typescript
GET /api/v1/dashboard/kpis

Response: {
  success: true,
  data: {
    clients: {
      totalClients: 42,
      newClientsThisMonth: 5
    },
    transformations: {
      activeTransformations: 18,
      completedTransformations: 24,
      pipelineValue: 750000
    },
    technologies: {
      totalTechnologies: 156,
      lowStockItems: 8
    },
    suppliers: {
      topSuppliers: [
        { id: "supplier-1", name: "SunPower Inc.", rating: 4.8 }
      ],
      avgSupplierRating: 4.5
    },
    finance: {
      totalRevenue: 250000,
      pendingPayments: 75000
    }
  }
}
```

---

## 📈 Módulo: Reports (Reportes)

### Endpoints Principales

| Endpoint | Método | Descripción | Integración con |
|----------|--------|-------------|-----------------|
| `/api/v1/reports/sales` | GET | Reporte de ventas | Finance, Transformations |
| `/api/v1/reports/performance` | GET | Reporte de rendimiento | Transformations, Suppliers |
| `/api/v1/reports/inventory` | GET | Reporte de inventario | Technologies, Inventory |

### Flujo de Datos para Reports

```typescript
GET /api/v1/reports/sales?period=last30days&groupBy=month

Response: {
  success: true,
  data: {
    period: 'last30days',
    groupBy: 'month',
    totalRevenue: 125000,
    transactionsCount: 45,
    monthlyBreakdown: [
      { month: 'August', revenue: 65000, transactions: 28 },
      { month: 'July', revenue: 60000, transactions: 17 }
    ]
  }
}
```

---

## 🔐 Autenticación y Autorización

### Token de Autenticación

```typescript
POST /api/v1/auth/login

Request: { email: string, password: string }

Response: {
  success: true,
  data: {
    token: "eyJhbGciOiJIUzI1NiIs...", // JWT (7 días)
    user: {
      id: "user-123",
      name: "Juan Pérez",
      email: "juan@shadex.com",
      role: 'Admin' // Roles: Admin, Sales, Architect, InventoryManager, Installer, SupportAgent, QualityManager
    }
  }
}
```

### Headers Requeridos

Todos los endpoints que requieren autenticación necesitan:

```typescript
Headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Matriz de Autorización por Rol

| Endpoint | Público | Admin | Sales | Architect | InventoryManager | Installer | SupportAgent |
|----------|---------|-------|-------|-----------|------------------|-----------|--------------|
| GET /clients | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| POST /clients | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /transformations | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST /transformations | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /technologies | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| POST /technologies | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| GET /suppliers | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| POST /suppliers | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| GET /finance/* | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🔄 Flujos de Integración Complejos

### Flujo 1: Creación de Transformación Completa

```typescript
// 1. Obtener cliente
GET /api/v1/clients/xxx
Response: { id, name, email }

// 2. Obtener tecnologías disponibles
GET /api/v1/technologies?categories=Solar,Storage
Response: [ { id, name, price, stockQuantity } ]

// 3. Crear transformación
POST /api/v1/transformations
Request: {
  clientId: "client-xxx",
  projectName: "Sistema Solar Residencial",
  projectType: "Residential",
  technologiesIds: ["tech-1", "tech-2", "tech-3"],
  estimatedBudget: 45000
}

// 4. Sistema genera folio automáticamente
Response: {
  id: "trans-xxx",
  folioNumber: "SHA-0001",
  status: "Lead",
  journeyPhase: "Discover"
}

// 5. Crear tarea de seguimiento
POST /api/v1/tasks
Request: {
  title: "Contactar cliente - SHA-0001",
  transformationId: "trans-xxx",
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 días
  priority: "High"
}

// 6. Agregar al calendario
POST /api/v1/calendar/events
Request: {
  title: "Cotización SHA-0001",
  transformationId: "trans-xxx",
  startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) + 3600000, // +1 hora
  type: "Follow-up"
}
```

### Flujo 2: Gestión de Inventario con Proveedores

```typescript
// 1. Crear proveedor
POST /api/v1/suppliers
Request: {
  name: "SunPower Inc.",
  type: "Solar",
  email: "sales@sunpower.com",
  phone: "+1-555-0123"
}

// 2. Crear tecnología con proveedor
POST /api/v1/technologies
Request: {
  name: "Panel Solar 400W",
  brand: "SunPower",
  category: "Solar",
  price: 250,
  supplierId: "supplier-new",
  stockQuantity: 50
}

// 3. Agregar evaluación de proveedor
POST /api/v1/suppliers/supplier-new/evaluations
Request: {
  rating: 4.5,
  comments: "Excelente calidad y tiempos de entrega"
}

// 4. Crear movimiento de inventario
POST /api/v1/inventory/movements
Request: {
  technologyId: "tech-solar-400w",
  type: "Stock In",
  quantity: 50,
  reference: "PO-2026-089"
}
```

### Flujo 3: Cotización y Pago

```typescript
// 1. Obtener transformación en estado de cotización
GET /api/v1/transformations/trans-xxx
Response: { status: "Cotización", journeyPhase: "Design" }

// 2. Generar factura
POST /api/v1/finance/invoices
Request: {
  transformationId: "trans-xxx",
  amount: 45000,
  items: [
    { technologyId: "tech-1", quantity: 10, unitPrice: 250 },
    { technologyId: "tech-2", quantity: 5, unitPrice: 800 }
  ]
}

// 3. Registrar pago parcial
POST /api/v1/finance/payments
Request: {
  transformationId: "trans-xxx",
  amount: 13500, // 30% anticipo
  status: "Partial",
  method: "Bank Transfer",
  notes: "Anticipo instalación solar"
}

// 4. Actualizar estado de transformación
PATCH /api/v1/transformations/trans-xxx/status
Request: { status: "Anticipo" }
Response: { journeyPhase: "Design" }
```

---

## 📡 Patrones de Integración

### Patrón: Inyección de Dependencias (Repository Pattern)

```typescript
// Separación de datos y lógica
interface IRepository<T> {
  find(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

// Implementación
class ClientRepository implements IRepository<Client> {
  async find(id: string): Promise<Client | null> {
    return prisma.client.findUnique({ where: { id } });
  }
  
  async findAll(): Promise<Client[]> {
    return prisma.client.findMany();
  }
}

// Controller usa repository
const clientsController = {
  list: async (req: Request, res: Response) => {
    const clients = await clientRepository.findAll();
    res.json({ success: true, data: clients });
  }
};
```

### Patrón: DTO para Validación

```typescript
// Data Transfer Object para validación de entrada
interface CreateTransformationDTO {
  clientId: string;
  projectName: string;
  projectType: 'Residential' | 'Commercial' | 'Industrial';
  estimatedBudget?: number;
  expectedCompletionDate?: string;
}

// Validación antes de guardar
const validateCreateTransformation = (data: any): CreateTransformationDTO => {
  const dto: CreateTransformationDTO = {
    clientId: data.clientId,
    projectName: data.projectName,
    projectType: data.projectType,
    estimatedBudget: data.estimatedBudget || 0,
    expectedCompletionDate: data.expectedCompletionDate
  };
  
  // Validaciones adicionales...
  return dto;
};
```

### Patrón: Soft Delete

Todos los endpoints DELETE usan eliminación lógica:

```typescript
// En lugar de borrar físicamente
DELETE /api/v1/clients/:id

const existing = await prisma.client.findUnique({ where: { id } });
if (!existing) return res.status(404).json({ error: 'Not found' });

// Soft delete - marca como inactivo
await prisma.client.update({
  where: { id },
  data: { status: 'Inactive' }
});
```

### Patrón: Paginación Estándar

```typescript
GET /api/v1/clients?page=1&limit=20&sortBy=name&order=asc

Response: {
  success: true,
  data: [ /* array de clientes */ ],
  pagination: {
    page: 1,
    limit: 20,
    totalItems: 42,
    totalPages: 3
  }
}
```

---

## 🧪 Pruebas de Integración

### Endpoints Críticos para Pruebas

| Módulo | Endpoint | Método | Prioridad |
|--------|----------|--------|-----------|
| Authentication | `/api/v1/auth/login` | POST | 🔴 Alta |
| Clients | `/api/v1/clients` | GET | 🔴 Alta |
| Transformations | `/api/v1/transformations` | GET, POST | 🔴 Alta |
| Technologies | `/api/v1/technologies` | GET | 🟡 Media |
| Suppliers | `/api/v1/suppliers` | GET | 🟡 Media |
| Dashboard | `/api/v1/dashboard/kpis` | GET | 🟢 Baja |

### Ejemplo de Prueba con curl

```bash
# 1. Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shadex.com","password":"admin123"}' \
  | jq '.data.token'

# 2. Listar clientes
TOKEN="eyJhbGciOiJIUzI1NiIs..."
curl http://localhost:3000/api/v1/clients \
  -H "Authorization: Bearer $TOKEN"

# 3. Crear transformación
curl -X POST http://localhost:3000/api/v1/transformations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "client-123",
    "projectName": "Solar System ABC",
    "projectType": "Residential",
    "technologiesIds": ["tech-1", "tech-2"]
  }'
```

---

## 📝 Notas de Implementación

### Versionado de API

Todos los endpoints usan versión `v1` en la ruta: `/api/v1/*`

### Manejo de Errores Estándar

```typescript
// Formato consistente de errores
{
  "success": false,
  "error": "Error message here",
  "code": "VALIDATION_ERROR" // Código de error específico
}
```

Códigos de error comunes:
- `VALIDATION_ERROR` - Validación fallida
- `NOT_FOUND` - Recurso no encontrado
- `UNAUTHORIZED` - Token inválido/expirado
- `FORBIDDEN` - Permiso denegado por rol

### Manejo de Timeouts

Los endpoints tienen timeouts configurados:
- Lectura simple: 5 segundos
- Lectura con joins: 10 segundos
- Escritura: 15 segundos
- Reportes complejos: 60 segundos

---

## 🚀 Próximos Pasos para Frontend

1. **Implementar autenticación** - Guardar token en localStorage
2. **Crear componentes de lista** - Usar paginación estándar
3. **Implementar filtros** - Seguir patrones de query params
4. **Manejar estados de carga** - Loading states para todas las operaciones
5. **Error handling global** - Mostrar mensajes de error consistentes

---

## 📞 Soporte y Documentación Adicional

- `README_DASHBOARD.md` - Especificaciones del módulo Dashboard
- `README_REPORTS.md` - Especificaciones del módulo Reports  
- `README_TECHNOLOGIES.md` - Especificaciones del módulo Technologies
- `README_SUPPLIERS.md` - Especificaciones del módulo Suppliers

---

*Documento generado automáticamente por el sistema de documentación de ShadeX CRM*
*Última actualización: 2026-08-11*