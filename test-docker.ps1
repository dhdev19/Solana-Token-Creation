# Test Docker Setup for Solana Coin Launcher
Write-Host "Testing Docker setup for Solana Coin Launcher..." -ForegroundColor Green

# Test Docker installation
Write-Host "Checking Docker installation..." -ForegroundColor Cyan
try {
    $dockerVersion = docker --version
    Write-Host "Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "Docker is not installed or not running" -ForegroundColor Red
    exit 1
}

# Test Docker Compose
Write-Host "Checking Docker Compose..." -ForegroundColor Cyan
try {
    $composeVersion = docker-compose --version
    Write-Host "Docker Compose is installed: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "Docker Compose is not installed" -ForegroundColor Red
    exit 1
}

# Test Docker daemon
Write-Host "Testing Docker daemon..." -ForegroundColor Cyan
try {
    docker info | Out-Null
    Write-Host "Docker daemon is running" -ForegroundColor Green
} catch {
    Write-Host "Docker daemon is not running. Please start Docker Desktop" -ForegroundColor Red
    exit 1
}

Write-Host "Docker setup test completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: .\docker-deploy.ps1" -ForegroundColor White
Write-Host "2. Or manually: docker-compose -f docker-compose.prod.yml up --build -d" -ForegroundColor White
Write-Host "3. Access the app at: http://localhost" -ForegroundColor White 