# stop-local-fixed.ps1
# Usage: cd "C:\ShadeX CRM\shadex-os" ; .\stop-local-fixed.ps1
Set-Location "C:\ShadeX CRM\shadex-os"
Write-Host "Stopping and removing containers (without deleting volumes)..."
try {
    docker compose down
} catch {
    docker-compose down
}
Write-Host "Containers stopped."