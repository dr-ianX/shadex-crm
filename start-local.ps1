# start-local.ps1
# Ejecutar desde PowerShell. Crea/actualiza nginx.conf (hace backup), crea .env si no existe,
# arranca Docker Compose, instala libs necesarias en el contenedor (si hace falta),
# ejecuta migraciones Prisma con reintentos, reinicia nginx y abre el navegador.
# Uso: en PowerShell:
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   cd "C:\ShadeX CRM\shadex-os"
#   .\start-local.ps1

$Repo = "C:\ShadeX CRM\shadex-os"
Set-Location $Repo

# 1) nginx.conf - backup y escritura
$nginxPath = Join-Path $Repo "nginx.conf"
if (Test-Path $nginxPath) {
    $bak = $nginxPath + ".bak_" + (Get-Date -Format yyyyMMddHHmmss)
    Copy-Item $nginxPath $bak
    Write-Host "Backup de nginx.conf creado: $bak"
}

$nginxConf = @'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    upstream backend {
        server backend:3001;
    }

    server {
        listen 80;
        server_name localhost;

        # Serve frontend static files
        location / {
            root /usr/share/nginx/html;
            try_files $uri /index.html;
        }

        # Proxy API requests to backend
        location /api {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
'@

Set-Content -Path $nginxPath -Value $nginxConf -Encoding UTF8
Write-Host "nginx.conf actualizado."

# 2) Crear .env para backend solo si no existe
$envPath = Join-Path $Repo "packages\backend\.env"
if (-not (Test-Path $envPath)) {
    $envContent = @'
# Database
DATABASE_URL="postgresql://postgres:password@postgres:5432/shadex_os?schema=public"

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=replace-with-a-long-random-string-ChangeMeNow!
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# External Services (optional)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

# Google Maps API (opcional)
# GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Payment Gateway (opcional)
# STRIPE_SECRET_KEY=your-stripe-secret-key
'@
    New-Item -ItemType Directory -Force -Path (Split-Path $envPath) > $null
    Set-Content -Path $envPath -Value $envContent -Encoding UTF8
    Write-Host ".env creado en packages/backend/.env"
} else {
    Write-Host ".env ya existe en packages/backend/.env — no se sobrescribe."
}

# 3) Arrancar Docker Compose (build y up)
Write-Host "Iniciando Docker Compose (build + up -d)..."
try {
    docker compose up -d --build | Out-Null
} catch {
    Write-Host "Intentando con docker-compose (compatibilidad)..."
    docker-compose up -d --build | Out-Null
}

# 4) Esperar que containers estén arriba
Write-Host "Esperando containers..."
$maxWait = 120
$elapsed = 0
while ($elapsed -lt $maxWait) {
    try {
        $ps = docker compose ps --services --filter "status=running" 2>$null
        if (-not $ps) { $ps = docker-compose ps --services --filter "status=running" 2>$null }
    } catch { $ps = "" }
    if ($ps -match "postgres" -and $ps -match "backend") {
        Write-Host "Containers postgres y backend corriendo."
        break
    }
    Start-Sleep -Seconds 2
    $elapsed += 2
}
if ($elapsed -ge $maxWait) { Write-Warning "Tiempo de espera agotado. Revisa 'docker compose ps'." }

# 5) Instalar libs (si está basado en Alpine) — detecta apk
Write-Host "Comprobando si hay apk en el contenedor backend..."
$hasApk = $null
try {
    $hasApk = docker exec shadex-backend sh -c "which apk >/dev/null 2>&1 && echo apk" 2>$null
} catch {}

if ($hasApk -like "*apk*") {
    Write-Host "Contenedor backend usa apk. Instalando openssl y librerías necesarias..."
    docker exec shadex-backend sh -c "apk add --no-cache openssl libstdc++ libgcc libc6-compat" | Out-Null
    Write-Host "Instalación de paquetes dentro del contenedor terminada."
} else {
    Write-Host "apk no detectado o no necesario."
}

# 6) Ejecutar migraciones con reintentos
Write-Host "Ejecutando migraciones Prisma (reintentos)..."
$maxRetries = 20
for ($i=1; $i -le $maxRetries; $i++) {
    Write-Host "Intento $i/$maxRetries..."
    try {
        docker exec shadex-backend sh -c "cd packages/backend && npx prisma migrate dev --name init --skip-seed" 2>&1 | Write-Host
        docker exec shadex-backend sh -c "cd packages/backend && npx prisma generate" 2>&1 | Write-Host
        Write-Host "Migraciones y generación Prisma completadas."
        break
    } catch {
        Write-Host "Migración falló en el intento $i. Reintentando en 5s..."
        Start-Sleep -Seconds 5
    }
    if ($i -eq $maxRetries) {
        Write-Error "No se pudo ejecutar la migración después de múltiples intentos."
        exit 1
    }
}

# 7) Reiniciar nginx para cargar nuevo nginx.conf
Write-Host "Reiniciando nginx..."
try {
    docker compose restart nginx | Out-Null
} catch {
    docker-compose restart nginx | Out-Null
}

Start-Sleep -Seconds 2

# 8) Abrir navegador
Write-Host "Abriendo http://localhost en tu navegador..."
Start-Process "http://localhost"
Start-Process "http://localhost:3001/health"

Write-Host "Proceso completado. SI HAY PÁGINA EN BLANCO: abre DevTools (F12) -> Console y pega aquí el error."