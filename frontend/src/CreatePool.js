import React, { useState } from "react";
import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from "@solana/web3.js";
import { useWallet } from './WalletConnect';

function CreatePool() {
  const { wallet, publicKey, isConnected } = useWallet();
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [amountA, setAmountA] = useState(1);
  const [amountB, setAmountB] = useState(1);
  const [status, setStatus] = useState("");
  const [explorerUrl, setExplorerUrl] = useState("");
  const [poolAddress, setPoolAddress] = useState("");

  const createPool = async () => {
    setStatus("Initializing account creation...");
    setExplorerUrl("");
    setPoolAddress("");

    if (!tokenA || !tokenB) {
      setStatus("❌ Please enter both token addresses.");
      return;
    }

    if (!amountA || !amountB) {
      setStatus("❌ Please enter initial liquidity amounts.");
      return;
    }

    // Use reliable public RPC endpoints
    const rpcEndpoints = [
      "https://api.devnet.solana.com",
      "https://solana-devnet.g.alchemy.com/v2/demo",
      "https://rpc.ankr.com/solana_devnet"
    ];

    let connection;
    let workingEndpoint = "";

    // Try each RPC endpoint until one works
    for (const endpoint of rpcEndpoints) {
      try {
        setStatus(`🔧 Testing connection to ${endpoint}...`);
        connection = new Connection(endpoint, "confirmed");
        await connection.getLatestBlockhash();
        workingEndpoint = endpoint;
        setStatus(`✅ Connected to ${endpoint}. Creating demonstration account...`);
        break;
      } catch (error) {
        console.error(`Failed to connect to ${endpoint}:`, error);
        continue;
      }
    }

    if (!connection || !workingEndpoint) {
      setStatus("❌ All RPC endpoints failed. Please try again later.");
      return;
    }

    if (!isConnected || !wallet || !publicKey) {
      setStatus("❌ Phantom wallet not connected.");
      return;
    }

    try {
      const walletPublicKey = new PublicKey(publicKey.toBase58());

      // Test wallet connection first
      setStatus("🔍 Testing wallet connection...");
      try {
        const balance = await connection.getBalance(walletPublicKey);
        console.log('Wallet balance:', balance / 1e9, 'SOL');
        if (balance < 0.001 * 1e9) { // Less than 0.001 SOL
          setStatus("❌ Insufficient SOL balance. Please add more SOL to your wallet.");
          return;
        }
      } catch (balanceError) {
        console.error('Balance check failed:', balanceError);
        setStatus("❌ Failed to check wallet balance. Please check your wallet connection.");
        return;
      }

      // Test wallet connection and get initial blockhash
      try {
        await connection.getLatestBlockhash();
      } catch (blockError) {
        console.error('Blockhash error:', blockError);
        setStatus("❌ Failed to get recent blockhash. Please try again.");
        return;
      }

      // Create a simple demonstration account (not associated with any specific program)
      // This follows Solana documentation for basic account creation
      const poolAccount = Keypair.generate();

      setStatus("📊 Creating demonstration account...");

      // Get minimum rent with timeout
      let rentExemption;
      try {
        rentExemption = await Promise.race([
          connection.getMinimumBalanceForRentExemption(1024),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Rent calculation timeout')), 10000)
          )
        ]);
      } catch (rentError) {
        console.error('Rent calculation error:', rentError);
        setStatus("❌ Failed to calculate rent. Please try again.");
        return;
      }

      // Create account instruction using SystemProgram (owned by SystemProgram)
      const createPoolIx = SystemProgram.createAccount({
        fromPubkey: walletPublicKey,
        newAccountPubkey: poolAccount.publicKey,
        lamports: rentExemption,
        space: 1024,
        programId: SystemProgram.programId, // Owned by SystemProgram, not Raydium
      });

      setStatus("📤 Sending account creation transaction...");

      // Following Solana documentation exactly
      // Create transaction
      const transaction = new Transaction();
      
      // Add instruction
      transaction.add(createPoolIx);
      
      // Get the latest blockhash
      const { blockhash: latestBlockhash } = await connection.getLatestBlockhash();
      
      // Set the recent blockhash
      transaction.recentBlockhash = latestBlockhash;
      
      // Set the fee payer
      transaction.feePayer = walletPublicKey;

      // Log transaction details for debugging
      console.log('Transaction structure:', {
        instructions: transaction.instructions.length,
        recentBlockhash: transaction.recentBlockhash,
        feePayer: transaction.feePayer?.toBase58(),
        signatures: transaction.signatures.length
      });

      // Sign and send transaction using signAndSendTransaction (documentation recommended)
      try {
        // For account creation with Phantom wallet, we need to sign the transaction first
        // then send it, as Phantom doesn't accept external signers in signAndSendTransaction
        
        // Sign the transaction with the new account keypair
        transaction.sign(poolAccount);
        
        // Now sign and send with the wallet
        const signature = await wallet.signAndSendTransaction(transaction);
        
        console.log('Transaction sent successfully:', signature);
        
        // Wait for confirmation
        const confirmation = await connection.confirmTransaction(signature, "confirmed");

        console.log('Transaction confirmed:', confirmation);

        setPoolAddress(poolAccount.publicKey.toBase58());
        setStatus("✅ Demonstration account created successfully!");
        setExplorerUrl(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
        
      } catch (txError) {
        console.error('Transaction error:', txError);
        
        // More specific error handling
        if (txError.message.includes('Signature verification failed')) {
          setStatus("❌ Transaction signing failed. Please check your wallet connection and try again.");
        } else if (txError.message.includes('insufficient funds')) {
          setStatus("❌ Insufficient SOL balance. Please add more SOL to your wallet.");
        } else if (txError.message.includes('Account in use')) {
          setStatus("❌ Account already exists. Please try with different token addresses.");
        } else {
          setStatus(`❌ Transaction failed: ${txError.message}`);
        }
      }
      
    } catch (error) {
      console.error('Create Pool Error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('timeout') || error.message.includes('408')) {
        setStatus("❌ Network timeout. Please check your connection and try again.");
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        setStatus("❌ RPC access unauthorized. Please try again later.");
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        setStatus("❌ RPC access forbidden. Please try again later.");
      } else if (error.message.includes('insufficient funds')) {
        setStatus("❌ Insufficient SOL balance. Please add more SOL to your wallet.");
      } else if (error.message.includes('invalid')) {
        setStatus("❌ Invalid token addresses. Please check your input.");
      } else {
        setStatus(`❌ Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Demonstration Account</h2>
      
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
        <p className="text-sm text-green-800">
          <strong>Account Creation Demo:</strong> This creates a basic account owned by the SystemProgram for demonstration purposes.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token A Address (Base):
          </label>
          <input
            type="text"
            value={tokenA}
            onChange={(e) => setTokenA(e.target.value)}
            placeholder="Token A Mint Address"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token B Address (Quote):
          </label>
          <input
            type="text"
            value={tokenB}
            onChange={(e) => setTokenB(e.target.value)}
            placeholder="Token B Mint Address"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial Amount Token A:
          </label>
          <input
            type="number"
            value={amountA}
            onChange={(e) => setAmountA(parseFloat(e.target.value))}
            placeholder="Amount of Token A"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial Amount Token B:
          </label>
          <input
            type="number"
            value={amountB}
            onChange={(e) => setAmountB(parseFloat(e.target.value))}
            placeholder="Amount of Token B"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={createPool}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
        >
          Create Demonstration Account
        </button>

        {status && (
          <div className="mt-4 p-3 rounded-md bg-gray-100">
            <p className="text-sm text-gray-800">{status}</p>
          </div>
        )}

        {poolAddress && (
          <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Account Address:</strong> {poolAddress}
            </p>
          </div>
        )}

        {explorerUrl && (
          <div className="mt-4">
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              View Transaction on Explorer
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePool; 


