import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-12 rounded-lg shadow-2xl text-center">
        <h1 className="text-5xl font-bold mb-8 text-gray-800">Welcome to YapperApp</h1>
        <p className="mb-8 text-xl text-gray-600">Share your thoughts anonymously with your local community.</p>
        <div className="space-y-4">
          <Link to="/signup" className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
            Start Ranting
          </Link>
          <Link to="/login" className="block w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
            Already a Yapper? Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;