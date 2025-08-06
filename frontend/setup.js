const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Setting up Solana Token Launcher Frontend...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Please run this script from the frontend directory.');
  process.exit(1);
}

// Required dependencies for the project
const requiredDeps = [
  'buffer',
  'crypto-browserify', 
  'stream-browserify',
  'process',
  'react-app-rewired'
];

console.log('📦 Checking and installing required dependencies...\n');

// Install required dependencies
try {
  console.log('Installing polyfill dependencies...');
  execSync('npm install buffer crypto-browserify stream-browserify process', { stdio: 'inherit' });
  
  console.log('Installing react-app-rewired...');
  execSync('npm install --save-dev react-app-rewired', { stdio: 'inherit' });
  
  console.log('✅ All dependencies installed successfully!\n');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  console.log('\n🔄 Trying alternative installation method...');
  
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed with npm install\n');
  } catch (altError) {
    console.error('❌ Failed to install dependencies:', altError.message);
    process.exit(1);
  }
}

// Check if .env file exists, create if not
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file...');
  const envContent = `# API Configuration
REACT_APP_API_URL=http://localhost:5000

# Solana Configuration
REACT_APP_SOLANA_RPC_URL=https://api.devnet.solana.com
REACT_APP_NETWORK=devnet

# Orca Configuration
REACT_APP_ORCA_POOLS_URL=https://api.orca.so/v1/whirlpool/list
`;
  
  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created\n');
}

console.log('🎉 Setup complete! You can now run:');
console.log('   npm start\n'); 