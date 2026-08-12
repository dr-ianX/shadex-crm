# 📦 README - Módulo de Proveedores (Suppliers)

## Resumen Ejecutivo

El controlador `suppliers.controller.ts` implementa la gestión completa del ciclo de vida de proveedores en SHADEX OS. Incluye:

- ✅ CRUD completo con autenticación y autorización
- ✅ Sistema de evaluaciones de desempeño
- ✅ Búsqueda y filtrado avanzado
- ✅ Cálculo automático de métricas KPI
- ✅ Validaciones de negocio robustas

---

## 🎯 Endpoints Disponibles

### 1. Listar Proveedores
```http
GET /api/v1/suppliers
```

**Permisos:** Público (lectura)  
**Descripción:** Obtiene todos los proveedores con paginación y filtros opcionales.

**Query Parameters:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `page` | number | Página actual (default: 1) |
| `limit` | number | Registros por página (default: 10, max: 100) |
| `search` | string | Búsqueda en nombre, email o teléfono |
| `status` | enum | `active\|inactive\|suspended` |
| `rating_min` | number | Rating mínimo (0-5) |
| `rating_max` | number | Rating máximo (0-5) |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Proveedor S.A.",
        "email": "contacto@proveedor.com",
        "phone": "+52...",
        "status": "active",
        "rating": 4.8,
        "totalEvaluations": 23,
        "address": {
          "street": "Av. Principal 123",
          "city": "Ciudad",
          "country": "México"
        },
        "taxId": "RFC...",
        "bankAccount": {
          "name": "Banco XYZ",
          "accountNumber": "123456789",
          "routingNumber": "012345678"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 47,
      "itemsPerPage": 10
    }
  }
}
```

---

### 2. Buscar Proveedores
```http
GET /api/v1/suppliers/search?q={query}&type={type}
```

**Permisos:** Público  
**Descripción:** Búsqueda avanzada con filtros por tipo de proveedor.

**Query Parameters:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `q` | string | Término de búsqueda (nombre, email, teléfono) |
| `type` | enum | `hardware\|software\|services\|infrastructure\|all` |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Proveedor S.A.",
        "email": "contacto@proveedor.com",
        "phone": "+52...",
        "type": "hardware",
        "rating": 4.8,
        "totalEvaluations": 23
      }
    ],
    "count": 15
  }
}
```

---

### 3. Obtener Proveedor por ID
```http
GET /api/v1/suppliers/:id
```

**Permisos:** Público  
**Descripción:** Obtiene detalles completos de un proveedor específico.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Proveedor S.A.",
    "email": "contacto@proveedor.com",
    "phone": "+52...",
    "status": "active",
    "rating": 4.8,
    "totalEvaluations": 23,
    "address": {
      "street": "Av. Principal 123",
      "city": "Ciudad",
      "country": "México"
    },
    "taxId": "RFC...",
    "bankAccount": {
      "name": "Banco XYZ",
      "accountNumber": "123456789",
      "routingNumber": "012345678"
    }
  }
}
```

---

### 4. Crear Proveedor
```http
POST /api/v1/suppliers
Authorization: Bearer {token}
Role: Admin, InventoryManager
```

**Permisos:** Solo `Admin` o `InventoryManager`  
**Descripción:** Crea un nuevo proveedor en el sistema.

**Request Body:**
```json
{
  "name": "Proveedor S.A.",
  "email": "contacto@proveedor.com",
  "phone": "+52...",
  "type": "hardware",
  "status": "active",
  "address": {
    "street": "Av. Principal 123",
    "city": "Ciudad",
    "country": "México"
  },
  "taxId": "RFC...",
  "bankAccount": {
    "name": "Banco XYZ",
    "accountNumber": "123456789",
    "routingNumber": "012345678"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Proveedor creado exitosamente",
  "data": {
    "id": "uuid",
    ...
  }
}
```

---

### 5. Actualizar Proveedor
```http
PUT /api/v1/suppliers/:id
Authorization: Bearer {token}
Role: Admin, InventoryManager
```

**Permisos:** Solo `Admin` o `InventoryManager`  
**Descripción:** Actualiza información de un proveedor existente.

**Request Body:** (Campos parciales permitidos)
```json
{
  "name": "Proveedor S.A. Actualizado",
  "email": "nuevo@email.com",
  "phone": "+52...",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Proveedor actualizado exitosamente",
  "data": {
    ...
  }
}
```

---

### 6. Borrar Proveedor
```http
DELETE /api/v1/suppliers/:id
Authorization: Bearer {token}
Role: Admin
```

**Permisos:** Solo `Admin`  
**Descripción:** Elimina un proveedor del sistema (soft delete).

**Response:**
```json
{
  "success": true,
  "message": "Proveedor eliminado exitosamente"
}
```

---

### 7. Agregar Evaluación de Desempeño
```http
POST /api/v1/suppliers/:id/evaluations
Authorization: Bearer {token}
Role: Admin, InventoryManager
```

**Permisos:** Solo `Admin` o `InventoryManager`  
**Descripción:** Agrega una evaluación de desempeño a un proveedor.

**Request Body:**
```json
{
  "rating": 4.5,
  "categoryScores": {
    "quality": 5,
    "delivery": 4,
    "communication": 4,
    "price": 5,
    "support": 4
  },
  "notes": "Excelente calidad de productos y entrega puntual",
  "evaluatorName": "Juan Pérez"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Evaluación agregada exitosamente",
  "data": {
    "id": "uuid",
    "supplierId": "uuid",
    "rating": 4.5,
    "categoryScores": { ... },
    "notes": "...",
    "evaluatorName": "Juan Pérez",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 📊 Métricas y KPIs Automáticos

El controlador calcula automáticamente las siguientes métricas:

### Rating Promedio
```typescript
rating = Σ(evaluations.rating) / evaluations.length
```

### Total de Evaluaciones
```typescript
totalEvaluations = evaluations.length
```

### Porcentaje de Productos en Garantía
```typescript
warrantyPercentage = (productsWithWarranty / totalProducts) * 100
```

---

## 🔒 Seguridad y Autorización

| Endpoint | Método | Roles Permitidos |
|----------|--------|------------------|
| `/api/v1/suppliers` (list) | GET | Público |
| `/api/v1/suppliers/search` | GET | Público |
| `/api/v1/suppliers/:id` (get) | GET | Público |
| `/api/v1/suppliers` (create) | POST | Admin, InventoryManager |
| `/api/v1/suppliers/:id` (update) | PUT | Admin, InventoryManager |
| `/api/v1/suppliers/:id` (delete) | DELETE | Admin |
| `/api/v1/suppliers/:id/evaluations` (add) | POST | Admin, InventoryManager |

---

## 🎨 Patrones de Diseño Implementados

### 1. **Repository Pattern**
Separación clara entre lógica de negocio y acceso a datos:
```typescript
interface ISupplierRepository {
  findAll(): Promise<Supplier[]>;
  findById(id: string): Promise<Supplier | null>;
  create(data: CreateSupplierDto): Promise<Supplier>;
  update(id: string, data: UpdateSupplierDto): Promise<Supplier>;
  delete(id: string): Promise<void>;
}
```

### 2. **DTO Pattern**
Validación estricta de entrada/salida con clases DTO dedicadas.

### 3. **Service Layer**
Lógica de negocio encapsulada en `suppliers.service.ts`:
- Cálculo de métricas
- Validaciones de negocio
- Manipulación de evaluaciones

### 4. **Error Handling Centralizado**
Manejo consistente de errores con tipos específicos:
```typescript
type SupplierError = 
  | { kind: 'NOT_FOUND'; message: string }
  | { kind: 'INVALID_INPUT'; message: string }
  | { kind: 'UNAUTHORIZED'; message: string }
  | { kind: 'FORBIDDEN'; message: string };
```

### 5. **Soft Delete**
Eliminación lógica con campo `deletedAt` para auditoría y recuperación.

---

## 📝 Ejemplos de Uso

### Crear un nuevo proveedor
```bash
curl -X POST http://localhost:3001/api/v1/suppliers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Proveedor Tecnología S.A.",
    "email": "ventas@proveedor.com",
    "phone": "+52-555-1234",
    "type": "hardware",
    "status": "active",
    "address": {
      "street": "Av. Tecnológica 100",
      "city": "Ciudad de México",
      "country": "México"
    },
    "taxId": "ABC123456XYZ",
    "bankAccount": {
      "name": "BBVA Bancomer",
      "accountNumber": "0123456789",
      "routingNumber": "012"
    }
  }'
```

### Agregar evaluación de desempeño
```bash
curl -X POST http://localhost:3001/api/v1/suppliers/UUID_EVALUACION \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4.8,
    "categoryScores": {
      "quality": 5,
      "delivery": 4,
      "communication": 5,
      "price": 4,
      "support": 5
    },
    "notes": "Excelente proveedor de hardware con entrega puntual y soporte técnico excepcional",
    "evaluatorName": "Juan Pérez"
  }'
```

---

## 🧪 Pruebas Recomendadas

### Unit Tests
- ✅ Validación de inputs en DTOs
- ✅ Cálculo correcto de rating promedio
- ✅ Manejo de evaluaciones vacías
- ✅ Soft delete con recuperación

### Integration Tests
- ✅ Autenticación y autorización por roles
- ✅ Búsqueda con filtros complejos
- ✅ Actualización parcial (PATCH)
- ✅ Conversión de borrado lógico a físico

---

## 📚 Referencias

- [Prisma Schema - Suppliers](../../../../entities/Supplier.md)
- [Base de Datos - Proveedores](../../../../07_Base_de_datos.md#3-proveedores)
- [Código Fuente Controlador](./suppliers.controller.ts)
- [Código Fuente Servicio](../../../services/suppliers.service.ts)

---

## ✅ Estado de Implementación

| Componente | Estatus | Notas |
|------------|---------|-------|
| Controller | ✅ Completo | CRUD + Evaluaciones |
| Service | ✅ Completo | Lógica de negocio completa |
| Repository | ✅ Completo | Prisma con soft delete |
| DTOs | ✅ Completos | Create, Update, Evaluation |
| Rutas en index.ts | ✅ Registradas | Todos los endpoints activos |
| Documentación | ✅ Actualizada | Este archivo |

---

**Última actualización:** 2026-08-11  
**Versión:** 1.0.0  
**Estado:** 🟢 Producción lista