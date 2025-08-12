import React, { useState } from "react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  WhirlpoolContext,
  buildWhirlpoolClient,
  ORCA_WHIRLPOOL_PROGRAM_ID,
  PDAUtil,
  WhirlpoolIx,
  increaseLiquidityQuoteByInputTokenWithParamsUsingPriceSlippage,
} from "@orca-so/whirlpools-sdk";
import BN from "bn.js";
import { useWallet } from "./WalletConnect";

// ✅ New imports for official pool discovery
import { fetchWhirlpoolsByTokenPair, setWhirlpoolsConfig } from "@orca-so/whirlpools";
import { createSolanaRpc, devnet, address } from "@solana/kit";

function AddLiquidityForm() {
  const { wallet, publicKey, isConnected } = useWallet();
  const [amountA, setAmountA] = useState(1);
  const [amountB, setAmountB] = useState(1);
  const [status, setStatus] = useState("");
  const [tokenA, setTokenA] = useState(""); // mint address string
  const [tokenB, setTokenB] = useState(""); // mint address string
  const [explorerUrl, setExplorerUrl] = useState("");

  // Helper: discover a whirlpool by token pair (tries A/B then B/A)
  const findPoolWithWhirlpoolsKit = async (mintA, mintB) => {
    await setWhirlpoolsConfig("solanaDevnet"); // devnet preset
    const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));

    const a = address(mintA);
    const b = address(mintB);

    // try A/B
    let infos = await fetchWhirlpoolsByTokenPair(rpc, a, b);
    let initialized = infos.filter((i) => i.initialized);
    if (initialized.length > 0) return initialized[0];

    // try B/A if needed
    infos = await fetchWhirlpoolsByTokenPair(rpc, b, a);
    initialized = infos.filter((i) => i.initialized);
    if (initialized.length > 0) return initialized[0];

    return null;
  };

  const addLiquidity = async () => {
    setStatus("Looking for pool...");
    setExplorerUrl("");

    if (!tokenA || !tokenB) {
      setStatus("❌ Please enter both token mint addresses.");
      return;
    }

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    if (!isConnected || !wallet || !publicKey) {
      setStatus("❌ Phantom wallet not connected.");
      return;
    }

    try {
      // 1) Discover pool
      const poolInfo = await findPoolWithWhirlpoolsKit(tokenA.trim(), tokenB.trim());
      if (!poolInfo || !poolInfo.initialized || !poolInfo.address) {
        setStatus("❌ No initialized Orca Whirlpool found for this pair on devnet.");
        return;
      }

      setStatus("✅ Pool found. Fetching position data…");

      // 2) SDK context + client
      const walletPublicKey = new PublicKey(publicKey.toBase58());
      const walletAdapter = {
        publicKey: walletPublicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions,
      };

      const programId = ORCA_WHIRLPOOL_PROGRAM_ID;
      const ctx = WhirlpoolContext.from(connection, walletAdapter, programId);
      const client = buildWhirlpoolClient(ctx);

      const poolPubkey = new PublicKey(poolInfo.address.toString());
      const whirlpool = await client.getPool(poolPubkey);
      if (!whirlpool) throw new Error("Failed to fetch whirlpool");

      // 3) Use existing position NFT (your current approach)
      //    NOTE: ensure this NFT exists & belongs to the same pool.
      const positionNFTMint = new PublicKey("FwsHrUExzMeeMSraKsxGiWghnWoeiqPgN3jvzyXQhtWw");
      const positionPDA = PDAUtil.getPosition(programId, positionNFTMint).publicKey;
      console.log(`Derived Position PDA: ${positionPDA.toBase58()}`);

      const position = await client.getPosition(positionPDA);
      const posData = position.getData();
      const tickLower = posData.tickLowerIndex;
      const tickUpper = posData.tickUpperIndex;

      console.log(`Using tickLower: ${tickLower}, tickUpper: ${tickUpper}`);
      setStatus("Preparing IncreaseLiquidity instruction…");

      // 4) Get decimals from pool tokens (avoid hard-coding)
      const tokenAInfo = whirlpool.getTokenAInfo();
      const tokenBInfo = whirlpool.getTokenBInfo();
      const decimalsA = tokenAInfo.decimals;
      const decimalsB = tokenBInfo.decimals;

      // Convert user input to on-chain units safely using BN
      const toBaseUnits = (amt, decimals) => {
        // support integers & 0/decimal inputs from simple <input type="number">
        const parts = String(amt).split(".");
        const whole = parts[0] || "0";
        const frac = (parts[1] || "").padEnd(decimals, "0").slice(0, decimals);
        return new BN(whole + frac);
      };

      const inputA = toBaseUnits(amountA, decimalsA);
      const inputB = toBaseUnits(amountB, decimalsB);

      // 5) Build quote
      const quote = increaseLiquidityQuoteByInputTokenWithParamsUsingPriceSlippage(
        whirlpool.getData(),
        inputA,
        inputB,
        { numerator: 1, denominator: 100 } // 1% slippage
      );

      // 6) Accounts
      const positionTokenAccount = await position.getTokenAccount();
      const tokenOwnerAccountA = await whirlpool.getTokenAAccount();
      const tokenOwnerAccountB = await whirlpool.getTokenBAccount();
      const tickArrayLowerPubkey = await whirlpool.getTickArray(tickLower);
      const tickArrayUpperPubkey = await whirlpool.getTickArray(tickUpper);

      // 7) Instruction
      const increaseLiquidityIx = WhirlpoolIx.increaseLiquidityIx(ctx.program, {
        liquidityAmount: quote.liquidityAmount,
        tokenMaxA: quote.tokenMaxA,
        tokenMaxB: quote.tokenMaxB,
        position: position.getAddress(),
        positionTokenAccount,
        whirlpool: whirlpool.getAddress(),
        tokenOwnerAccountA,
        tokenOwnerAccountB,
        tokenVaultA: whirlpool.getData().tokenVaultA,
        tokenVaultB: whirlpool.getData().tokenVaultB,
        tickArrayLower: tickArrayLowerPubkey,
        tickArrayUpper: tickArrayUpperPubkey,
        tokenProgram: ctx.tokenProgramId,
      });

      // 8) Tx build & send
      const tx = new Transaction().add(increaseLiquidityIx);
      tx.feePayer = walletPublicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash("finalized")).blockhash;

      const signedTx = await wallet.signTransaction(tx);
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(signature, "confirmed");

      setStatus("✅ Liquidity added successfully!");
      setExplorerUrl(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (e) {
      console.error("Add Liquidity Error:", e);
      setStatus(`❌ Error: ${e.message || String(e)}`);
    }
  };

  return (
    <div>
      <h2>Add Liquidity</h2>

      <label>Token A Mint:</label>
      <input
        type="text"
        value={tokenA}
        onChange={(e) => setTokenA(e.target.value)}
        placeholder="Token A Mint Address"
      />
      <br />

      <label>Token B Mint:</label>
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
        min="0"
        step="any"
        value={amountA}
        onChange={(e) => setAmountA(e.target.value)}
      />
      <br />

      <label>Amount Token B:</label>
      <input
        type="number"
        min="0"
        step="any"
        value={amountB}
        onChange={(e) => setAmountB(e.target.value)}
      />
      <br />

      <button onClick={addLiquidity}>Add Liquidity</button>
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

export default AddLiquidityForm;
