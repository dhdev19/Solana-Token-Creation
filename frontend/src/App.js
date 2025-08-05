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
import Navbar from './Navbar';
import CreateTokenForm from './CreateTokenForm';
import AddLiquidityForm from './AddLiquidityForm';
import RemoveLiquidityForm from './RemoveLiquidityForm';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col items-center pt-20">
        <Navbar />

        <div className="w-full max-w-xl p-4 mt-6">
          <Routes>
            <Route path="/" element={<Navigate to="/create-token" />} />
            <Route path="/create-token" element={<CreateTokenForm />} />
            <Route path="/add-liquidity" element={<AddLiquidityForm />} />
            <Route path="/remove-liquidity" element={<RemoveLiquidityForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
