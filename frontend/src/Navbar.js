import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `hover:underline ${isActive ? 'font-bold underline' : ''}`;

  return (
    <nav className="w-full bg-gray-800 text-white p-4 flex justify-center space-x-8 fixed top-0 z-50">
       <NavLink to="/" className={linkClass}>Home</NavLink>
      <NavLink to="/create-token" className={linkClass}>Create Token</NavLink>
      <NavLink to="/create-pool" className={linkClass}>Create Pool (Raydium)</NavLink>
      <NavLink to="/add-liquidity" className={linkClass}>Add Liquidity</NavLink>
      <NavLink to="/remove-liquidity" className={linkClass}>Remove Liquidity</NavLink>
    </nav>
  );
};

export default Navbar;
