// Helper function for finding Orca pool IDs - no imports needed

// Try different devnet endpoints - Orca might not have a public devnet API
const ORCA_POOLS_URL = "https://api.orca.so/v1/whirlpool/list";

export async function findPoolIdForPair(tokenA, tokenB) {
  try {
    // Validate input parameters
    if (!tokenA || !tokenB || typeof tokenA !== 'string' || typeof tokenB !== 'string') {
      console.error("Invalid token addresses provided:", { tokenA, tokenB });
      return null;
    }

    console.log("Searching for pool with tokens:", { tokenA, tokenB });

    // For devnet testing, we'll use a hardcoded pool ID for your specific tokens
    // This is a workaround since Orca's devnet API might not be publicly accessible
    
            // New pool: WSOL + Your Token (custom range: 0.0090033 to 0.0110494)
        if (tokenA === "So11111111111111111111111111111111111111112" &&
            tokenB === "8VwDA3MZY9hMRFv4cQ6a5Q3HNcLzPGxZBa2w2tncL2gJ") {
          console.log("Found hardcoded pool for WSOL + Your Token (custom range pool)");
          return {
            poolId: "GfFKcU6hj98XgUWYmc8gHoFrHQ4ZRBpiUCfgtsPDuZ8R", // New custom range pool
            tokenA: tokenA,
            tokenB: tokenB,
            tickSpacing: 64, // Custom range pools typically have smaller tick spacing
            minPrice: 0.0090033,
            maxPrice: 0.0110494
          };
        }
        
        // Also support the reverse order
        if (tokenA === "8VwDA3MZY9hMRFv4cQ6a5Q3HNcLzPGxZBa2w2tncL2gJ" &&
            tokenB === "So11111111111111111111111111111111111111112") {
          console.log("Found hardcoded pool for Your Token + WSOL (custom range pool)");
          return {
            poolId: "GfFKcU6hj98XgUWYmc8gHoFrHQ4ZRBpiUCfgtsPDuZ8R", // New custom range pool
            tokenA: tokenB, // Swap to maintain order
            tokenB: tokenA,
            tickSpacing: 64, // Custom range pools typically have smaller tick spacing
            minPrice: 0.0090033,
            maxPrice: 0.0110494
          };
        }
    
    // Keep the old pool as fallback (in case you want to test it later)
    if (tokenA === "8VwDA3MZY9hMRFv4cQ6a5Q3HNcLzPGxZBa2w2tncL2gJ" && 
        tokenB === "CqJMuuhYPpqWiYbRBvYLmiYtqf3qSoh5ZTpd9stquZtb") {
      console.log("Found hardcoded pool for your old devnet tokens");
      return {
        poolId: "Br61K4c5NHqJaZTrT1pZryFLoQAVJ7daNosHEpEVt6BG", // Old pool ID from Orca creation
        tokenA: tokenA,
        tokenB: tokenB,
        tickSpacing: 64, // Default tick spacing for splash pools
      };
    }

    // Try to fetch from API as fallback
    console.log("Attempting to fetch from Orca API...");
    const response = await fetch(ORCA_POOLS_URL);
    if (!response.ok) {
      console.warn(`Orca API returned ${response.status} - using fallback for devnet`);
      return null;
    }
    
    const data = await response.json();
    const pools = data.whirlpools;

    if (!Array.isArray(pools)) {
      console.error("Invalid pools data received from API");
      return null;
    }

    const matchedPool = pools.find((pool) => {
      if (!pool || !pool.tokenMintA || !pool.tokenMintB || !pool.address) {
        return false;
      }
      const mints = [pool.tokenMintA, pool.tokenMintB];
      return (
        mints.includes(tokenA) &&
        mints.includes(tokenB)
      );
    });

    if (matchedPool && matchedPool.address) {
      console.log("Found pool via API:", matchedPool.address);
      return {
        poolId: matchedPool.address,
        tokenA: matchedPool.tokenMintA,
        tokenB: matchedPool.tokenMintB,
        tickSpacing: matchedPool.tickSpacing,
      };
    } else {
      console.log("No pool found via API");
      return null;
    }
  } catch (err) {
    console.error("Failed to fetch Orca pools:", err);
    return null;
  }
}
