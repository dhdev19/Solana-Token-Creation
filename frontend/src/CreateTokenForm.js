// import React, { useState } from 'react';
// import bs58 from 'bs58';


// function CreateTokenForm() {
//   const [name, setName] = useState('');
//   const [symbol, setSymbol] = useState('');
//   const [decimals, setDecimals] = useState(9);
//   const [totalSupply, setTotalSupply] = useState(1000000);
//   const [mintAddress, setMintAddress] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // const handleSubmit = async (event) => {
//   //   event.preventDefault();
//   //   setLoading(true);
//   //   setError('');
    
//   //   // Make POST request to Flask API
//   //   const response = await fetch('http://localhost:5000/create-token', {
//   //     method: 'POST',
//   //     headers: { 'Content-Type': 'application/json' },
//   //     body: JSON.stringify({
//   //       name,
//   //       symbol,
//   //       decimals,
//   //       totalSupply,
//   //     }),
//   //   });

//   //   const data = await response.json();
//   //   setLoading(false);

//   //   if (data.success) {
//   //     setMintAddress(data.mintAddress);
//   //   } else {
//   //     setError(data.message);
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setError('');
//   setMintAddress('');

//   if (!window.solana?.publicKey) {
//     setError("Please connect your Phantom Wallet first.");
//     setLoading(false);
//     return;
//   }

//   const walletAddress = window.solana.publicKey.toString();
//   setMintAddress(mint);

// // 🔄 Mint full supply to user wallet
// const mintResponse = await fetch('http://localhost:5000/mint-to-wallet', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({
//     mint: mint,
//     receiver: walletAddress,
//     amount: totalSupply,
//     decimals: decimals
//   }),
// });

// const mintData = await mintResponse.json();

// if (!mintData.success) {
//   setError("Token created but minting failed.");
//   return;
// }

// const mintTx = Uint8Array.from(atob(mintData.transaction), c => c.charCodeAt(0));
// const signedMint = await window.solana.signAndSendTransaction({
//   message: mintTx,
// });

// console.log("Mint TX Signature:", signedMint.signature);


// //   const response = await fetch('http://localhost:5000/create-token', {
// //     method: 'POST',
// //     headers: { 'Content-Type': 'application/json' },
// //     body: JSON.stringify({
// //       wallet: walletAddress,
// //       name,
// //       symbol,
// //       decimals,
// //       totalSupply,
// //     }),
// //   });

// //   const data = await response.json();
// //   setLoading(false);

// //   if (!data.success) {
// //     setError(data.message);
// //     return;
// //   }

// //   const { transaction, mint } = data;

// //   try {
// //     const encodedTx = Uint8Array.from(atob(transaction), c => c.charCodeAt(0));
// //     const signed = await window.solana.signAndSendTransaction({
// //       message: encodedTx,
// //     });

// //     console.log("Signature:", signed.signature);
// //     setMintAddress(mint);
// //   } catch (err) {
// //     console.error(err);
// //     setError("Transaction failed or rejected.");
// //   }
// };

//   return (
//     <div>
//       <h2>Create a New Solana Token</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Token Name:</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Token Symbol:</label>
//           <input
//             type="text"
//             value={symbol}
//             onChange={(e) => setSymbol(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Decimals:</label>
//           <input
//             type="number"
//             value={decimals}
//             onChange={(e) => setDecimals(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Total Supply:</label>
//           <input
//             type="number"
//             value={totalSupply}
//             onChange={(e) => setTotalSupply(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" disabled={loading}>
//           {loading ? 'Creating Token...' : 'Create Token'}
//         </button>
//       </form>

//       {mintAddress && (
//         <div>
//           <h3>Token Created Successfully!</h3>
//           <p>Mint Address: {mintAddress}</p>
//         </div>
//       )}

//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// }


// export default CreateTokenForm;



import React, { useState } from 'react';
import { useWallet } from './WalletConnect';


// Note: Metadata creation has been disabled to avoid Phantom wallet compatibility issues
// The token will work perfectly without metadata, just appears as "Unknown Token"

function CreateTokenForm() {
  const { wallet, publicKey, isConnected } = useWallet();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [decimals, setDecimals] = useState(9);
  const [totalSupply, setTotalSupply] = useState(1000000);
  const [mintAddress, setMintAddress] = useState('');
  const [explorerUrl, setExplorerUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSocialLinks, setShowSocialLinks] = useState(false); // Add this at top
  const base = process.env.REACT_APP_API_URL;


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMintAddress('');
    setExplorerUrl('');

    if (!isConnected || !publicKey) {
      setError("Please connect your Phantom Wallet first.");
      setLoading(false);
      return;
    }

    const walletAddress = publicKey.toString();

    // Step 1: Create token
    const createResponse = await fetch(`${base}/create-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet: walletAddress,
        name,
        symbol,
        decimals,
        totalSupply,
      }),
    });

    const createData = await createResponse.json();
    if (!createData.success) {
      setError(createData.message || 'Token creation failed.');
      setLoading(false);
      return;
    }

    const { mint, transaction: createTx, mint_private_key } = createData;
    setMintAddress(mint);
    setExplorerUrl(`https://explorer.solana.com/address/${mint}?cluster=devnet`);

    // Step 1.5: Sign and send the create token transaction
    try {
      const createTxBytes = Uint8Array.from(atob(createTx), c => c.charCodeAt(0));
      
      // Import required modules
      const { Keypair, Transaction, Message } = await import('@solana/web3.js');
      const bs58 = await import('bs58');
      
      // Create mint keypair from private key
      const decodedKey = bs58.decode(mint_private_key);
      console.log("Decoded keypair length:", decodedKey.length);
      if (decodedKey.length !== 64) {
        throw new Error(`Invalid keypair length: ${decodedKey.length}, expected 64 bytes (32 secret + 32 public)`);
      }
      const mintKeypair = Keypair.fromSecretKey(decodedKey);
      
      // Deserialize the message from bytes (backend sends serialized message)
      const message = Message.from(createTxBytes);
      
      // Create transaction from message using Transaction.populate() (official method)
      const transaction = Transaction.populate(message, []);
      
      // Add mint keypair signature FIRST (following official Solana documentation)
      transaction.partialSign(mintKeypair);
      
      // Let Phantom wallet sign and send the transaction
      const signature = await wallet.signAndSendTransaction(transaction);
      console.log("Create Token TX Signature:", signature.signature);
      
    } catch (error) {
      console.error("Error signing create token transaction:", error);
      setError("Failed to sign create token transaction: " + error.message);
      setLoading(false);
      return;
    }

        // Step 1.6: Skip metadata creation to avoid Phantom wallet issues
        // Metadata creation is complex and often fails with "Unexpected error"
        // The token will work perfectly without metadata, just appears as "Unknown Token"
        console.log("⏭️ Skipping metadata creation to avoid wallet compatibility issues");
        console.log("ℹ️ Token will work without metadata, but will appear as 'Unknown Token' in Phantom Wallet");
        console.log("💡 To add metadata later, use Metaplex tools or upgrade to a newer wallet version");

    // Step 2: Mint full supply to user wallet
    const mintResponse = await fetch(`${base}/mint-to-wallet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mint,
        receiver: walletAddress,
        amount: totalSupply,
        decimals: decimals
      }),
    });

    const mintData = await mintResponse.json();

    if (!mintData.success) {
      setError("Token created but minting failed.");
      setLoading(false);
      return;
    }

    const mintTxBytes = Uint8Array.from(atob(mintData.transaction), c => c.charCodeAt(0));
    
    // For mint-to-wallet, we need to handle the serialized message
    // Import required modules
    const { Message, Transaction } = await import('@solana/web3.js');
    
    // Deserialize the message from bytes (backend sends serialized message)
    const message = Message.from(mintTxBytes);
    
    // Create transaction from message using Transaction.populate() (official method)
    const transaction = Transaction.populate(message, []);
    
    // Sign and send the transaction
    const signedMint = await wallet.signAndSendTransaction(transaction);

    console.log("Mint TX Signature:", signedMint.signature);
    setExplorerUrl(`https://explorer.solana.com/tx/${signedMint.signature}?cluster=devnet`);
    setLoading(false);
  };

  return (
    <div>
      <div className='createtokensec'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <h2>Create a New Solana Token</h2>
      <p>Launch your Solana token in minutes with our easy-to-use platform</p>
          </div>
        </div>
      </div>
      </div>
      
      {/*
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        border: '1px solid #0ea5e9', 
        borderRadius: '8px', 
        padding: '12px', 
        marginBottom: '20px' 
      }}>
        <p style={{ margin: '0', fontSize: '14px', color: '#0369a1' }}>
          <strong>ℹ️ Note:</strong> Token metadata creation is disabled to ensure compatibility with Phantom wallet. 
          Your token will work perfectly but may appear as "Unknown Token" in wallets. 
          You can add metadata later using Metaplex tools.
        </p>
      </div>
     */}

      <div className='container'>
     <div className='formbg'>
      
        <div className='row'>
          <div className='col-lg-12'>
          <form onSubmit={handleSubmit}>
            <div className='row'>
        <div className='col-lg-6'>
          <label>Token Name*</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required className='form-control'
            placeholder='Token name (e.g., Solana)'
          />
        </div>

        <div className='col-lg-6'>
          <label>Token Symbol*</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
            className='form-control'
            placeholder='Token symbol (e.g., SOL)'
          />
        </div>

    </div>

          <div className='row'>
        <div className='col-lg-6'>
          <label>Decimals*</label>
          <input
            type="number"
            value={decimals}
            onChange={(e) => setDecimals(e.target.value)}
            required
            className='form-control'
          />
          <span>Most meme coins use 9 decimals</span>
        </div>
        <div className='col-lg-6'>
          <label>Total Supply*</label>
          <input
            type="number"
            value={totalSupply}
            onChange={(e) => setTotalSupply(e.target.value)}
            required
            className='form-control'
          />
          <span>Most meme coins usually have 1B supply</span>
        </div>
      </div> 

      <div className='row'>
        <div className='col-lg-6'>
          <label>Image</label>
          <input
            type="file"
            className='form-control'
          />
          <span>Most meme coins use a squared 1000x1000 logo</span>
        </div>
        <div className='col-lg-6'>
          <label>Description*</label>
          <textarea  className='form-control' rows={7} placeholder='Describe your token purpose and vision'></textarea>
             
           
        </div>
      </div> 

      <div className='row'>
        <div className='col-lg-6'>
  <div className='sociallinksec'>
    <div className='d-flex align-items-center justify-content-between mb-2'>
      <div>
        <h4 className='mb-0'>Add Social Links & Tags</h4>
        <p className='text-muted' style={{ fontSize: '14px' }}>Add links to your token metadata</p>
      </div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={showSocialLinks}
          onChange={() => setShowSocialLinks(!showSocialLinks)}
        />
        <span className="toggle-slider"></span>
      </label>
    </div>

    {showSocialLinks && (
      <div className='sociallinkswrapper'>
        <div className='socialink d-flex flex-wrap mb-3'>
          <div className='col-lg-6 pe-2'>
            <label>Website</label>
            <input
              type="text"
              className='form-control'
              placeholder='https://yourproject.com'
            />
          </div>
          <div className='col-lg-6 ps-2'>
            <label>Twitter</label>
            <input
              type="text"
              className='form-control'
              placeholder='https://twitter.com/yourtwitter'
            />
          </div>
        </div>
        <div className='socialink d-flex flex-wrap'>
          <div className='col-lg-6 pe-2'>
            <label>Telegram</label>
            <input
              type="text"
              className='form-control'
              placeholder='https://t.me/yourtelegram'
            />
          </div>
          <div className='col-lg-6 ps-2'>
            <label>Discord</label>
            <input
              type="text"
              className='form-control'
              placeholder='https://discord.gg/yourdiscord'
            />
          </div>
        </div>
      </div>
    )}
  </div>
</div>
      </div>

        <button className='btn btn-primary' type="submit" disabled={loading}>
          {loading ? 'Creating Token...' : 'Create Token'}
        </button>
      </form>
          </div>
        </div>
      </div>
     </div>
      
      

      {mintAddress && (
        <div>
          <h3>✅ Token Created Successfully!</h3>
          <p>Mint Address: {mintAddress}</p>
        </div>
      )}

      {explorerUrl && (
        <p>
          🔗 <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
            View on Solana Explorer
          </a>
        </p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CreateTokenForm;
