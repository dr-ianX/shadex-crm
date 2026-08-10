# Guía de Despliegue en Render.com - SHADEX OS

## Resumen de Arquitectura

**Despliegue Dinámico Recomendado** (NO estático)

- **Backend**: Node.js + Express + TypeScript (Web Service)
- **Base de Datos**: PostgreSQL (Database Service)
- **Frontend**: React + Vite (Static Site)
- **Almacenamiento**: Sistema de archivos del backend

## Requisitos Previos

1. Cuenta en [Render.com](https://render.com)
2. Repositorio en GitHub con el código del proyecto
3. Configuración de variables de entorno sensibles

## Pasos de Despliegue

### 1. Preparación del Repositorio

```bash
# Asegurarse de que todo está commiteado
git add .
git commit -m "Preparación para despliegue en Render"
git push origin main
```

### 2. Configuración en Render

#### Opción A: Usar render.yaml (Recomendado)

1. Conectar tu repositorio de GitHub a Render
2. Render detectará automáticamente el archivo `render.yaml`
3. Revisar la configuración y hacer clic en "Deploy"

#### Opción B: Configuración Manual

1. **Crear Base de Datos PostgreSQL**
   - New → PostgreSQL
   - Name: `shadex-db`
   - Database: `shadex_os`
   - User: `shadex_user`
   - Plan: Free
   - Region: Oregon (o la más cercana a tus usuarios)

2. **Crear Servicio Backend**
   - New → Web Service
   - Connect GitHub repository
   - Root Directory: `packages/backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables:
     - `NODE_ENV`: `production`
     - `PORT`: `3001`
     - `DATABASE_URL`: (from PostgreSQL service)
     - `JWT_SECRET`: (generate secure random)
     - `JWT_REFRESH_SECRET`: (generate secure random)
     - `UPLOAD_DIR`: `/opt/render/project/uploads`

3. **Crear Sitio Frontend**
   - New → Static Site
   - Connect GitHub repository
   - Root Directory: `packages/frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL`: `https://shadex-backend.onrender.com`

### 3. Migración de Base de Datos

```bash
# Después del despliegue del backend, ejecutar migraciones
# Esto se puede hacer desde el Shell de Render en el servicio backend

cd packages/backend
npx prisma migrate deploy
npx prisma generate
```

### 4. Verificación

1. Verificar que el backend esté respondiendo:
   - `https://shadex-backend.onrender.com/health`

2. Verificar que el frontend cargue:
   - `https://shadex-frontend.onrender.com`

3. Probar autenticación y funcionalidades básicas

## Configuración de Dominio Personalizado (Opcional)

1. Comprar dominio (ej. shadex-crm.com)
2. En Render:
   - Ir a Settings del servicio
   - Domains → Add Domain
   - Configurar DNS según instrucciones de Render

## Monitoreo y Logs

- **Backend Logs**: Dashboard → shadex-backend → Logs
- **Frontend Logs**: Dashboard → shadex-frontend → Logs
- **Database**: Dashboard → shadex-db → Metrics

## Variables de Ambiente Sensibles

Estas deben configurarse manualmente en Render:

- `JWT_SECRET`: Generar con `openssl rand -base64 32`
- `JWT_REFRESH_SECRET`: Generar con `openssl rand -base64 32`
- `SMTP_*`: Si se configurará email
- `GOOGLE_MAPS_API_KEY`: Si se usará Google Maps

## Troubleshooting Común

### Build falla
- Verificar que `package.json` tenga scripts correctos
- Revisar logs de build en Render

### Base de datos no conecta
- Verificar `DATABASE_URL` en variables de ambiente
- Asegurarse de que el servicio PostgreSQL esté iniciado

### Frontend no carga
- Verificar que `VITE_API_URL` sea correcta
- Revisar CORS configuration en backend

### Archivos no se suben
- Verificar permisos en directorio `UPLOAD_DIR`
- Asegurarse de que el directorio exista

## Escalado

Cuando el plan free no sea suficiente:

1. **Backend**: Upgrade a Starter ($7/mes) para más recursos
2. **Database**: Upgrade a production plan para mejor performance
3. **Frontend**: Puede quedarse en plan free

## Costos Estimados (Plan Free)

- **Backend**: $0 (free tier)
- **Database**: $0 (free tier PostgreSQL)
- **Frontend**: $0 (free tier static site)
- **Total**: $0/mes

**Limitaciones Free Tier:**
- Backend: "spins down" después de 15 minutos de inactividad
- Database: 90 días de backups, 1GB de almacenamiento
- Frontend: Sin limitaciones significativas

## Backup y Seguridad

- **Backups automáticos**: Render hace backups diarios de PostgreSQL
- **Security**: Actualizar dependencias regularmente
- **Monitoreo**: Configurar alertas en Render para errores

## Soporte

Para problemas específicos de Render:
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)