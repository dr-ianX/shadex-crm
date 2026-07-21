# stop-local.ps1
# Uso: cd "C:\ShadeX CRM\shadex-os" ; .\stop-local.ps1
Set-Location "C:\ShadeX CRM\shadex-os"
Write-Host "Deteniendo y removiendo contenedores (sin borrar volúmenes)..."
try {
    docker compose down
} catch {
    docker-compose down
}
Write-Host "Contenedores detenidos."