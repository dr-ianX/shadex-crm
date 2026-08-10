# scripts/dev-local.ps1
# Start local dev servers without Docker (Windows PowerShell)
# Usage: Open PowerShell, cd to repo root and run: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; .\scripts\dev-local.ps1

$Repo = "C:\ShadeX CRM\shadex-os"
Set-Location $Repo

Write-Host "Preparing local development environment..."

# Ensure backend dependencies are installed and prisma client generated
Write-Host "Installing backend dependencies (if missing)..."
cd packages\backend
if (-not (Test-Path node_modules)) { npm ci }
Write-Host "Applying prisma schema via db push and generating client..."
npx prisma db push --schema=prisma\schema.prisma
npx prisma generate --schema=prisma\schema.prisma

Write-Host "Building backend..."
npm run build

# Start backend in a new window (so it keeps running)
Write-Host "Starting backend (new window)..."
Start-Process -FilePath "node" -ArgumentList "dist/index.js" -WorkingDirectory (Get-Location) -WindowStyle Normal

# Start frontend dev server
Write-Host "Starting frontend dev server (Vite) in a new window..."
cd ..\frontend
if (-not (Test-Path node_modules)) { npm ci }
Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory (Get-Location) -WindowStyle Normal

Write-Host "Local dev processes started. Open http://localhost:5173 for frontend and http://localhost:3001/health for API health."