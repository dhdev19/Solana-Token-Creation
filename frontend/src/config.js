const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  SOLANA_RPC_URL: process.env.REACT_APP_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  NETWORK: process.env.REACT_APP_NETWORK || 'mainnet-beta'
};

export default config; 