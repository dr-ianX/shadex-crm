# Script simple de configuración PostgreSQL para SHADEX OS

Write-Host "Configurando PostgreSQL para SHADEX OS..." -ForegroundColor Green

# Verificar Docker
try {
    docker info > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Docker no esta corriendo" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error: Docker no esta corriendo" -ForegroundColor Red
    exit 1
}

Write-Host "Docker esta corriendo" -ForegroundColor Green

# Eliminar contenedor existente si existe
docker rm -f shadex-postgres > $null 2>&1

# Crear nuevo contenedor
Write-Host "Creando contenedor PostgreSQL..." -ForegroundColor Cyan
docker run --name shadex-postgres -e POSTGRES_PASSWORD=shadex_password -e POSTGRES_USER=shadex_user -e POSTGRES_DB=shadex_os -p 5432:5432 -d postgres:15

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error creando contenedor" -ForegroundColor Red
    exit 1
}

Write-Host "Contenedor creado" -ForegroundColor Green
Start-Sleep -Seconds 5

# Configurar .env
$envFile = "packages\backend\.env"
$envExample = "packages\backend\.env.example"

if (-not (Test-Path $envFile)) {
    Write-Host "Creando archivo .env..." -ForegroundColor Cyan
    Copy-Item $envExample $envFile
    $content = Get-Content $envFile -Raw
    $content = $content -replace 'DATABASE_URL=".*"', 'DATABASE_URL="postgresql://shadex_user:shadex_password@localhost:5432/shadex_os?schema=public"'
    Set-Content $envFile $content
    Write-Host "Archivo .env configurado" -ForegroundColor Green
} else {
    Write-Host "Archivo .env ya existe" -ForegroundColor Yellow
}

# Migraciones
Write-Host "Ejecutando migraciones..." -ForegroundColor Cyan
Set-Location packages\backend
npx prisma generate
npx prisma migrate dev --name init
Set-Location ..\..

Write-Host "Configuracion completada!" -ForegroundColor Green
Write-Host "Inicia backend: cd packages\backend && npm run dev"