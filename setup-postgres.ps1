# Script de configuración automática de PostgreSQL para SHADEX OS
# Requiere Docker Desktop instalado y corriendo

Write-Host "🚀 Configurando PostgreSQL para SHADEX OS..." -ForegroundColor Green

# Verificar Docker está corriendo
try {
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Docker no está corriendo. Por favor inicia Docker Desktop." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Docker está corriendo" -ForegroundColor Green
} catch {
    Write-Host "❌ Error verificando Docker: $_" -ForegroundColor Red
    exit 1
}

# Verificar si el contenedor ya existe
$existingContainer = docker ps -a -q -f name=shadex-postgres
if ($existingContainer) {
    Write-Host "⚠️  Contenedor shadex-postgres ya existe" -ForegroundColor Yellow
    $response = Read-Host "¿Deseas eliminarlo y recrearlo? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        docker rm -f shadex-postgres
        Write-Host "✅ Contenedor eliminado" -ForegroundColor Green
    } else {
        Write-Host "❌ Cancelado por el usuario" -ForegroundColor Red
        exit 0
    }
}

# Crear contenedor PostgreSQL
Write-Host "🐘 Creando contenedor PostgreSQL..." -ForegroundColor Cyan
docker run --name shadex-postgres -e POSTGRES_PASSWORD=shadex_password -e POSTGRES_USER=shadex_user -e POSTGRES_DB=shadex_os -p 5432:5432 -d postgres:15

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error creando contenedor PostgreSQL" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Contenedor PostgreSQL creado exitosamente" -ForegroundColor Green

# Esperar a que PostgreSQL esté listo
Write-Host "⏳ Esperando a que PostgreSQL esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Verificar que el contenedor está corriendo
$runningContainer = docker ps -q -f name=shadex-postgres
if (-not $runningContainer) {
    Write-Host "❌ El contenedor no está corriendo. Revisa los logs con: docker logs shadex-postgres" -ForegroundColor Red
    exit 1
}

Write-Host "✅ PostgreSQL está corriendo" -ForegroundColor Green

# Configurar archivo .env
$envFile = "packages\backend\.env"
$envExample = "packages\backend\.env.example"

if (-not (Test-Path $envFile)) {
    Write-Host "📝 Creando archivo .env desde .env.example..." -ForegroundColor Cyan
    Copy-Item $envExample $envFile
    
    # Actualizar DATABASE_URL
    $envContent = Get-Content $envFile -Raw
    $envContent = $envContent -replace 'DATABASE_URL=".*"', 'DATABASE_URL="postgresql://shadex_user:shadex_password@localhost:5432/shadex_os?schema=public"'
    Set-Content $envFile $envContent
    
    Write-Host "✅ Archivo .env configurado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Archivo .env ya existe. Verifica que DATABASE_URL esté correcto." -ForegroundColor Yellow
}

# Ejecutar migraciones
Write-Host "🔄 Ejecutando migraciones de Prisma..." -ForegroundColor Cyan
Set-Location packages\backend
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error generando cliente Prisma" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error ejecutando migraciones" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

Set-Location ..\..
Write-Host "✅ Migraciones completadas exitosamente" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Iniciar el backend: cd packages\backend && npm run dev" -ForegroundColor White
Write-Host "2. Probar la API: http://localhost:3001/health" -ForegroundColor White
Write-Host "3. Ver base de datos: npx prisma studio (desde packages\backend)" -ForegroundColor White
Write-Host ""
Write-Host "🐳 Comandos útiles de Docker:" -ForegroundColor Cyan
Write-Host "Ver logs: docker logs shadex-postgres" -ForegroundColor White
Write-Host "Detener: docker stop shadex-postgres" -ForegroundColor White
Write-Host "Iniciar: docker start shadex-postgres" -ForegroundColor White
Write-Host "Eliminar: docker rm -f shadex-postgres" -ForegroundColor White