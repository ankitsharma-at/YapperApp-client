import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bigScreenImage from '../assets/download.svg';
import smallScreenImage from '../assets/download(1).svg';

function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white bg-home-image">
      <nav className="p-4 absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-caribbean-green">YapperApp</Link>
          
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="hover:text-caribbean-green transition-colors">About</Link>
            <Link to="/" className="hover:text-caribbean-green transition-colors">Features</Link>
            <Link to="/" className="hover:text-caribbean-green transition-colors">Pricing</Link>
            <Link to="/" className="hover:text-caribbean-green transition-colors">Contact</Link>
          </div>
          
          <Link to="/signup" className="hidden md:inline-block bg-caribbean-green text-black font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition duration-300">
            Register
          </Link>
          
          <button 
            className="md:hidden text-caribbean-green"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-black bg-opacity-90 items-center justify-center rounded-lg p-4">
            <Link to="/" className="block py-2 hover:text-caribbean-green transition-colors">About</Link>
            <Link to="/" className="block py-2 hover:text-caribbean-green transition-colors">Features</Link>
            <Link to="/" className="block py-2 hover:text-caribbean-green transition-colors">Pricing</Link>
            <Link to="/" className="block py-2 hover:text-caribbean-green transition-colors">Contact</Link>
            <Link to="/" className="block py-2 mt-4 bg-caribbean-green text-black font-bold rounded-lg hover:bg-opacity-80 transition duration-300 text-center">
              Register
            </Link>
          </div>
        )}
      </nav>

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-thin mb-6 leading-tight">
            Unleash Your Thoughts,<br />Embrace <span className="font-bold anonymity-text">Anonymity</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 font-light">Share your unfiltered ideas with the world.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/signup" className="bg-caribbean-green text-black font-bold py-3 px-6 rounded-lg hover:bg-opacity-80 transition duration-300">
              Become a Yapper
            </Link>
            <Link to="/login" className="bg-transparent border-2 border-caribbean-green text-caribbean-green font-bold py-3 px-6 rounded-lg hover:bg-caribbean-green hover:text-black transition duration-300">
              Already a Yapper
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;