# start-simple.ps1
# Minimal start script: builds and starts Docker Compose, runs migrations, opens browser.
# Usage:
#   cd "C:\ShadeX CRM\shadex-os"
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   .\start-simple.ps1

Set-Location "C:\ShadeX CRM\shadex-os"
Write-Host "Starting Docker Compose (build + up -d)..."
try {
    docker compose up -d --build
} catch {
    Write-Host "docker compose failed, trying docker-compose..."
    docker-compose up -d --build
}

Write-Host "Waiting 8 seconds for containers to initialize..."
Start-Sleep -Seconds 8

Write-Host "Running Prisma migrations (may fail if DB not ready)."
try {
    docker exec shadex-backend sh -c 'cd packages/backend && npx prisma migrate dev --name init --skip-seed'
    docker exec shadex-backend sh -c 'cd packages/backend && npx prisma generate'
} catch {
    Write-Warning "Prisma migrate/generate failed. You can re-run: docker exec -it shadex-backend sh -c 'cd packages/backend && npx prisma migrate dev'"
}

Write-Host "Opening frontend and health endpoint in browser..."
Start-Process "http://localhost"
Start-Process "http://localhost:3001/health"

Write-Host "Done. If issues remain, run docker compose logs for diagnostics."