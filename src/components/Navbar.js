import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">YapperApp</Link>
        <div>
          {currentUser ? (
            <>
              <Link to="/dashboard" className="mr-4 hover:text-gray-300">Dashboard</Link>
              <button onClick={logout} className="bg-transparent border-2 border-white text-white font-bold py-2 px-4 rounded shadow-md hover:bg-white hover:text-pink-500 transition duration-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-transparent border-2 border-white text-white font-bold py-2 px-4 rounded shadow-md hover:bg-white hover:text-pink-500 transition duration-300 mr-4">Login</Link>
              <Link to="/signup" className="bg-transparent border-2 border-white text-white font-bold py-2 px-4 rounded shadow-md hover:bg-white hover:text-pink-500 transition duration-300">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;