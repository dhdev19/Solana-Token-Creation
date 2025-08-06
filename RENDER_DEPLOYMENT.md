# Render Deployment Guide

This guide will walk you through deploying your Solana Coin Launcher application on Render.

## Prerequisites

- GitHub repository with your code
- Render account (free at [render.com](https://render.com))

## Step 1: Deploy Backend (Flask API)

### 1.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Verify your email

### 1.2 Create Web Service for Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select your repository

### 1.3 Configure Backend Service
Fill in the following details:

- **Name**: `coinlauncher-backend` (or any name you prefer)
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
- **Plan**: Free (or choose paid plan)

### 1.4 Add Environment Variables
Click "Environment" tab and add:

```
FLASK_ENV=production
FLASK_DEBUG=0
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
CORS_ORIGINS=https://your-frontend-url.onrender.com
```

**Note**: Replace `your-frontend-url.onrender.com` with your actual frontend URL after you deploy it.

### 1.5 Deploy Backend
1. Click "Create Web Service"
2. Wait for deployment to complete (usually 2-3 minutes)
3. Copy your backend URL (e.g., `https://coinlauncher-backend.onrender.com`)

## Step 2: Deploy Frontend (React App)

### 2.1 Create Static Site for Frontend
1. Click "New +" → "Static Site"
2. Connect your GitHub repository (same as backend)
3. Select your repository

### 2.2 Configure Frontend Site
Fill in the following details:

- **Name**: `coinlauncher-frontend` (or any name you prefer)
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`
- **Plan**: Free (or choose paid plan)

### 2.3 Add Environment Variables
Click "Environment" tab and add:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_SOLANA_RPC_URL=https://api.devnet.solana.com
REACT_APP_NETWORK=devnet
REACT_APP_ORCA_POOLS_URL=https://api.orca.so/v1/whirlpool/list
```

**Important**: Replace `your-backend-url.onrender.com` with the actual backend URL from Step 1.5.

### 2.4 Deploy Frontend
1. Click "Create Static Site"
2. Wait for deployment to complete (usually 3-5 minutes)
3. Copy your frontend URL (e.g., `https://coinlauncher-frontend.onrender.com`)

## Step 3: Update Backend CORS Settings

After both services are deployed:

1. Go back to your backend service on Render
2. Click "Environment" tab
3. Update `CORS_ORIGINS` to include your frontend URL:
   ```
   CORS_ORIGINS=https://your-frontend-url.onrender.com
   ```
4. Click "Save Changes"
5. Your backend will automatically redeploy

## Step 4: Test Your Deployment

1. **Test Backend**: Visit your backend URL + `/health`
   - Should return: `{"status": "healthy", "service": "coinlauncher-api"}`

2. **Test Frontend**: Visit your frontend URL
   - Should load the React application
   - Connect your Phantom wallet
   - Try creating a token

## Troubleshooting

### Common Issues

#### Backend Issues
1. **Build fails**: Check that `gunicorn` is in `requirements.txt`
2. **Import errors**: Ensure all dependencies are in `requirements.txt`
3. **CORS errors**: Verify `CORS_ORIGINS` includes your frontend URL

#### Frontend Issues
1. **Build fails**: Check that all dependencies are in `package.json`
2. **API calls fail**: Verify `REACT_APP_API_URL` points to correct backend URL
3. **Environment variables not loading**: Ensure all variables start with `REACT_APP_`

#### General Issues
1. **Service not starting**: Check the logs in Render dashboard
2. **Timeout errors**: Free tier has limitations; consider upgrading
3. **Cold starts**: Free tier services sleep after inactivity

### Useful Commands

#### Check Backend Logs
- Go to your backend service on Render
- Click "Logs" tab
- Look for any error messages

#### Check Frontend Build Logs
- Go to your frontend site on Render
- Click "Logs" tab
- Look for build errors

#### Manual Redeploy
- Go to your service/site on Render
- Click "Manual Deploy" → "Deploy latest commit"

## Environment Variables Reference

### Backend (.env)
```env
FLASK_ENV=production
FLASK_DEBUG=0
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
CORS_ORIGINS=https://your-frontend-url.onrender.com
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_SOLANA_RPC_URL=https://api.devnet.solana.com
REACT_APP_NETWORK=devnet
REACT_APP_ORCA_POOLS_URL=https://api.orca.so/v1/whirlpool/list
```

## Cost Considerations

- **Free Tier**: 
  - Backend: Sleeps after 15 minutes of inactivity
  - Frontend: Always available
  - Limited bandwidth and build minutes
- **Paid Plans**: 
  - Always-on services
  - More resources and bandwidth
  - Custom domains

## Next Steps

After successful deployment:

1. **Test all features**: Create tokens, add liquidity, remove liquidity
2. **Monitor logs**: Check for any errors or issues
3. **Set up custom domain** (optional): Add your own domain name
4. **Configure monitoring** (optional): Set up alerts for downtime
5. **Scale up** (optional): Upgrade to paid plan for better performance

## Support

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Render Community**: [community.render.com](https://community.render.com)
- **GitHub Issues**: Create an issue in your repository for code-specific problems 