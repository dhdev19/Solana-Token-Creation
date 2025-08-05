# Production Docker Deployment Script for Solana Coin Launcher
param(
    [string]$BackendUrl = "http://localhost:5000",
    [string]$SolanaRpcUrl = "https://api.mainnet-beta.solana.com",
    [string]$Network = "mainnet-beta"
)

Write-Host "🚀 Starting PRODUCTION Docker deployment for Solana Coin Launcher..." -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Docker is installed and running
try {
    docker --version | Out-Null
    Write-Status "Docker is installed"
} catch {
    Write-Error "Docker is not installed. Please install Docker Desktop first."
    exit 1
}

try {
    docker info | Out-Null
    Write-Status "Docker daemon is running"
} catch {
    Write-Error "Docker daemon is not running. Please start Docker Desktop first."
    exit 1
}

# Set environment variables
$env:BACKEND_URL = $BackendUrl
$env:SOLANA_RPC_URL = $SolanaRpcUrl
$env:NETWORK = $Network

Write-Status "Environment variables set:"
Write-Host "  BACKEND_URL: $BackendUrl"
Write-Host "  SOLANA_RPC_URL: $SolanaRpcUrl"
Write-Host "  NETWORK: $Network"

# Clean up any existing containers
Write-Status "Cleaning up existing containers..."
docker-compose -f docker-compose.prod.yml down 2>$null

# Clean Docker cache
Write-Status "Cleaning Docker cache..."
docker system prune -f

# Build and deploy
Write-Status "Building production Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed. Please check the error messages above."
    exit 1
}

Write-Status "Starting production services..."
docker-compose -f docker-compose.prod.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to start services. Please check the error messages above."
    exit 1
}

# Wait for services to be ready
Write-Status "Waiting for services to be ready..."
Start-Sleep -Seconds 30

# Check if services are running
Write-Status "Checking service status..."

# Check backend health
$backendHealthy = $false
$attempts = 0
while (-not $backendHealthy -and $attempts -lt 10) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Status "✅ Backend is healthy"
            $backendHealthy = $true
        }
    } catch {
        $attempts++
        Write-Warning "Backend health check attempt $attempts failed, retrying..."
        Start-Sleep -Seconds 5
    }
}

if (-not $backendHealthy) {
    Write-Warning "⚠️  Backend health check failed after multiple attempts"
}

# Check frontend
$frontendHealthy = $false
$attempts = 0
while (-not $frontendHealthy -and $attempts -lt 10) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Status "✅ Frontend is accessible"
            $frontendHealthy = $true
        }
    } catch {
        $attempts++
        Write-Warning "Frontend health check attempt $attempts failed, retrying..."
        Start-Sleep -Seconds 5
    }
}

if (-not $frontendHealthy) {
    Write-Warning "⚠️  Frontend health check failed after multiple attempts"
}

Write-Status "🎉 Production deployment completed!"
Write-Host ""
Write-Host "📱 Access your application:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost" -ForegroundColor White
Write-Host "  Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "  Health Check: http://localhost:5000/health" -ForegroundColor White
Write-Host ""
Write-Host "📋 Management commands:" -ForegroundColor Cyan
Write-Host "  View logs: docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor White
Write-Host "  Stop services: docker-compose -f docker-compose.prod.yml down" -ForegroundColor White
Write-Host "  Restart services: docker-compose -f docker-compose.prod.yml restart" -ForegroundColor White
Write-Host "  Update deployment: .\deploy-production.ps1" -ForegroundColor White 