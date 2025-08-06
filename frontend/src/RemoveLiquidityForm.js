
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Connection,
  PublicKey,
} from "@solana/web3.js";
import {
  WhirlpoolContext,
  buildWhirlpoolClient,
  ORCA_WHIRLPOOL_PROGRAM_ID,
} from "@orca-so/whirlpools-sdk";
import { useWallet } from './WalletConnect';

function RemoveLiquidityForm() {
  const { wallet, publicKey, isConnected } = useWallet();
  const [status, setStatus] = useState("");
  const [positions, setPositions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [explorerUrl, setExplorerUrl] = useState("");

  const connection = useMemo(() => new Connection("https://api.devnet.solana.com"), []);
  


    const loadPositions = useCallback(async () => {
    setExplorerUrl("");
    if (!isConnected || !publicKey) {
      setStatus("Please connect Phantom wallet");
      return;
    }

    setStatus("🔍 Loading positions...");
    
         try {
       // Test connection first
       console.log('Testing RPC connection...');
             const testBalance = await connection.getBalance(publicKey);
      console.log('Connection test successful, balance:', testBalance / 1e9, 'SOL');
       
               // Validate wallet public key more thoroughly
        if (!publicKey) {
          throw new Error('Wallet public key is undefined');
        }
        
        if (typeof publicKey.toBase58 !== 'function') {
          throw new Error('Wallet public key is missing toBase58 method');
        }

        console.log('Wallet public key validation passed:', publicKey.toBase58());

        // Create provider for Orca SDK with proper validation
        // Convert wallet public key to Solana PublicKey object to ensure _bn property exists
        const walletPublicKey = new PublicKey(publicKey.toBase58());
        
        const walletAdapter = {
          publicKey: walletPublicKey,
          signTransaction: wallet.signTransaction,
          signAllTransactions: wallet.signAllTransactions,
        };

                console.log('Creating WhirlpoolContext with correct SDK usage...');
        

        
        // Use the ORCA_WHIRLPOOL_PROGRAM_ID directly since it's already a proper PublicKey
        const programId = ORCA_WHIRLPOOL_PROGRAM_ID;
        console.log('Using program ID:', programId.toBase58());
        
        // Add try-catch specifically for WhirlpoolContext creation
        let ctx;
        try {
          // Use the correct WhirlpoolContext.from signature: (connection, wallet, programId)
          ctx = WhirlpoolContext.from(connection, walletAdapter, programId);
          console.log('WhirlpoolContext created successfully');
        } catch (ctxError) {
          console.error('Error creating WhirlpoolContext:', ctxError);
          throw new Error(`Failed to create Orca context: ${ctxError.message}`);
        }
       const client = buildWhirlpoolClient(ctx);
       
                       console.log('Finding position accounts owned by wallet...');
        
        // Find all position accounts owned by the wallet using getProgramAccounts
        const positionAccounts = await connection.getProgramAccounts(
          ORCA_WHIRLPOOL_PROGRAM_ID,
          {
            filters: [
              {
                memcmp: {
                  offset: 8, // Position owner offset in the account data
                  bytes: walletPublicKey.toBase58()
                }
              }
            ]
          }
        );
        
        console.log('Found position accounts:', positionAccounts.length);
        
        if (positionAccounts.length === 0) {
          console.log('No position accounts found for this wallet');
          setPositions([]);
          setStatus('✅ No LP positions found for this wallet.');
          return;
        }
        
        // Extract position addresses from the accounts
        const positionAddresses = positionAccounts.map(account => account.pubkey);
        console.log('Position addresses:', positionAddresses.map(addr => addr.toBase58()));
        
        // Now use getPositions with the correct array of position addresses
        console.log('Fetching position data...');
        const userPositions = await client.getPositions(positionAddresses);
        
        console.log('User positions:', userPositions);
        
        // Convert the record to an array of positions (filter out null values)
        const positionsArray = Object.values(userPositions).filter(position => position !== null);
        setPositions(positionsArray);
        setStatus(`✅ Found ${positionsArray.length} position(s).`);
       
     } catch (error) {
       console.error('Error loading positions:', error);
       
       setStatus(`❌ Error loading positions: ${error.message}`);
       setPositions([]);
     }
  }, [connection]);

    const removeLiquidity = async () => {
    if (!selected) return;
    setStatus("⏳ Removing liquidity...");
    setExplorerUrl("");

         const wallet = window.solana;
     
           // Validate wallet public key
      if (!wallet.publicKey) {
        throw new Error('Invalid wallet public key for removal');
      }

           // Convert wallet public key to Solana PublicKey object to ensure _bn property exists
      const walletPublicKey = new PublicKey(wallet.publicKey.toBase58());
      
              const walletAdapter = {
          publicKey: walletPublicKey,
          signTransaction: wallet.signTransaction,
          signAllTransactions: wallet.signAllTransactions,
        };

     try {
               console.log('Creating WhirlpoolContext for removal...');
        const programId = ORCA_WHIRLPOOL_PROGRAM_ID;
        
        // Add try-catch specifically for WhirlpoolContext creation
        let ctx;
        try {
          // Use the correct WhirlpoolContext.from signature: (connection, wallet, programId)
          ctx = WhirlpoolContext.from(connection, walletAdapter, programId);
          console.log('WhirlpoolContext created successfully for removal');
        } catch (ctxError) {
          console.error('Error creating WhirlpoolContext for removal:', ctxError);
          throw new Error(`Failed to create Orca context for removal: ${ctxError.message}`);
        }
       const client = buildWhirlpoolClient(ctx);
       
       console.log('Getting position for removal...');
       const pos = await client.getPosition(new PublicKey(selected));
       
       console.log('Closing position...');
       const tx = await pos.closePosition().buildAndSend();
       
       setStatus("✅ Removed liquidity!");
       setExplorerUrl(`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`);
       
       // Refresh positions after removal
       loadPositions();
       
     } catch (e) {
       console.error('Error removing liquidity:', e);
       setStatus(`❌ Error: ${e.message}`);
     }
  };

  useEffect(() => {
    // Only load positions if wallet is connected and has a valid public key
    if (isConnected && publicKey) {
      loadPositions();
    } else {
      setPositions([]);
      setStatus("Please connect Phantom wallet");
    }
  }, [isConnected, publicKey, loadPositions]);

  return (
    <div>
      <h2>Remove Liquidity</h2>
      
             {/* Debug info */}
       <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
         <span style={{ color: '#4CAF50' }}>
            ✅ Using compatible Orca SDK v0.12.5 - Fixed position fetching!
          </span>
       </div>
      
      <button onClick={loadPositions}>🔄 Reload My Pools</button>
      
      {/* Debug button */}
      <button 
        onClick={() => {
          console.log('Wallet debug info:', {
            isConnected: isConnected,
            hasPublicKey: !!publicKey,
            publicKeyType: typeof publicKey,
            publicKeyValue: publicKey ? publicKey.toBase58() : 'N/A'
          });
        }}
        style={{ marginLeft: '10px', fontSize: '12px', padding: '5px' }}
      >
        🔍 Debug Wallet
      </button>
      
      {/* Test connection button */}
      <button 
                 onClick={async () => {
           try {
             const connection = new Connection("https://api.devnet.solana.com");
             const balance = await connection.getBalance(publicKey);
            console.log('Wallet balance:', balance / 1e9, 'SOL');
            setStatus(`✅ Wallet test successful! Balance: ${(balance / 1e9).toFixed(4)} SOL`);
          } catch (error) {
            console.error('Wallet test failed:', error);
            setStatus(`❌ Wallet test failed: ${error.message}`);
          }
        }}
        style={{ marginLeft: '10px', fontSize: '12px', padding: '5px' }}
      >
        🧪 Test Connection
      </button>

      {positions.length === 0 && <p>No LP positions found.</p>}

      {positions.length > 0 && (
        <>
          <label>Select a Position:</label>
          <select onChange={(e) => setSelected(e.target.value)}>
            <option value="">Select</option>
            {positions.map((p, i) => (
              <option key={i} value={p.getData().positionMint.toBase58()}>
                {p.getData().positionMint.toBase58()}
              </option>
            ))}
          </select>
          <br />
          <button onClick={removeLiquidity}>Remove Selected</button>
        </>
      )}

      <p>{status}</p>

      {explorerUrl && (
        <p>
          🔗{" "}
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
            View on Solana Explorer
          </a>
        </p>
      )}
    </div>
  );
}

export default RemoveLiquidityForm;
