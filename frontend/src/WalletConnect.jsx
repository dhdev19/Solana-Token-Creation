// // import React, { useState, useEffect, createContext, useContext } from 'react';

// // // Create a context for wallet state
// // const WalletContext = createContext();

// // // Custom hook to use wallet context
// // export const useWallet = () => {
// //   const context = useContext(WalletContext);
// //   if (!context) {
// //     throw new Error('useWallet must be used within a WalletProvider');
// //   }
// //   return context;
// // };

// // // Wallet Provider Component
// // export const WalletProvider = ({ children }) => {
// //   const [wallet, setWallet] = useState(null);
// //   const [publicKey, setPublicKey] = useState(null);
// //   const [isConnected, setIsConnected] = useState(false);
// //   const [isConnecting, setIsConnecting] = useState(false);
// //   const [connectionError, setConnectionError] = useState(null);
// //   const [balance, setBalance] = useState(null);

// //   // Auto-connect function
// //   const autoConnect = async () => {
// //     if (typeof window !== 'undefined' && window.solana) {
// //       try {
// //         setIsConnecting(true);
// //         setConnectionError(null);
        
// //         // Check if already connected
// //         if (window.solana.isConnected) {
// //           setWallet(window.solana);
// //           setPublicKey(window.solana.publicKey);
// //           setIsConnected(true);
// //           console.log('✅ Auto-connected to existing wallet session');
// //           return;
// //         }

// //         // Try to connect
// //         const response = await window.solana.connect();
// //         setWallet(window.solana);
// //         setPublicKey(response.publicKey);
// //         setIsConnected(true);
// //         console.log('✅ Auto-connected to Phantom wallet');
        
// //       } catch (error) {
// //         console.error('❌ Auto-connect failed:', error);
// //         setConnectionError(error.message);
// //         setIsConnected(false);
// //       } finally {
// //         setIsConnecting(false);
// //       }
// //     } else {
// //       setConnectionError('Phantom wallet not found. Please install Phantom wallet extension.');
// //     }
// //   };

// //   // Manual connect function
// //   const connect = async () => {
// //     if (typeof window !== 'undefined' && window.solana) {
// //       try {
// //         setIsConnecting(true);
// //         setConnectionError(null);
        
// //         const response = await window.solana.connect();
// //         setWallet(window.solana);
// //         setPublicKey(response.publicKey);
// //         setIsConnected(true);
// //         console.log('✅ Manually connected to Phantom wallet');
        
// //       } catch (error) {
// //         console.error('❌ Manual connect failed:', error);
// //         setConnectionError(error.message);
// //         setIsConnected(false);
// //       } finally {
// //         setIsConnecting(false);
// //       }
// //     } else {
// //       setConnectionError('Phantom wallet not found. Please install Phantom wallet extension.');
// //     }
// //   };

// //   // Disconnect function
// //   const disconnect = async () => {
// //     if (wallet) {
// //       try {
// //         await wallet.disconnect();
// //         setWallet(null);
// //         setPublicKey(null);
// //         setIsConnected(false);
// //         setBalance(null);
// //         console.log('✅ Disconnected from Phantom wallet');
// //       } catch (error) {
// //         console.error('❌ Disconnect failed:', error);
// //       }
// //     }
// //   };

// //   // Fetch balance function
// //   const fetchBalance = async () => {
// //     if (publicKey && isConnected) {
// //       try {
// //         const { Connection } = await import('@solana/web3.js');
// //         const connection = new Connection('https://api.devnet.solana.com');
// //         const balance = await connection.getBalance(publicKey);
// //         setBalance(balance / 1e9); // Convert lamports to SOL
// //         return balance / 1e9;
// //       } catch (error) {
// //         console.error('❌ Failed to fetch balance:', error);
// //         return null;
// //       }
// //     }
// //     return null;
// //   };

// //   // Set up wallet event listeners
// //   useEffect(() => {
// //     if (typeof window !== 'undefined' && window.solana) {
// //       const handleConnect = () => {
// //         setWallet(window.solana);
// //         setPublicKey(window.solana.publicKey);
// //         setIsConnected(true);
// //         setConnectionError(null);
// //         console.log('✅ Wallet connected via event');
// //       };

// //       const handleDisconnect = () => {
// //         setWallet(null);
// //         setPublicKey(null);
// //         setIsConnected(false);
// //         setBalance(null);
// //         console.log('✅ Wallet disconnected via event');
// //       };

// //       const handleAccountChanged = (publicKey) => {
// //         if (publicKey) {
// //           setPublicKey(publicKey);
// //           console.log('✅ Wallet account changed');
// //         } else {
// //           setPublicKey(null);
// //           setIsConnected(false);
// //           console.log('✅ Wallet account disconnected');
// //         }
// //       };

// //       // Add event listeners
// //       window.solana.on('connect', handleConnect);
// //       window.solana.on('disconnect', handleDisconnect);
// //       window.solana.on('accountChanged', handleAccountChanged);

// //       // Auto-connect on mount
// //       autoConnect();

// //       // Cleanup event listeners
// //       return () => {
// //         window.solana.removeListener('connect', handleConnect);
// //         window.solana.removeListener('disconnect', handleDisconnect);
// //         window.solana.removeListener('accountChanged', handleAccountChanged);
// //       };
// //     }
// //   }, []);

// //   // Fetch balance when connected
// //   useEffect(() => {
// //     if (isConnected && publicKey) {
// //       fetchBalance();
// //       // Set up periodic balance updates
// //       const interval = setInterval(fetchBalance, 30000); // Update every 30 seconds
// //       return () => clearInterval(interval);
// //     }
// //   }, [isConnected, publicKey]);

// //   const value = {
// //     wallet,
// //     publicKey,
// //     isConnected,
// //     isConnecting,
// //     connectionError,
// //     balance,
// //     connect,
// //     disconnect,
// //     autoConnect,
// //     fetchBalance
// //   };

// //   return (
// //     <WalletContext.Provider value={value}>
// //       {children}
// //     </WalletContext.Provider>
// //   );
// // };

// // // Wallet Connect Component
// // const WalletConnect = () => {
// //   const {
// //     publicKey,
// //     isConnected,
// //     isConnecting,
// //     connectionError,
// //     balance,
// //     connect,
// //     disconnect,
// //     fetchBalance
// //   } = useWallet();

// //   return (
// //     <div style={{
// //       padding: '15px',
// //       backgroundColor: '#f8f9fa',
// //       borderRadius: '8px',
// //       marginBottom: '20px',
// //       border: '1px solid #dee2e6'
// //     }}>
// //       <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
// //         🔗 Wallet Connection
// //       </h3>
      
// //       {connectionError && (
// //         <div style={{
// //           backgroundColor: '#f8d7da',
// //           color: '#721c24',
// //           padding: '10px',
// //           borderRadius: '4px',
// //           marginBottom: '10px',
// //           fontSize: '14px'
// //         }}>
// //           ⚠️ {connectionError}
// //         </div>
// //       )}

// //       <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
// //         {!isConnected ? (
// //           <button
// //             onClick={connect}
// //             disabled={isConnecting}
// //             style={{
// //               backgroundColor: '#007bff',
// //               color: 'white',
// //               border: 'none',
// //               padding: '10px 20px',
// //               borderRadius: '5px',
// //               cursor: isConnecting ? 'not-allowed' : 'pointer',
// //               opacity: isConnecting ? 0.6 : 1
// //             }}
// //           >
// //             {isConnecting ? '🔄 Connecting...' : '🔗 Connect Phantom Wallet'}
// //           </button>
// //         ) : (
// //           <>
// //             <button
// //               onClick={disconnect}
// //               style={{
// //                 backgroundColor: '#dc3545',
// //                 color: 'white',
// //                 border: 'none',
// //                 padding: '10px 20px',
// //                 borderRadius: '5px',
// //                 cursor: 'pointer'
// //               }}
// //             >
// //               🚫 Disconnect
// //             </button>
            
// //             <button
// //               onClick={fetchBalance}
// //               style={{
// //                 backgroundColor: '#28a745',
// //                 color: 'white',
// //                 border: 'none',
// //                 padding: '10px 20px',
// //                 borderRadius: '5px',
// //                 cursor: 'pointer'
// //               }}
// //             >
// //               💰 Refresh Balance
// //             </button>
// //           </>
// //         )}
// //       </div>

// //       {isConnected && publicKey && (
// //         <div style={{ marginTop: '10px', fontSize: '14px', color: '#6c757d' }}>
// //           <div>
// //             <strong>Status:</strong> 
// //             <span style={{ color: '#28a745', marginLeft: '5px' }}>
// //               ✅ Connected
// //             </span>
// //           </div>
// //           <div>
// //             <strong>Address:</strong> 
// //             <span style={{ fontFamily: 'monospace', marginLeft: '5px' }}>
// //               {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}
// //             </span>
// //           </div>
// //           {balance !== null && (
// //             <div>
// //               <strong>Balance:</strong> 
// //               <span style={{ color: '#007bff', marginLeft: '5px' }}>
// //                 {balance.toFixed(4)} SOL
// //               </span>
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {!isConnected && !connectionError && (
// //         <div style={{ marginTop: '10px', fontSize: '14px', color: '#6c757d' }}>
// //           <strong>Status:</strong> 
// //           <span style={{ color: '#dc3545', marginLeft: '5px' }}>
// //             ❌ Disconnected
// //           </span>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default WalletConnect;




// import React, { useState, useEffect, createContext, useContext } from 'react';

// // Create a context for wallet state
// const WalletContext = createContext();

// // Custom hook to use wallet context
// export const useWallet = () => {
//   const context = useContext(WalletContext);
//   if (!context) {
//     throw new Error('useWallet must be used within a WalletProvider');
//   }
//   return context;
// };

// // Wallet Provider Component
// export const WalletProvider = ({ children }) => {
//   const [wallet, setWallet] = useState(null);
//   const [publicKey, setPublicKey] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [connectionError, setConnectionError] = useState(null);
//   const [balance, setBalance] = useState(null);

//   // Auto-connect function
//   const autoConnect = async () => {
//     if (typeof window !== 'undefined' && window.solana) {
//       try {
//         setIsConnecting(true);
//         setConnectionError(null);
        
//         // Check if already connected
//         if (window.solana.isConnected) {
//           setWallet(window.solana);
//           setPublicKey(window.solana.publicKey);
//           setIsConnected(true);
//           console.log('✅ Auto-connected to existing wallet session');
//           return;
//         }

//         // Try to connect
//         const response = await window.solana.connect();
//         setWallet(window.solana);
//         setPublicKey(response.publicKey);
//         setIsConnected(true);
//         console.log('✅ Auto-connected to Phantom wallet');
        
//       } catch (error) {
//         console.error('❌ Auto-connect failed:', error);
//         setConnectionError(error.message);
//         setIsConnected(false);
//       } finally {
//         setIsConnecting(false);
//       }
//     } else {
//       setConnectionError('Phantom wallet not found. Please install Phantom wallet extension.');
//     }
//   };

//   // Manual connect function
//   const connect = async () => {
//     if (typeof window !== 'undefined' && window.solana) {
//       try {
//         setIsConnecting(true);
//         setConnectionError(null);
        
//         const response = await window.solana.connect();
//         setWallet(window.solana);
//         setPublicKey(response.publicKey);
//         setIsConnected(true);
//         console.log('✅ Manually connected to Phantom wallet');
        
//       } catch (error) {
//         console.error('❌ Manual connect failed:', error);
//         setConnectionError(error.message);
//         setIsConnected(false);
//       } finally {
//         setIsConnecting(false);
//       }
//     } else {
//       setConnectionError('Phantom wallet not found. Please install Phantom wallet extension.');
//     }
//   };

//   // Disconnect function
//   const disconnect = async () => {
//     if (wallet) {
//       try {
//         await wallet.disconnect();
//         setWallet(null);
//         setPublicKey(null);
//         setIsConnected(false);
//         setBalance(null);
//         console.log('✅ Disconnected from Phantom wallet');
//       } catch (error) {
//         console.error('❌ Disconnect failed:', error);
//       }
//     }
//   };

//   // Fetch balance function
//   const fetchBalance = async () => {
//     if (publicKey && isConnected) {
//       try {
//         const { Connection } = await import('@solana/web3.js');
//         const connection = new Connection('https://api.devnet.solana.com');
//         const bal = await connection.getBalance(publicKey);
//         setBalance(bal / 1e9); // Convert lamports to SOL
//         return bal / 1e9;
//       } catch (error) {
//         console.error('❌ Failed to fetch balance:', error);
//         return null;
//       }
//     }
//     return null;
//   };

//   // Set up wallet event listeners & auto-connect on mount
//   useEffect(() => {
//     if (typeof window !== 'undefined' && window.solana) {
//       const handleConnect = () => {
//         setWallet(window.solana);
//         setPublicKey(window.solana.publicKey);
//         setIsConnected(true);
//         setConnectionError(null);
//         console.log('✅ Wallet connected via event');
//       };

//       const handleDisconnect = () => {
//         setWallet(null);
//         setPublicKey(null);
//         setIsConnected(false);
//         setBalance(null);
//         console.log('✅ Wallet disconnected via event');
//       };

//       const handleAccountChanged = (publicKey) => {
//         if (publicKey) {
//           setPublicKey(publicKey);
//           console.log('✅ Wallet account changed');
//         } else {
//           setPublicKey(null);
//           setIsConnected(false);
//           console.log('✅ Wallet account disconnected');
//         }
//       };

//       window.solana.on('connect', handleConnect);
//       window.solana.on('disconnect', handleDisconnect);
//       window.solana.on('accountChanged', handleAccountChanged);

//       autoConnect();

//       return () => {
//         window.solana.removeListener('connect', handleConnect);
//         window.solana.removeListener('disconnect', handleDisconnect);
//         window.solana.removeListener('accountChanged', handleAccountChanged);
//       };
//     }
//   }, []);

//   // Fetch balance periodically when connected
//   useEffect(() => {
//     if (isConnected && publicKey) {
//       fetchBalance();
//       const interval = setInterval(fetchBalance, 30000);
//       return () => clearInterval(interval);
//     }
//   }, [isConnected, publicKey]);

//   const value = {
//     wallet,
//     publicKey,
//     isConnected,
//     isConnecting,
//     connectionError,
//     balance,
//     connect,
//     disconnect,
//     autoConnect,
//     fetchBalance
//   };

//   return (
//     <WalletContext.Provider value={value}>
//       {children}
//     </WalletContext.Provider>
//   );
// };

// // Wallet Connect Component (no UI)
// const WalletConnect = () => {
//   const {
//     isConnected,
//     isConnecting,
//     connectionError,
//     publicKey,
//     balance,
//     connect,
//     fetchBalance
//   } = useWallet();

//   // Auto-call connect if not already connected
//   useEffect(() => {
//     if (!isConnected && !isConnecting && !connectionError) {
//       connect();
//     }
//   }, [isConnected, isConnecting, connectionError, connect]);

//   // Auto-refresh balance
//   useEffect(() => {
//     if (isConnected && publicKey) {
//       fetchBalance();
//       const id = setInterval(fetchBalance, 30000);
//       return () => clearInterval(id);
//     }
//   }, [isConnected, publicKey, fetchBalance]);

//   // Render nothing
//   return null;
// };

// export default WalletConnect;




import React, { useState, useEffect, createContext, useContext } from 'react';

// Create a context for wallet state
const WalletContext = createContext();

// Custom hook to use wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// Wallet Provider Component
export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [balance, setBalance] = useState(null);

  // Auto-connect function
  const autoConnect = async () => {
    if (typeof window !== 'undefined' && window.solana) {
      try {
        setIsConnecting(true);
        setConnectionError(null);

        // Check if already connected
        if (window.solana.isConnected) {
          setWallet(window.solana);
          setPublicKey(window.solana.publicKey);
          setIsConnected(true);
          console.log('✅ Auto-connected to existing wallet session');
          return;
        }

        // Try to connect
        const response = await window.solana.connect();
        setWallet(window.solana);
        setPublicKey(response.publicKey);
        setIsConnected(true);
        console.log('✅ Auto-connected to Phantom wallet');
      } catch (error) {
        console.error('❌ Auto-connect failed:', error);
        setConnectionError(error.message);
        setIsConnected(false);
      } finally {
        setIsConnecting(false);
      }
    } else {
      setConnectionError('Phantom wallet not found. Please install Phantom wallet extension.');
    }
  };

  // Manual connect function
  const connect = async () => {
    if (typeof window !== 'undefined' && window.solana) {
      try {
        setIsConnecting(true);
        setConnectionError(null);

        const response = await window.solana.connect();
        setWallet(window.solana);
        setPublicKey(response.publicKey);
        setIsConnected(true);
        console.log('✅ Manually connected to Phantom wallet');
      } catch (error) {
        console.error('❌ Manual connect failed:', error);
        setConnectionError(error.message);
        setIsConnected(false);
      } finally {
        setIsConnecting(false);
      }
    } else {
      setConnectionError('Phantom wallet not found. Please install Phantom wallet extension.');
    }
  };

  // Disconnect function
  const disconnect = async () => {
    if (wallet) {
      try {
        await wallet.disconnect();
        setWallet(null);
        setPublicKey(null);
        setIsConnected(false);
        setBalance(null);
        console.log('✅ Disconnected from Phantom wallet');
      } catch (error) {
        console.error('❌ Disconnect failed:', error);
      }
    }
  };

  // Fetch balance function
  const fetchBalance = async () => {
    if (publicKey && isConnected) {
      try {
        const { Connection } = await import('@solana/web3.js');
        const connection = new Connection('https://api.devnet.solana.com');
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / 1e9); // Convert lamports to SOL
        return bal / 1e9;
      } catch (error) {
        console.error('❌ Failed to fetch balance:', error);
        return null;
      }
    }
    return null;
  };

  // Set up wallet event listeners & auto-connect on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.solana) {
      const handleConnect = () => {
        setWallet(window.solana);
        setPublicKey(window.solana.publicKey);
        setIsConnected(true);
        setConnectionError(null);
        console.log('✅ Wallet connected via event');
      };

      const handleDisconnect = () => {
        setWallet(null);
        setPublicKey(null);
        setIsConnected(false);
        setBalance(null);
        console.log('✅ Wallet disconnected via event');
      };

      const handleAccountChanged = (publicKey) => {
        if (publicKey) {
          setPublicKey(publicKey);
          console.log('✅ Wallet account changed');
        } else {
          setPublicKey(null);
          setIsConnected(false);
          console.log('✅ Wallet account disconnected');
        }
      };

      window.solana.on('connect', handleConnect);
      window.solana.on('disconnect', handleDisconnect);
      window.solana.on('accountChanged', handleAccountChanged);

      autoConnect();

      return () => {
        window.solana.removeListener('connect', handleConnect);
        window.solana.removeListener('disconnect', handleDisconnect);
        window.solana.removeListener('accountChanged', handleAccountChanged);
      };
    }
  }, []);

  // Fetch balance periodically when connected
  useEffect(() => {
    if (isConnected && publicKey) {
      fetchBalance();
      const interval = setInterval(fetchBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, publicKey]);

  const value = {
    wallet,
    publicKey,
    isConnected,
    isConnecting,
    connectionError,
    balance,
    connect,
    disconnect,
    autoConnect,
    fetchBalance
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Wallet Connect Component (no UI)
const WalletConnect = () => {
  const {
    isConnected,
    isConnecting,
    connectionError,
    publicKey,
    connect,
    fetchBalance
  } = useWallet();

  // Auto-call connect if not already connected
  useEffect(() => {
    if (!isConnected && !isConnecting && !connectionError) {
      connect();
    }
  }, [isConnected, isConnecting, connectionError, connect]);

  // Auto-refresh balance
  useEffect(() => {
    if (isConnected && publicKey) {
      fetchBalance();
      const id = setInterval(fetchBalance, 30000);
      return () => clearInterval(id);
    }
  }, [isConnected, publicKey, fetchBalance]);

  // Render nothing
  return null;
};

export default WalletConnect;

