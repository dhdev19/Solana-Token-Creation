# Docker Deployment Guide for Solana Coin Launcher

This guide provides step-by-step instructions for deploying the Solana Coin Launcher application using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed
- At least 4GB of available RAM
- Ports 80 and 5000 available

## Quick Start

### Option 1: Automated Deployment (Recommended)

#### For Linux/macOS:
```bash
chmod +x deploy-docker.sh
./deploy-docker.sh
```

#### For Windows:
```powershell
.\docker-deploy.ps1
```

### Option 2: Manual Deployment

1. **Clone the repository:**
```bash
git clone <repository-url>
cd coinlauncher-app
```

2. **Set environment variables:**
```bash
export BACKEND_URL=http://localhost:5000
export SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
export NETWORK=mainnet-beta
```

3. **Build and start services:**
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

4. **Verify deployment:**
```bash
# Check if services are running
docker-compose -f docker-compose.prod.yml ps

# Check backend health
curl http://localhost:5000/health

# Check frontend
curl http://localhost
```

## Accessing the Application

- **Frontend:** http://localhost
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## Docker Configuration Details

### Frontend Container
- **Base Image:** Node.js 18 Alpine
- **Build Process:** Multi-stage build with Nginx
- **Port:** 80
- **Features:**
  - React app build optimization
  - Nginx server with security headers
  - Static asset caching
  - Client-side routing support

### Backend Container
- **Base Image:** Python 3.11 Slim
- **Server:** Gunicorn with 4 workers
- **Port:** 5000
- **Features:**
  - Health check endpoint
  - Non-root user for security
  - Production-ready configuration
  - Automatic restart on failure

## Environment Variables

### Required Variables
```bash
BACKEND_URL=http://localhost:5000          # Backend API URL
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com  # Solana RPC endpoint
NETWORK=mainnet-beta                       # Solana network
```

### Optional Variables
```bash
FLASK_ENV=production                       # Flask environment
PORT=5000                                  # Backend port
```

## Management Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Stop Services
```bash
docker-compose -f docker-compose.prod.yml down
```

### Restart Services
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Update and Redeploy
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up --build -d
```

### Clean Up
```bash
# Stop and remove containers
docker-compose -f docker-compose.prod.yml down

# Remove images
docker-compose -f docker-compose.prod.yml down --rmi all

# Remove volumes (WARNING: This will delete data)
docker-compose -f docker-compose.prod.yml down -v
```

## Production Deployment

### Cloud Platforms

#### AWS ECS
1. Build and push images to ECR
2. Create ECS cluster and services
3. Configure load balancer
4. Set environment variables

#### Google Cloud Run
1. Build and push images to Container Registry
2. Deploy services to Cloud Run
3. Configure domain mapping
4. Set environment variables

#### Azure Container Instances
1. Build and push images to Container Registry
2. Deploy to Container Instances
3. Configure networking
4. Set environment variables

### Custom Server
1. Install Docker on your server
2. Copy project files
3. Set environment variables
4. Run deployment script
5. Configure reverse proxy (optional)

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :80
lsof -i :5000

# Stop conflicting services or change ports in docker-compose.prod.yml
```

#### Build Failures
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose -f docker-compose.prod.yml build --no-cache
```

#### Memory Issues
```bash
# Check Docker memory usage
docker stats

# Increase Docker memory limit in Docker Desktop settings
```

#### Network Issues
```bash
# Check container networking
docker network ls
docker network inspect coinlauncher-app_default

# Restart Docker network
docker network prune
```

### Health Checks

#### Backend Health
```bash
curl -f http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "coinlauncher-api"
}
```

#### Frontend Health
```bash
curl -f http://localhost
```

Should return the React app HTML.

### Log Analysis

#### Backend Logs
```bash
docker-compose -f docker-compose.prod.yml logs backend | grep ERROR
```

#### Frontend Logs
```bash
docker-compose -f docker-compose.prod.yml logs frontend | grep error
```

## Security Considerations

- Containers run as non-root users
- Security headers configured in Nginx
- HTTPS enforcement in production
- Environment variables for sensitive data
- Regular security updates

## Monitoring

### Built-in Monitoring
- Health check endpoints
- Docker container status
- Application logs

### Recommended Monitoring
- Prometheus + Grafana
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Application Performance Monitoring (APM)

## Backup and Recovery

### Data Backup
```bash
# Backup environment variables
cp .env .env.backup

# Backup Docker volumes (if any)
docker run --rm -v coinlauncher-app_data:/data -v $(pwd):/backup alpine tar czf /backup/data-backup.tar.gz -C /data .
```

### Recovery
```bash
# Restore environment variables
cp .env.backup .env

# Restore data (if any)
docker run --rm -v coinlauncher-app_data:/data -v $(pwd):/backup alpine tar xzf /backup/data-backup.tar.gz -C /data
```

## Performance Optimization

### Resource Limits
```yaml
# Add to docker-compose.prod.yml
services:
  frontend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
```

### Scaling
```bash
# Scale backend workers
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

## Support

For issues and questions:
- Check the troubleshooting section
- Review Docker and application logs
- Verify environment variables
- Ensure all prerequisites are met

## Current Status

### ✅ **Resolved Issues:**
- **Docker build errors** - Fixed multi-stage build issues
- **Frontend startup issues** - Resolved dependency conflicts
- **Orca SDK compatibility** - Using compatible versions (v0.12.5)
- **RPC endpoint issues** - Using reliable devnet endpoint
- **Mock data fallback** - ✅ **REMOVED** - Now using real Orca integration only
- **Position fetching** - ✅ **FIXED** - Using getProgramAccounts + getPositions correctly
- **Backend API errors** - ✅ **FIXED** - Updated Solana Python SDK compatibility and SPL token API with correct imports, response handling, TypedDict usage, and transaction signing
- **Transaction signing** - ✅ **FIXED** - Implemented exact official Solana documentation: serialize_message() for unsigned transactions, use Transaction.populate() in frontend, add mint signature first, then Phantom signature, using devnet

### 🔧 **Current Configuration:**
- **Orca SDK:** v0.12.5 (compatible with Solana Web3.js v1.88.0)
- **Solana Web3.js:** v1.88.0
- **Solana Python SDK:** v0.29.2 (compatible with solders v0.14.0)
- **RPC Endpoint:** https://api.devnet.solana.com (for token creation)
- **Integration:** ✅ **Real Orca Whirlpools SDK integration** (no mock data)
- **Status:** Ready for testing with real Orca positions

### 🚀 **Next Steps:**
1. Run the development server with `npm start`
2. Test Remove Liquidity functionality with real Orca positions
3. Verify no `_bn` errors occur
4. Test position removal on devnet 