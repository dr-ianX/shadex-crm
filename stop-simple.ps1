# stop-simple.ps1
# Minimal stop script
Set-Location "C:\ShadeX CRM\shadex-os"
Write-Host "Stopping Docker Compose services..."
try {
    docker compose down
} catch {
    docker-compose down
}
Write-Host "Stopped."