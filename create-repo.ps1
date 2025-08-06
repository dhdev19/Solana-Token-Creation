# PowerShell script to open GitHub repository creation page
Write-Host "Opening GitHub repository creation page..." -ForegroundColor Green
Write-Host "Repository name: coinlauncher-app" -ForegroundColor Yellow
Write-Host "Description: Solana token launcher with Orca liquidity integration" -ForegroundColor Yellow
Write-Host "Make it Public" -ForegroundColor Yellow
Write-Host "Don't initialize with README (we already have one)" -ForegroundColor Yellow

# Open GitHub new repository page
Start-Process "https://github.com/new"

Write-Host "`nAfter creating the repository:" -ForegroundColor Cyan
Write-Host "1. Copy the repository URL" -ForegroundColor White
Write-Host "2. Run: git remote set-url origin YOUR_REPO_URL" -ForegroundColor White
Write-Host "3. Run: git push -u origin main" -ForegroundColor White 