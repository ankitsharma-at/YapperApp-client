import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CommunityCard from './CommunityCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const token = localStorage.getItem('token');
        const [allCommunitiesResponse, userCommunitiesResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_SERVER_URL}/api/community`),
          axios.get(`${process.env.REACT_APP_SERVER_URL}/api/community/user`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setCommunities(allCommunitiesResponse.data);
        setUserCommunities(userCommunitiesResponse.data);
      } catch (error) {
        console.error('Error fetching communities:', error.response || error);
        setError(error.response?.data?.message || 'Failed to fetch communities');
      }
    };
    fetchCommunities();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">YapperApp</h1>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900">Logout</button>
            </div>
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Dashboard</Link>
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Logout</button>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">All Communities</h2>
          <Link 
            to="/create-community" 
            className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center group"
          >
            <span className="hidden sm:inline">Create New Community</span>
            <span className="sm:hidden">
              <FontAwesomeIcon icon={faPlus} />
            </span>
          </Link>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Your Communities</h3>
          {userCommunities.length === 0 ? (
            <p className="text-gray-600">Find yourself a new community to Join.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCommunities.map(community => (
                <CommunityCard key={community._id} community={community} isMember={true} />
              ))}
            </div>
          )}
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Public Communities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map(community => {
            const isMember = userCommunities.some(userCommunity => userCommunity._id === community._id);
            return (
              <CommunityCard key={community._id} community={community} isMember={isMember} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;