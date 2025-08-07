// import React from "react";
// import CreateTokenForm from "./CreateTokenForm";
// import Navbar from "./Navbar";
// import AddLiquidityForm from './AddLiquidityForm';
// import RemoveLiquidityForm from "./RemoveLiquidityForm";
// import { Buffer } from 'buffer';
// window.Buffer = Buffer;

// function App() {
//   return (
//     <div>



//       <Navbar />

//       <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8 pt-32">
       

        
//       </div>
//     </div>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import CreateTokenForm from './CreateTokenForm';
import AddLiquidityForm from './AddLiquidityForm';
import RemoveLiquidityForm from './RemoveLiquidityForm';
import CreatePool from './CreatePool';
import { WalletProvider } from './WalletConnect';
import WalletConnect from './WalletConnect';
import 'bootstrap/dist/css/bootstrap.min.css'; // ✅ Bootstrap included
import './style.css'; // 👈 Make sure the path is correct

const App = () => {
  return (
    <WalletProvider>
         <Router>
        <div className="flex flex-col items-center pt-20">
          <Navbar />

          <div className="w-full mainwrapper">
            <WalletConnect />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-token" element={<CreateTokenForm />} />
              <Route path="/create-pool" element={<CreatePool />} />
              <Route path="/add-liquidity" element={<AddLiquidityForm />} />
              <Route path="/remove-liquidity" element={<RemoveLiquidityForm />} />
            </Routes>
          </div>
        </div>
      </Router>
    </WalletProvider>
  );
};

// const App = () => (
//   <WalletProvider>
//     <Router>
//       <div className="flex flex-col items-center pt-20">
//         <Navbar />

//         <div className="w-full mainwrapper">
//           <WalletConnect />
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/create-token" element={<CreateTokenForm />} />
//             <Route path="/create-pool" element={<CreatePool />} />
//             <Route path="/add-liquidity" element={<AddLiquidityForm />} />
//             <Route path="/remove-liquidity" element={<RemoveLiquidityForm />} />
//             {/* Optional: catch all and redirect home */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   </WalletProvider>
// );


export default App;
