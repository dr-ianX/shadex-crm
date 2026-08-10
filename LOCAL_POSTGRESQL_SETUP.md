# Configuración de PostgreSQL Local para Desarrollo

## Opción 1: Usar Docker (Recomendado)

### 1. Instalar Docker Desktop
- Descargar desde [docker.com](https://www.docker.com/products/docker-desktop)
- Instalar y iniciar Docker Desktop

### 2. Crear contenedor PostgreSQL
```bash
# En el directorio raíz del proyecto (shadex-os)
docker run --name shadex-postgres \
  -e POSTGRES_PASSWORD=shadex_password \
  -e POSTGRES_USER=shadex_user \
  -e POSTGRES_DB=shadex_os \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Verificar que está corriendo
```bash
docker ps
# Deberías ver shadex-postgres en la lista
```

### 4. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
cp packages/backend/.env.example packages/backend/.env

# Editar packages/backend/.env con:
DATABASE_URL="postgresql://shadex_user:shadex_password@localhost:5432/shadex_os?schema=public"
```

## Opción 2: Instalar PostgreSQL Localmente

### Windows
1. Descargar PostgreSQL desde [postgresql.org](https://www.postgresql.org/download/windows/)
2. Instalar con contraseña segura
3. Usar pgAdmin para crear base de datos `shadex_os`
4. Configurar DATABASE_URL en `.env`

### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
createdb shadex_os
```

### Linux
```bash
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createdb shadex_os
```

## Migración de Base de Datos

### 1. Generar cliente Prisma
```bash
cd packages/backend
npx prisma generate
```

### 2. Ejecutar migraciones
```bash
cd packages/backend
npx prisma migrate dev --name init
```

### 3. (Opcional) Sembrar datos de prueba
```bash
cd packages/backend
npm run dev
# El servidor seederá automáticamente los datos de demo
```

## Verificación

### 1. Probar conexión con Prisma Studio
```bash
cd packages/backend
npx prisma studio
# Abre http://localhost:5555
```

### 2. Probar API
```bash
cd packages/backend
npm run dev
# API corre en http://localhost:3001
```

### 3. Test de health check
```bash
curl http://localhost:3001/health
```

## Solución de Problemas

### Docker no inicia
- Verificar que Docker Desktop esté corriendo
- Revisar logs: `docker logs shadex-postgres`

### Error de conexión
- Verificar que PostgreSQL esté corriendo en puerto 5432
- Chequear DATABASE_URL en `.env`
- Probar conexión: `psql -U shadex_user -d shadex_os -h localhost`

### Migraciones fallan
- Eliminar base de datos y recrear:
```bash
docker exec -it shadex-postgres psql -U shadex_user -c "DROP DATABASE shadex_os;"
docker exec -it shadex-postgres psql -U shadex_user -c "CREATE DATABASE shadex_os;"
```

## Comandos Útiles de Docker

```bash
# Ver logs
docker logs shadex-postgres

# Entrar al contenedor
docker exec -it shadex-postgres psql -U shadex_user -d shadex_os

# Detener contenedor
docker stop shadex-postgres

# Iniciar contenedor
docker start shadex-postgres

# Eliminar contenedor
docker rm -f shadex-postgres
```

## Siguiente Paso

Una vez configurado PostgreSQL localmente:
1. Ejecutar migraciones
2. Iniciar el backend
3. Probar endpoints
4. Conectar frontend