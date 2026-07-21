# start-local-fixed.ps1
# One-click local start for SHADEX OS (Windows PowerShell)
# Usage:
#   Open PowerShell, navigate to project folder and run:
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   cd "C:\ShadeX CRM\shadex-os"
#   .\start-local-fixed.ps1

$Repo = "C:\ShadeX CRM\shadex-os"
Set-Location $Repo

# --- 1) Backup and write nginx.conf ---
$nginxPath = Join-Path $Repo "nginx.conf"
if (Test-Path $nginxPath) {
    $bakName = "$nginxPath.bak_{0}" -f (Get-Date -Format yyyyMMddHHmmss)
    try { Copy-Item -Path $nginxPath -Destination $bakName -Force; Write-Host "Backup created: $bakName" } catch { Write-Warning "Could not create backup of nginx.conf: $_" }
}

$nginxContent = @'
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

try {
    Set-Content -Path $nginxPath -Value $nginxContent -Encoding UTF8 -Force
    Write-Host "nginx.conf written"
} catch { Write-Warning "Failed to write nginx.conf: $_" }

# --- 2) Ensure backend .env exists (create minimal .env for local Docker) ---
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
'@
    try {
        New-Item -ItemType Directory -Force -Path (Split-Path $envPath) | Out-Null
        Set-Content -Path $envPath -Value $envContent -Encoding UTF8 -Force
        Write-Host "Created packages/backend/.env"
    } catch { Write-Warning "Failed to create .env: $_" }
} else { Write-Host "packages/backend/.env already exists — leaving it unchanged." }

# --- 3) Start Docker Compose (build + up -d) ---
Write-Host "Starting Docker Compose (build + up -d)..."
try {
    docker compose up -d --build | Out-Null
} catch {
    Write-Host "docker compose failed, trying docker-compose..."
    try { docker-compose up -d --build | Out-Null } catch { Write-Error "Failed to start Docker Compose: $_"; exit 1 }
}

# --- 4) Wait for postgres and backend to be running ---
$timeout = 180
$elapsed = 0
Write-Host "Waiting for postgres and backend containers to be running (timeout ${timeout}s)..."
while ($elapsed -lt $timeout) {
    Start-Sleep -Seconds 2
    $elapsed += 2
    try {
        $running = (docker compose ps --services --filter "status=running" 2>$null)
        if (-not $running -or $running -eq $null) { $running = (docker-compose ps --services --filter "status=running" 2>$null) }
        $runningText = $running -join " `n "
    } catch { $runningText = "" }
    if ($runningText -match "postgres" -and $runningText -match "backend") { Write-Host "postgres and backend are running."; break }
}
if ($elapsed -ge $timeout) { Write-Warning "Timeout waiting for containers. Check 'docker compose ps'" }

# --- 5) If backend container uses apk (Alpine), install required libs ---
try {
    $hasApk = docker exec shadex-backend sh -c 'which apk >/dev/null 2>&1 && echo apk' 2>$null
    if ($hasApk -and $hasApk -match "apk") {
        Write-Host "Installing openssl and other runtime libs inside backend container..."
        docker exec shadex-backend sh -c "apk add --no-cache openssl libstdc++ libgcc libc6-compat" | Out-Null
        Write-Host "Runtime libs installed."
    }
} catch { Write-Host "Skipping apk install (container may not be ready or not Alpine): $_" }

# --- 6) Run Prisma migrations (with retries) ---
$maxRetries = 10
for ($i=1; $i -le $maxRetries; $i++) {
    Write-Host "Running migrations (attempt $i/$maxRetries)..."
    try {
        docker exec shadex-backend sh -c 'cd packages/backend && npx prisma migrate dev --name init --skip-seed' | Write-Host
        docker exec shadex-backend sh -c 'cd packages/backend && npx prisma generate' | Write-Host
        Write-Host "Migrations completed."
        break
    } catch {
        Write-Host "Migration attempt $i failed — retrying in 5s..."
        Start-Sleep -Seconds 5
        if ($i -eq $maxRetries) { Write-Error "Migrations failed after $maxRetries attempts."; exit 1 }
    }
}

# --- 7) Restart nginx so it picks up the new config ---
try { docker compose restart nginx | Out-Null } catch { try { docker-compose restart nginx | Out-Null } catch { Write-Warning "Failed to restart nginx: $_" } }

Start-Sleep -Seconds 2

# --- 8) Open browser to frontend and health endpoint ---
try { Start-Process "http://localhost" } catch {}
try { Start-Process "http://localhost:3001/health" } catch {}

Write-Host "start-local-fixed completed. If the UI is blank: open DevTools (F12) and paste console errors here."