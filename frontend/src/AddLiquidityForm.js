// // // import React, { useState } from "react";
// // // import { findPoolIdForPair } from "./utils/orcaPoolHelper";
// // // import { Connection, PublicKey } from "@solana/web3.js";
// // // import {
// // //   WhirlpoolContext,
// // //   buildWhirlpoolClient,
// // //   ORCA_WHIRLPOOL_PROGRAM_ID,
// // //   PDAUtil,
// // // } from "@orca-so/whirlpools-sdk";

// // // function AddLiquidityForm() {
// // //   const [amountA, setAmountA] = useState(1);
// // //   const [amountB, setAmountB] = useState(1);
// // //   const [status, setStatus] = useState("");
// // //   const [tokenA, setTokenA] = useState("");
// // //   const [tokenB, setTokenB] = useState("");
// // //   const [explorerUrl, setExplorerUrl] = useState("");

// // //   const addLiquidity = async () => {
// // //     setStatus("Looking for pool...");
// // //     setExplorerUrl("");

// // //     if (!tokenA || !tokenB) {
// // //       setStatus("❌ Please enter both token addresses.");
// // //       return;
// // //     }

// // //     const connection = new Connection("https://api.devnet.solana.com", "confirmed");
// // //     const wallet = window.solana;

// // //     if (!wallet || !wallet.publicKey) {
// // //       setStatus("❌ Phantom wallet not connected.");
// // //       return;
// // //     }

// // //     const walletPublicKey = new PublicKey(wallet.publicKey.toBase58());
// // //     const walletAdapter = {
// // //       publicKey: walletPublicKey,
// // //       signTransaction: wallet.signTransaction,
// // //       signAllTransactions: wallet.signAllTransactions,
// // //     };

// // //     const programId = ORCA_WHIRLPOOL_PROGRAM_ID;
// // //     const ctx = WhirlpoolContext.from(connection, walletAdapter, programId);
// // //     const client = buildWhirlpoolClient(ctx);
// // //     const poolInfo = await findPoolIdForPair(tokenA, tokenB);

// // //     if (!poolInfo || !poolInfo.poolId) {
// // //       setStatus("❌ No existing Orca pool found for this token pair.");
// // //       return;
// // //     }

// // //     setStatus("✅ Pool found. Fetching position data...");

// // //     try {
// // //       const poolPubkey = new PublicKey(poolInfo.poolId);
// // //       const whirlpool = await client.getPool(poolPubkey);

// // //       if (!whirlpool) {
// // //         throw new Error("Failed to fetch whirlpool");
// // //       }

// // //       // 🔥 Derive Position PDA from NFT Mint Address
// // //       const positionNFTMint = new PublicKey("FwsHrUExzMeeMSraKsxGiWghnWoeiqPgN3jvzyXQhtWw");
// // //       const positionPDA = PDAUtil.getPosition(programId, positionNFTMint).publicKey;

// // //       console.log(`Derived Position PDA: ${positionPDA.toBase58()}`);

// // //       // Fetch Position Account Data
// // //       const position = await client.getPosition(positionPDA);
// // //       const posData = position.getData();

// // //       const tickLower = posData.tickLowerIndex;
// // //       const tickUpper = posData.tickUpperIndex;

// // //       console.log(`Using existing position range => tickLower: ${tickLower}, tickUpper: ${tickUpper}`);
// // //       setStatus(`Adding liquidity to existing position...`);

// // //       // ✅ Increase Liquidity (This sends the TX directly)
// // //       const signature = await position.increaseLiquidity(amountA, amountB);

// // //       setStatus(`✅ Liquidity added successfully!`);
// // //       setExplorerUrl(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);

// // //     } catch (e) {
// // //       console.error('Add Liquidity Error:', e);
// // //       setStatus(`❌ Error: ${e.message}`);
// // //     }
// // //   };

// // //   return (
// // //     <div>
// // //       <h2>Add Liquidity</h2>

// // //       <label>Token A Address:</label>
// // //       <input
// // //         type="text"
// // //         value={tokenA}
// // //         onChange={(e) => setTokenA(e.target.value)}
// // //         placeholder="Token A Mint Address"
// // //       />
// // //       <br />

// // //       <label>Token B Address:</label>
// // //       <input
// // //         type="text"
// // //         value={tokenB}
// // //         onChange={(e) => setTokenB(e.target.value)}
// // //         placeholder="Token B Mint Address"
// // //       />
// // //       <br />

// // //       <label>Amount Token A:</label>
// // //       <input
// // //         type="number"
// // //         value={amountA}
// // //         onChange={(e) => setAmountA(Number(e.target.value))}
// // //       />
// // //       <br />

// // //       <label>Amount Token B:</label>
// // //       <input
// // //         type="number"
// // //         value={amountB}
// // //         onChange={(e) => setAmountB(Number(e.target.value))}
// // //       />
// // //       <br />

// // //       <button onClick={addLiquidity}>Add Liquidity</button>
// // //       <p>{status}</p>

// // //       {explorerUrl && (
// // //         <p>
// // //           🔗 <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
// // //             View on Solana Explorer
// // //           </a>
// // //         </p>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default AddLiquidityForm;



// // import React, { useState } from "react";
// // import { findPoolIdForPair } from "./utils/orcaPoolHelper";
// // import { Connection, PublicKey, Transaction } from "@solana/web3.js";
// // import {
// //   WhirlpoolContext,
// //   buildWhirlpoolClient,
// //   ORCA_WHIRLPOOL_PROGRAM_ID,
// //   PDAUtil,
// //   increaseLiquidityQuoteByInput,
// //   IncreaseLiquidityInput,
// //   WhirlpoolIx,
// // } from "@orca-so/whirlpools-sdk";

// // function AddLiquidityForm() {
// //   const [amountA, setAmountA] = useState(1);
// //   const [amountB, setAmountB] = useState(1);
// //   const [status, setStatus] = useState("");
// //   const [tokenA, setTokenA] = useState("");
// //   const [tokenB, setTokenB] = useState("");
// //   const [explorerUrl, setExplorerUrl] = useState("");

// //   const addLiquidity = async () => {
// //     setStatus("Looking for pool...");
// //     setExplorerUrl("");

// //     if (!tokenA || !tokenB) {
// //       setStatus("❌ Please enter both token addresses.");
// //       return;
// //     }

// //     const connection = new Connection("https://api.devnet.solana.com", "confirmed");
// //     const wallet = window.solana;

// //     if (!wallet || !wallet.publicKey) {
// //       setStatus("❌ Phantom wallet not connected.");
// //       return;
// //     }

// //     const walletPublicKey = new PublicKey(wallet.publicKey.toBase58());
// //     const walletAdapter = {
// //       publicKey: walletPublicKey,
// //       signTransaction: wallet.signTransaction,
// //       signAllTransactions: wallet.signAllTransactions,
// //     };

// //     const programId = ORCA_WHIRLPOOL_PROGRAM_ID;
// //     const ctx = WhirlpoolContext.from(connection, walletAdapter, programId);
// //     const client = buildWhirlpoolClient(ctx);
// //     const poolInfo = await findPoolIdForPair(tokenA, tokenB);

// //     if (!poolInfo || !poolInfo.poolId) {
// //       setStatus("❌ No existing Orca pool found for this token pair.");
// //       return;
// //     }

// //     setStatus("✅ Pool found. Fetching position data...");

// //     try {
// //       const poolPubkey = new PublicKey(poolInfo.poolId);
// //       const whirlpool = await client.getPool(poolPubkey);

// //       if (!whirlpool) {
// //         throw new Error("Failed to fetch whirlpool");
// //       }

// //       const positionNFTMint = new PublicKey("FwsHrUExzMeeMSraKsxGiWghnWoeiqPgN3jvzyXQhtWw");
// //       const positionPDA = PDAUtil.getPosition(programId, positionNFTMint).publicKey;

// //       console.log(`Derived Position PDA: ${positionPDA.toBase58()}`);

// //       const position = await client.getPosition(positionPDA);
// //       const posData = position.getData();

// //       const tickLower = posData.tickLowerIndex;
// //       const tickUpper = posData.tickUpperIndex;

// //       console.log(`Using tickLower: ${tickLower}, tickUpper: ${tickUpper}`);
// //       setStatus(`Preparing IncreaseLiquidity instruction...`);

// //       // Prepare Liquidity Quote
// //       const quote = increaseLiquidityQuoteByInput({
// //         tokenMaxA: amountA * 10 ** 9, // WSOL decimals (adjust if needed)
// //         tokenMaxB: amountB * 10 ** 6, // Your token decimals (adjust if needed)
// //         slippageTolerance: { numerator: 1, denominator: 100 }, // 1% slippage
// //       }, whirlpool.getData());

// //       // Construct IncreaseLiquidity Instruction
// //       const increaseLiquidityIx = WhirlpoolIx.increaseLiquidityIx(ctx.program, {
// //         ...quote,
// //         position: position.getAddress(),
// //         positionTokenAccount: await position.getTokenAccount(),
// //         whirlpool: whirlpool.getAddress(),
// //         tokenOwnerAccountA: await whirlpool.getTokenAAccount(),
// //         tokenOwnerAccountB: await whirlpool.getTokenBAccount(),
// //         tokenVaultA: whirlpool.getData().tokenVaultA,
// //         tokenVaultB: whirlpool.getData().tokenVaultB,
// //         tickArrayLower: await whirlpool.getTickArray(tickLower),
// //         tickArrayUpper: await whirlpool.getTickArray(tickUpper),
// //         tokenProgram: ctx.program.programId,
// //       });

// //       // Build & Send Transaction
// //       const tx = new Transaction().add(increaseLiquidityIx);
// //       const signedTx = await wallet.signTransaction(tx);
// //       const signature = await connection.sendRawTransaction(signedTx.serialize());
// //       await connection.confirmTransaction(signature, "confirmed");

// //       setStatus(`✅ Liquidity added successfully!`);
// //       setExplorerUrl(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);

// //     } catch (e) {
// //       console.error('Add Liquidity Error:', e);
// //       setStatus(`❌ Error: ${e.message}`);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Add Liquidity</h2>

// //       <label>Token A Address:</label>
// //       <input
// //         type="text"
// //         value={tokenA}
// //         onChange={(e) => setTokenA(e.target.value)}
// //         placeholder="Token A Mint Address"
// //       />
// //       <br />

// //       <label>Token B Address:</label>
// //       <input
// //         type="text"
// //         value={tokenB}
// //         onChange={(e) => setTokenB(e.target.value)}
// //         placeholder="Token B Mint Address"
// //       />
// //       <br />

// //       <label>Amount Token A:</label>
// //       <input
// //         type="number"
// //         value={amountA}
// //         onChange={(e) => setAmountA(Number(e.target.value))}
// //       />
// //       <br />

// //       <label>Amount Token B:</label>
// //       <input
// //         type="number"
// //         value={amountB}
// //         onChange={(e) => setAmountB(Number(e.target.value))}
// //       />
// //       <br />

// //       <button onClick={addLiquidity}>Add Liquidity</button>
// //       <p>{status}</p>

// //       {explorerUrl && (
// //         <p>
// //           🔗 <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
// //             View on Solana Explorer
// //           </a>
// //         </p>
// //       )}
// //     </div>
// //   );
// // }

// // export default AddLiquidityForm;


// import React, { useState } from "react";
// import { findPoolIdForPair } from "./utils/orcaPoolHelper";
// import { Connection, PublicKey, Transaction } from "@solana/web3.js";
// import {
//   WhirlpoolContext,
//   buildWhirlpoolClient,
//   ORCA_WHIRLPOOL_PROGRAM_ID,
//   PDAUtil,
//   WhirlpoolIx,
// } from "@orca-so/whirlpools-sdk";
// import BN from "bn.js";

// function AddLiquidityForm() {
//   const [amountA, setAmountA] = useState(1);
//   const [amountB, setAmountB] = useState(1);
//   const [status, setStatus] = useState("");
//   const [tokenA, setTokenA] = useState("");
//   const [tokenB, setTokenB] = useState("");
//   const [explorerUrl, setExplorerUrl] = useState("");

//   const addLiquidity = async () => {
//     setStatus("Looking for pool...");
//     setExplorerUrl("");

//     if (!tokenA || !tokenB) {
//       setStatus("❌ Please enter both token addresses.");
//       return;
//     }

//     const connection = new Connection("https://api.devnet.solana.com", "confirmed");
//     const wallet = window.solana;

//     if (!wallet || !wallet.publicKey) {
//       setStatus("❌ Phantom wallet not connected.");
//       return;
//     }

//     const walletPublicKey = new PublicKey(wallet.publicKey.toBase58());
//     const walletAdapter = {
//       publicKey: walletPublicKey,
//       signTransaction: wallet.signTransaction,
//       signAllTransactions: wallet.signAllTransactions,
//     };

//     const programId = ORCA_WHIRLPOOL_PROGRAM_ID;
//     const ctx = WhirlpoolContext.from(connection, walletAdapter, programId);
//     const client = buildWhirlpoolClient(ctx);
//     const poolInfo = await findPoolIdForPair(tokenA, tokenB);

//     if (!poolInfo || !poolInfo.poolId) {
//       setStatus("❌ No existing Orca pool found for this token pair.");
//       return;
//     }

//     setStatus("✅ Pool found. Fetching position data...");

//     try {
//       const poolPubkey = new PublicKey(poolInfo.poolId);
//       const whirlpool = await client.getPool(poolPubkey);

//       if (!whirlpool) {
//         throw new Error("Failed to fetch whirlpool");
//       }

//       const positionNFTMint = new PublicKey("FwsHrUExzMeeMSraKsxGiWghnWoeiqPgN3jvzyXQhtWw");
//       const positionPDA = PDAUtil.getPosition(programId, positionNFTMint).publicKey;

//       console.log(`Derived Position PDA: ${positionPDA.toBase58()}`);

//       const position = await client.getPosition(positionPDA);
//       const posData = position.getData();

//       const tickLower = posData.tickLowerIndex;
//       const tickUpper = posData.tickUpperIndex;

//       console.log(`Using tickLower: ${tickLower}, tickUpper: ${tickUpper}`);
//       setStatus(`Preparing IncreaseLiquidity instruction...`);

//       // Compute Increase Liquidity Quote
//       const quote = await whirlpool.getIncreaseLiquidityQuote({
//         tokenMaxA: new BN(amountA * 10 ** 9), // WSOL decimals
//         tokenMaxB: new BN(amountB * 10 ** 6), // Your Token decimals
//         slippageTolerance: { numerator: 1, denominator: 100 }, // 1% slippage
//       });

//       // Build Increase Liquidity Instruction
//       const increaseLiquidityIx = WhirlpoolIx.increaseLiquidityIx(ctx.program, {
//         liquidityAmount: quote.liquidityAmount,
//         tokenMaxA: quote.tokenMaxA,
//         tokenMaxB: quote.tokenMaxB,
//         position: position.getAddress(),
//         positionTokenAccount: await position.getTokenAccount(),
//         whirlpool: whirlpool.getAddress(),
//         tokenOwnerAccountA: await whirlpool.getTokenAAccount(),
//         tokenOwnerAccountB: await whirlpool.getTokenBAccount(),
//         tokenVaultA: whirlpool.getData().tokenVaultA,
//         tokenVaultB: whirlpool.getData().tokenVaultB,
//         tickArrayLower: await whirlpool.getTickArray(tickLower),
//         tickArrayUpper: await whirlpool.getTickArray(tickUpper),
//         tokenProgram: ctx.tokenProgramId,
//       });

//       // Build and Send Transaction
//       const tx = new Transaction().add(increaseLiquidityIx);
//       const signedTx = await wallet.signTransaction(tx);
//       const signature = await connection.sendRawTransaction(signedTx.serialize());
//       await connection.confirmTransaction(signature, "confirmed");

//       setStatus(`✅ Liquidity added successfully!`);
//       setExplorerUrl(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);

//     } catch (e) {
//       console.error('Add Liquidity Error:', e);
//       setStatus(`❌ Error: ${e.message}`);
//     }
//   };

//   return (
//     <div>
//       <h2>Add Liquidity</h2>

//       <label>Token A Address:</label>
//       <input
//         type="text"
//         value={tokenA}
//         onChange={(e) => setTokenA(e.target.value)}
//         placeholder="Token A Mint Address"
//       />
//       <br />

//       <label>Token B Address:</label>
//       <input
//         type="text"
//         value={tokenB}
//         onChange={(e) => setTokenB(e.target.value)}
//         placeholder="Token B Mint Address"
//       />
//       <br />

//       <label>Amount Token A:</label>
//       <input
//         type="number"
//         value={amountA}
//         onChange={(e) => setAmountA(Number(e.target.value))}
//       />
//       <br />

//       <label>Amount Token B:</label>
//       <input
//         type="number"
//         value={amountB}
//         onChange={(e) => setAmountB(Number(e.target.value))}
//       />
//       <br />

//       <button onClick={addLiquidity}>Add Liquidity</button>
//       <p>{status}</p>

//       {explorerUrl && (
//         <p>
//           🔗 <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
//             View on Solana Explorer
//           </a>
//         </p>
//       )}
//     </div>
//   );
// }

// export default AddLiquidityForm;
import React, { useState } from "react";
import { findPoolIdForPair } from "./utils/orcaPoolHelper";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  WhirlpoolContext,
  buildWhirlpoolClient,
  ORCA_WHIRLPOOL_PROGRAM_ID,
  PDAUtil,
  WhirlpoolIx,
  increaseLiquidityQuoteByInputTokenWithParamsUsingPriceSlippage
} from "@orca-so/whirlpools-sdk";
import { useWallet } from './WalletConnect';
import BN from "bn.js";

function AddLiquidityForm() {
  const { wallet, publicKey, isConnected } = useWallet();
  const [amountA, setAmountA] = useState(1);
  const [amountB, setAmountB] = useState(1);
  const [status, setStatus] = useState("");
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [explorerUrl, setExplorerUrl] = useState("");

  const addLiquidity = async () => {
    setStatus("Looking for pool...");
    setExplorerUrl("");

    if (!tokenA || !tokenB) {
      setStatus("❌ Please enter both token addresses.");
      return;
    }

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    if (!isConnected || !wallet || !publicKey) {
      setStatus("❌ Phantom wallet not connected.");
      return;
    }

    const walletPublicKey = new PublicKey(publicKey.toBase58());
    const walletAdapter = {
      publicKey: walletPublicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
    };

    const programId = ORCA_WHIRLPOOL_PROGRAM_ID;
    const ctx = WhirlpoolContext.from(connection, walletAdapter, programId);
    const client = buildWhirlpoolClient(ctx);
    const poolInfo = await findPoolIdForPair(tokenA, tokenB);

    if (!poolInfo || !poolInfo.poolId) {
      setStatus("❌ No existing Orca pool found for this token pair.");
      return;
    }

    setStatus("✅ Pool found. Fetching position data...");

    try {
      const poolPubkey = new PublicKey(poolInfo.poolId);
      const whirlpool = await client.getPool(poolPubkey);

      if (!whirlpool) {
        throw new Error("Failed to fetch whirlpool");
      }

      const positionNFTMint = new PublicKey("FwsHrUExzMeeMSraKsxGiWghnWoeiqPgN3jvzyXQhtWw");
      const positionPDA = PDAUtil.getPosition(programId, positionNFTMint).publicKey;

      console.log(`Derived Position PDA: ${positionPDA.toBase58()}`);

      const position = await client.getPosition(positionPDA);
      const posData = position.getData();

      const tickLower = posData.tickLowerIndex;
      const tickUpper = posData.tickUpperIndex;

      console.log(`Using tickLower: ${tickLower}, tickUpper: ${tickUpper}`);
      setStatus(`Preparing IncreaseLiquidity instruction...`);

      // Compute Quote using Legacy SDK Method
      const quote = increaseLiquidityQuoteByInputTokenWithParamsUsingPriceSlippage(
        whirlpool.getData(),
        new BN(amountA * 10 ** 9), // WSOL decimals
        new BN(amountB * 10 ** 6), // Your Token decimals
        { numerator: 1, denominator: 100 } // 1% slippage
      );

      // Build Increase Liquidity Instruction
      const increaseLiquidityIx = WhirlpoolIx.increaseLiquidityIx(ctx.program, {
        liquidityAmount: quote.liquidityAmount,
        tokenMaxA: quote.tokenMaxA,
        tokenMaxB: quote.tokenMaxB,
        position: position.getAddress(),
        positionTokenAccount: await position.getTokenAccount(),
        whirlpool: whirlpool.getAddress(),
        tokenOwnerAccountA: await whirlpool.getTokenAAccount(),
        tokenOwnerAccountB: await whirlpool.getTokenBAccount(),
        tokenVaultA: whirlpool.getData().tokenVaultA,
        tokenVaultB: whirlpool.getData().tokenVaultB,
        tickArrayLower: await whirlpool.getTickArray(tickLower),
        tickArrayUpper: await whirlpool.getTickArray(tickUpper),
        tokenProgram: ctx.tokenProgramId,
      });

      // Build & Send Transaction
      const tx = new Transaction().add(increaseLiquidityIx);
      const signedTx = await wallet.signTransaction(tx);
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(signature, "confirmed");

      setStatus(`✅ Liquidity added successfully!`);
      setExplorerUrl(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);

    } catch (e) {
      console.error('Add Liquidity Error:', e);
      setStatus(`❌ Error: ${e.message}`);
    }
  };

  return (
    <div>
      <h2>Add Liquidity</h2>

      <label>Token A Address:</label>
      <input
        type="text"
        value={tokenA}
        onChange={(e) => setTokenA(e.target.value)}
        placeholder="Token A Mint Address"
      />
      <br />

      <label>Token B Address:</label>
      <input
        type="text"
        value={tokenB}
        onChange={(e) => setTokenB(e.target.value)}
        placeholder="Token B Mint Address"
      />
      <br />

      <label>Amount Token A:</label>
      <input
        type="number"
        value={amountA}
        onChange={(e) => setAmountA(Number(e.target.value))}
      />
      <br />

      <label>Amount Token B:</label>
      <input
        type="number"
        value={amountB}
        onChange={(e) => setAmountB(Number(e.target.value))}
      />
      <br />

      <button onClick={addLiquidity}>Add Liquidity</button>
      <p>{status}</p>

      {explorerUrl && (
        <p>
          🔗 <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
            View on Solana Explorer
          </a>
        </p>
      )}
    </div>
  );
}

export default AddLiquidityForm;
