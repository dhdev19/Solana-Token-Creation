# Solana Coin Launcher Docker Deployment Script for Windows
param(
    [string]$BackendUrl = "http://localhost:5000",
    [string]$SolanaRpcUrl = "https://api.mainnet-beta.solana.com",
    [string]$Network = "mainnet-beta"
)

Write-Host "🚀 Starting Docker deployment for Solana Coin Launcher..." -ForegroundColor Green

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

# Check if Docker is installed
try {
    docker --version | Out-Null
    Write-Status "Docker is installed"
} catch {
    Write-Error "Docker is not installed. Please install Docker Desktop first."
    exit 1
}

# Check if Docker Compose is installed
try {
    docker-compose --version | Out-Null
    Write-Status "Docker Compose is installed"
} catch {
    Write-Error "Docker Compose is not installed. Please install Docker Compose first."
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

# Build and deploy
Write-Status "Building Docker images..."
docker-compose -f docker-compose.prod.yml build

Write-Status "Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
Write-Status "Waiting for services to be ready..."
Start-Sleep -Seconds 10

# Check if services are running
Write-Status "Checking service status..."

# Check backend health
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Status "✅ Backend is healthy"
    }
} catch {
    Write-Warning "⚠️  Backend health check failed, but service might still be starting..."
}

# Check frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Status "✅ Frontend is accessible"
    }
} catch {
    Write-Warning "⚠️  Frontend check failed, but service might still be starting..."
}

Write-Status "🎉 Deployment completed!"
Write-Host ""
Write-Host "📱 Access your application:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost"
Write-Host "  Backend API: http://localhost:5000"
Write-Host "  Health Check: http://localhost:5000/health"
Write-Host ""
Write-Host "📋 Useful commands:" -ForegroundColor Cyan
Write-Host "  View logs: docker-compose -f docker-compose.prod.yml logs -f"
Write-Host "  Stop services: docker-compose -f docker-compose.prod.yml down"
Write-Host "  Restart services: docker-compose -f docker-compose.prod.yml restart" 