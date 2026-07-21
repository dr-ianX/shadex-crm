# SHADEX OS - Guía de Instalación y Despliegue

## 📋 Requisitos Previos

### Para Desarrollo Local
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** >= 14 (o usar Docker)
- **Git**

### Para Despliegue en Producción
- **Docker** >= 20.10.0
- **Docker Compose** >= 2.0.0
- **Servidor** con acceso a PostgreSQL (GoDaddy u otro)

---

## 🚀 Instalación Local (Desarrollo)

### 1. Clonar el Proyecto

```bash
cd "G:\My Drive\Scripts\ShadeX CRM\shadex-os"
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias del monorepo
npm install

# Instalar dependencias del backend
cd packages/backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 3. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cd packages/backend
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/shadex_os?schema=public"

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 4. Configurar Base de Datos

#### Opción A: PostgreSQL Local

Si tienes PostgreSQL instalado localmente:

```bash
# Crear base de datos
createdb shadex_os

# Ejecutar migraciones
cd packages/backend
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate
```

#### Opción B: Docker PostgreSQL

Si prefieres usar Docker para la base de datos:

```bash
# Iniciar PostgreSQL con Docker
docker run --name shadex-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=shadex_os \
  -p 5432:5432 \
  -d postgres:15-alpine

# Ejecutar migraciones
cd packages/backend
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate
```

### 5. Iniciar Desarrollo

```bash
# Regresar al directorio raíz
cd ../../

# Iniciar backend y frontend simultáneamente
npm run dev
```

Esto iniciará:
- **Backend API**: http://localhost:3001
- **Frontend UI**: http://localhost:5173
- **Prisma Studio**: http://localhost:5555 (opcional, para ver datos)

### 6. Verificar Instalación

```bash
# Verificar API
curl http://localhost:3001/health

# Debería retornar:
# {
#   "status": "ok",
#   "message": "SHADEX OS API is running",
#   ...
# }
```

---

## 🐳 Despliegue con Docker (Producción)

### 1. Preparar Variables de Entorno

Crear archivo `.env` en el directorio raíz:

```env
DATABASE_URL=postgresql://postgres:password@postgres:5432/shadex_os?schema=public
PORT=3001
NODE_ENV=production
JWT_SECRET=your-production-secret-key
CORS_ORIGIN=https://tu-dominio.com
```

### 2. Construir Imágenes Docker

```bash
npm run docker:build
```

### 3. Iniciar Contenedores

```bash
npm run docker:up
```

Esto iniciará:
- **PostgreSQL**: puerto 5432
- **Backend API**: puerto 3001
- **Nginx**: puerto 80 (frontend + proxy)

### 4. Verificar Despliegue

```bash
# Ver logs
npm run docker:logs

# Verificar health check
curl http://localhost:3001/health
```

### 5. Ejecutar Migraciones en Producción

```bash
# Ejecutar migraciones en el contenedor
docker exec -it shadex-backend npx prisma migrate deploy

# Generar cliente Prisma
docker exec -it shadex-backend npx prisma generate
```

---

## 🌐 Despliegue en GoDaddy

### Opción A: Docker en GoDaddy (Recomendado)

Si GoDaddy soporta Docker:

1. **Subir archivos al servidor**
   ```bash
   # Usar SCP, SFTP o Git
   scp -r shadex-os user@tu-servidor:/path/to/deploy
   ```

2. **Configurar variables de entorno**
   ```bash
   # En el servidor
   cd shadex-os
   nano .env
   ```

3. **Iniciar contenedores**
   ```bash
   docker-compose up -d
   ```

### Opción B: Despliegue Tradicional en GoDaddy

Si GoDaddy no soporta Docker:

1. **Construir frontend**
   ```bash
   cd packages/frontend
   npm run build
   ```

2. **Subir archivos de frontend**
   - Subir contenido de `dist/` a `public_html/`

3. **Configurar backend**
   - Subir archivos del backend
   - Instalar dependencias: `npm install --production`
   - Configurar base de datos PostgreSQL de GoDaddy
   - Ejecutar migraciones: `npx prisma migrate deploy`

4. **Configurar dominio**
   - Apuntar dominio al directorio del frontend
   - Configurar proxy para API si es necesario

---

## 🔧 Configuración de Base de Datos en GoDaddy

### 1. Crear Base de Datos en GoDaddy

1. Acceder al panel de control de GoDaddy
2. Navegar a "Databases" > "MySQL" o "PostgreSQL"
3. Crear nueva base de datos `shadex_os`
4. Crear usuario y contraseña
5. Anotar credentials

### 2. Configurar Prisma para GoDaddy

Actualizar `DATABASE_URL` en `.env`:

```env
# Para PostgreSQL en GoDaddy
DATABASE_URL="postgresql://usuario:password@host:puerto/shadex_os?schema=public"

# Ejemplo típico de GoDaddy
DATABASE_URL="postgresql://shadex_user:TuPassword@localhost:5432/shadex_os?schema=public"
```

### 3. Ejecutar Migraciones

```bash
cd packages/backend
npx prisma migrate deploy
npx prisma generate
```

---

## 📱 Acceso a la Aplicación

### Desarrollo Local
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/v1
- **Prisma Studio**: http://localhost:5555

### Producción (Docker)
- **Frontend**: http://localhost (o tu dominio)
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### Producción (GoDaddy)
- **Frontend**: https://tu-dominio.com
- **Backend API**: https://api.tu-dominio.com (configurar proxy)

---

## 🛠️ Comandos Útiles

### Desarrollo
```bash
npm run dev              # Iniciar backend y frontend
npm run dev:backend      # Solo backend
npm run dev:frontend     # Solo frontend
npm run build            # Construir todo
npm run start            # Iniciar producción
```

### Base de Datos
```bash
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:studio   # UI de base de datos
```

### Docker
```bash
npm run docker:build     # Construir imágenes
npm run docker:up        # Iniciar contenedores
npm run docker:down      # Detener contenedores
npm run docker:logs      # Ver logs
```

---

## 🔍 Solución de Problemas

### Problema: "Cannot connect to database"
**Solución**:
1. Verificar que PostgreSQL esté corriendo
2. Verificar `DATABASE_URL` en `.env`
3. Verificar que el puerto sea correcto

### Problema: "Module not found"
**Solución**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problema: "Port already in use"
**Solución**:
```bash
# En Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# En Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Problema: Docker container no inicia
**Solución**:
```bash
# Ver logs
docker-compose logs backend

# Reconstruir contenedor
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 📞 Soporte

Para problemas técnicos:
1. Revisar logs del contenedor: `npm run docker:logs`
2. Verificar configuración de `.env`
3. Revisar documentación de Prisma: https://www.prisma.io/docs
4. Revisar documentación de Docker: https://docs.docker.com

---

## 🎯 Próximos Pasos

1. **Completar implementación de endpoints API**
2. **Conectar frontend con API real**
3. **Implementar autenticación**
4. **Configurar backups de base de datos**
5. **Configurar SSL/HTTPS para producción**
6. **Optimizar para rendimiento**