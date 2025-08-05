# Solana Coin Launcher

A decentralized application for creating and managing tokens on the Solana blockchain with liquidity pool functionality.

## Features

- Create new tokens on Solana
- Add liquidity to token pools
- Remove liquidity from pools
- Web3 wallet integration (Phantom)
- Modern React frontend with Tailwind CSS
- Flask backend API

## Project Structure

```
coinlauncher-app/
├── frontend/          # React application
├── backend/           # Flask API
├── docker-compose.yml # Local development setup
└── README.md
```

## Prerequisites

- Node.js 18+
- Python 3.11+
- Git
- Docker (optional, for containerized deployment)

## Local Development

### Option 1: Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd coinlauncher-app
```

2. Start the development environment:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Option 2: Manual Setup

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Start the development server:
```bash
npm start
```

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment file:
```bash
cp env.example .env
```

5. Start the Flask server:
```bash
python app.py
```

## Deployment

### Frontend Deployment (Netlify)

1. **Prepare for deployment:**
   - Ensure all environment variables are set in Netlify
   - Update `netlify.toml` with your backend URL

2. **Deploy via Netlify CLI:**
```bash
cd frontend
npm run build
netlify deploy --prod --dir=build
```

3. **Deploy via Git:**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Configure environment variables in Netlify dashboard

### Backend Deployment (Heroku)

1. **Install Heroku CLI and login:**
```bash
heroku login
```

2. **Create Heroku app:**
```bash
cd backend
heroku create your-app-name
```

3. **Set environment variables:**
```bash
heroku config:set FLASK_ENV=production
heroku config:set SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

4. **Deploy:**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Automated Deployment (GitHub Actions)

1. **Set up GitHub Secrets:**
   - `NETLIFY_AUTH_TOKEN`: Your Netlify API token
   - `NETLIFY_SITE_ID`: Your Netlify site ID
   - `HEROKU_API_KEY`: Your Heroku API key
   - `HEROKU_APP_NAME`: Your Heroku app name
   - `HEROKU_EMAIL`: Your Heroku email

2. **Push to main branch:**
   - The GitHub Actions workflow will automatically deploy both frontend and backend

### Docker Deployment

1. **Build and run with Docker Compose:**
```bash
docker-compose -f docker-compose.prod.yml up --build
```

2. **Deploy to cloud platforms:**
   - **AWS ECS:** Use the provided Dockerfiles
   - **Google Cloud Run:** Deploy containers directly
   - **Azure Container Instances:** Use the Docker images

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
REACT_APP_NETWORK=mainnet-beta
```

### Backend (.env)
```
FLASK_ENV=production
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
PORT=5000
```

## API Endpoints

- `GET /` - Health check
- `GET /health` - API health status
- `POST /create-token` - Create new token

## Security Considerations

- Use HTTPS in production
- Set appropriate CORS headers
- Validate all user inputs
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints

## Monitoring and Logging

- Backend includes health check endpoint
- Use logging services (e.g., Sentry, LogRocket)
- Monitor API performance and errors
- Set up alerts for critical failures

## Troubleshooting

### Common Issues

1. **CORS errors:** Ensure backend CORS is properly configured
2. **Build failures:** Check Node.js and Python versions
3. **Deployment issues:** Verify environment variables are set correctly

### Support

For issues and questions:
- Check the GitHub Issues page
- Review the deployment logs
- Verify all prerequisites are met

## License

This project is licensed under the MIT License.
