# SHADEX OS - Sistema de Transformaciones Arquitectónicas

Plataforma operativa para gestionar transformaciones arquitectónicas de SHADEX.

## 🏗️ Arquitectura

**Stack Tecnológico:**
- **Backend**: Node.js + Express + TypeScript
- **ORM**: Prisma
- **Base de datos**: PostgreSQL
- **Frontend**: React + Material-UI + Vite
- **Despliegue**: Docker + Docker Compose

## 📁 Estructura del Proyecto

```
shadex-os/
├── packages/
│   ├── backend/          # API REST con Express + TypeScript
│   └── frontend/         # UI React + Material-UI
├── docker-compose.yml    # Orquestación de contenedores
├── Dockerfile           # Configuración de contenedor
├── package.json         # Scripts del monorepo
└── README.md           # Este archivo
```

## 🚀 Instalación y Desarrollo

### Requisitos Previos
- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker y Docker Compose (para despliegue)
- PostgreSQL (o usar Docker)

### Instalación Local

1. **Clonar el repositorio**
```bash
cd shadex-os
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp packages/backend/.env.example packages/backend/.env
```

4. **Configurar base de datos**
```bash
npm run prisma:migrate
npm run prisma:generate
```

5. **Iniciar desarrollo**
```bash
npm run dev
```

- Backend: http://localhost:3001
- Frontend: http://localhost:5173
- Prisma Studio: http://localhost:5555

## 🐳 Despliegue con Docker

### Construir Imágenes
```bash
npm run docker:build
```

### Iniciar Contenedores
```bash
npm run docker:up
```

### Ver Logs
```bash
npm run docker:logs
```

### Detener Contenedores
```bash
npm run docker:down
```

## 📊 Módulos Implementados

### Core
- ✅ Transformations (Entidad central)
- ✅ Clients
- ✅ Technologies (con datos comerciales)
- ✅ Suppliers

### Operativo
- ✅ Inventory (control de materiales)
- ✅ Finance (flujo de caja)
- ✅ Support (incidencias y garantías)
- ✅ Workflows (automatizaciones)

## 🔧 Scripts Disponibles

```bash
npm run dev              # Iniciar backend y frontend
npm run dev:backend      # Solo backend
npm run dev:frontend     # Solo frontend
npm run build            # Construir todo
npm run start            # Iniciar producción
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:studio   # UI de base de datos
```

## 📖 Documentación

- [Documentación de Arquitectura](../15_Product_Manifiesto.md)
- [Integración de Requisitos del Cliente](../16_INTEGRATION_CLIENT_REQUIREMENTS.md)
- [API Documentation](packages/backend/README.md)
- [UI Documentation](packages/frontend/README.md)

## 🎯 Próximos Pasos

1. Completar implementación de endpoints API
2. Finalizar componentes UI
3. Implementar workflows automáticos
4. Configurar integraciones externas
5. Optimizar para producción

## 🤝 Soporte

Para dudas o soporte técnico, revisar la documentación del proyecto.