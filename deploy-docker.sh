#!/bin/bash

# Solana Coin Launcher Docker Deployment Script
set -e

echo "🚀 Starting Docker deployment for Solana Coin Launcher..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Set environment variables
export BACKEND_URL=${BACKEND_URL:-"http://localhost:5000"}
export SOLANA_RPC_URL=${SOLANA_RPC_URL:-"https://api.mainnet-beta.solana.com"}
export NETWORK=${NETWORK:-"mainnet-beta"}

print_status "Environment variables set:"
echo "  BACKEND_URL: $BACKEND_URL"
echo "  SOLANA_RPC_URL: $SOLANA_RPC_URL"
echo "  NETWORK: $NETWORK"

# Build and deploy
print_status "Building Docker images..."
docker-compose -f docker-compose.prod.yml build

print_status "Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 10

# Check if services are running
print_status "Checking service status..."

# Check backend health
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    print_status "✅ Backend is healthy"
else
    print_warning "⚠️  Backend health check failed, but service might still be starting..."
fi

# Check frontend
if curl -f http://localhost:80 > /dev/null 2>&1; then
    print_status "✅ Frontend is accessible"
else
    print_warning "⚠️  Frontend check failed, but service might still be starting..."
fi

print_status "🎉 Deployment completed!"
echo ""
echo "📱 Access your application:"
echo "  Frontend: http://localhost"
echo "  Backend API: http://localhost:5000"
echo "  Health Check: http://localhost:5000/health"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  Stop services: docker-compose -f docker-compose.prod.yml down"
echo "  Restart services: docker-compose -f docker-compose.prod.yml restart" 