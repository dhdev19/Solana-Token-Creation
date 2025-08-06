# Solana Coin Launcher

A decentralized application for creating and managing tokens on the Solana blockchain with Orca liquidity pool integration.

## 🚀 Features

- ✅ **Token Creation**: Create new SPL tokens on Solana
- ✅ **Liquidity Management**: Add/remove liquidity using Orca Whirlpools
- ✅ **Wallet Integration**: Phantom Wallet support
- ✅ **Modern UI**: React frontend with Tailwind CSS
- ✅ **RESTful API**: Flask backend for token operations
- ✅ **Docker Support**: Containerized deployment

## 📁 Project Structure

```
coinlauncher-app/
├── frontend/          # React application
│   ├── src/          # React components
│   ├── public/       # Static files
│   └── package.json  # Frontend dependencies
├── backend/          # Flask API
│   ├── app.py        # Main Flask application
│   ├── services.py   # Solana token services
│   └── requirements.txt
├── docker-compose.yml # Local development setup
└── README.md
```

## ⚙️ Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.11+ ([Download](https://python.org/))
- **Git** ([Download](https://git-scm.com/))
- **Phantom Wallet** ([Download](https://phantom.app/))
- **Docker** (optional, for containerized deployment)

## 🛠️ Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/dhdev19/Solana-Token-Creation.git
cd Solana-Token-Creation
```

### Step 2: Backend Setup

#### Option A: Using Python Virtual Environment (Recommended)

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

4. **Create environment file:**
```bash
# Windows
copy env.example .env

# macOS/Linux
cp env.example .env
```

5. **Start the Flask server:**
```bash
python app.py
```

**✅ Backend will be running at:** http://localhost:5000

#### Option B: Using Docker

```bash
cd backend
docker build -t coinlauncher-backend .
docker run -p 5000:5000 coinlauncher-backend
```

### Step 3: Frontend Setup

#### Option A: Using npm (Recommended)

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install Node.js dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
# Windows
copy env.example .env

# macOS/Linux
cp env.example .env
```

4. **Start the React development server:**
```bash
npm start
```

**✅ Frontend will be running at:** http://localhost:3000

#### Option B: Using Docker

```bash
cd frontend
docker build -t coinlauncher-frontend .
docker run -p 3000:3000 coinlauncher-frontend
```

### Step 4: Using Docker Compose (All-in-One)

1. **From the root directory:**
```bash
docker-compose up --build
```

2. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 Environment Configuration

### Frontend Environment Variables (.env)

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000

# Solana Configuration
REACT_APP_SOLANA_RPC_URL=https://api.devnet.solana.com
REACT_APP_NETWORK=devnet

# Orca Configuration
REACT_APP_ORCA_POOLS_URL=https://api.orca.so/v1/whirlpool/list
```

### Backend Environment Variables (.env)

```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1
PORT=5000

# Solana Configuration
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 🎯 Usage Instructions

### 1. Connect Phantom Wallet

1. **Install Phantom Wallet** from [phantom.app](https://phantom.app/)
2. **Switch to Devnet** in Phantom settings
3. **Get some devnet SOL** from [solfaucet.com](https://solfaucet.com/)
4. **Connect wallet** in the application

### 2. Create a Token

1. **Go to "Create Token" tab**
2. **Fill in token details:**
   - Token Name: Your token name
   - Token Symbol: 3-5 character symbol
   - Decimals: Usually 9
   - Total Supply: Initial token amount
3. **Click "Create Token"**
4. **Approve transaction** in Phantom Wallet

### 3. Add Liquidity

1. **Go to "Add Liquidity" tab**
2. **Enter token addresses:**
   - Token A: WSOL (So11111111111111111111111111111111111111112)
   - Token B: Your created token address
3. **Enter amounts** for both tokens
4. **Click "Add Liquidity"**
5. **Approve transaction** in Phantom Wallet

### 4. Remove Liquidity

1. **Go to "Remove Liquidity" tab**
2. **Select your position** from the dropdown
3. **Enter amount** to remove
4. **Click "Remove Liquidity"**
5. **Approve transaction** in Phantom Wallet

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Backend Issues

1. **Port 5000 already in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

2. **Python dependencies not found:**
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

3. **Virtual environment not activated:**
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### Frontend Issues

1. **Port 3000 already in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

2. **Node modules issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

3. **Buffer not defined error:**
```bash
npm install buffer crypto-browserify stream-browserify process
```

4. **react-app-rewired configuration errors:**
```bash
# Run the setup script
npm run setup

# Or install dependencies manually
npm install buffer crypto-browserify stream-browserify process
npm install --save-dev react-app-rewired

# If still having issues, try without react-app-rewired
npm run eject
# Then manually add Buffer polyfill to webpack config
```

5. **Module resolution errors:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Run setup script
npm run setup
```

#### Wallet Issues

1. **Phantom not connecting:**
   - Ensure you're on the correct network (devnet)
   - Check if Phantom is unlocked
   - Try refreshing the page

2. **Transaction failed:**
   - Check if you have enough SOL for gas fees
   - Ensure you're on devnet for testing
   - Check console for error messages

#### Orca Integration Issues

1. **Pool not found:**
   - Verify token addresses are correct
   - Check if pool exists on Orca
   - Try with different token pairs

2. **Tick range errors:**
   - Use existing position approach
   - Check pool's tick spacing
   - Verify current tick is within bounds

## 📊 API Endpoints

### Backend API (http://localhost:5000)

- `GET /` - Health check
- `GET /health` - API status
- `POST /create-token` - Create new SPL token
- `POST /mint-tokens` - Mint tokens to wallet

### Response Format

```json
{
  "success": true,
  "data": {
    "mint_address": "token_mint_address",
    "signature": "transaction_signature"
  },
  "message": "Token created successfully"
}
```

## 🚀 Deployment

### Frontend Deployment (Netlify)

1. **Build the project:**
```bash
cd frontend
npm run build
```

2. **Deploy to Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Backend Deployment (Heroku)

1. **Create Heroku app:**
```bash
cd backend
heroku create your-app-name
```

2. **Deploy:**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

## 🔒 Security Notes

- ⚠️ **Never commit private keys** to version control
- ⚠️ **Use environment variables** for sensitive data
- ⚠️ **Enable HTTPS** in production
- ⚠️ **Validate all inputs** on both frontend and backend
- ⚠️ **Test on devnet** before mainnet deployment

## 📝 Development Notes

- **Network**: Currently configured for Solana devnet
- **Wallet**: Phantom Wallet integration
- **Liquidity**: Orca Whirlpools integration
- **UI**: React with Tailwind CSS
- **API**: Flask REST API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- 📧 Create an issue on GitHub
- 📖 Check the troubleshooting section
- 🔍 Review console logs for errors
- 🌐 Visit [Solana Docs](https://docs.solana.com/) for blockchain help
