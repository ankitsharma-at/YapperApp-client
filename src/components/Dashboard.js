import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Log the token
        const [allCommunitiesResponse, userCommunitiesResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/community"),
          axios.get("http://localhost:5000/api/community/user", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        console.log('All communities:', allCommunitiesResponse.data);
        console.log('User communities:', userCommunitiesResponse.data);
        setCommunities(allCommunitiesResponse.data);
        setUserCommunities(userCommunitiesResponse.data);
      } catch (error) {
        console.error('Error fetching communities:', error.response || error);
        setError(error.response?.data?.message || 'Failed to fetch communities');
      }
    };
    fetchCommunities();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Communities</h1>
        <Link 
          to="/create-community" 
          className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-bold py-2 px-4 rounded-lg border-2 border-white shadow-md hover:shadow-lg transition duration-300"
        >
          Create New Community
        </Link>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Communities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCommunities.map(community => (
            <div key={community._id} className="bg-white rounded-lg shadow-md p-6">
              <img src={community.profileImage} alt={community.name} className="w-full h-40 object-cover rounded-t-lg mb-4" />
              <h2 className="text-xl font-bold mb-2">{community.name}</h2>
              <p className="text-gray-600 mb-4">{community.description}</p>
              <Link to={`/community/${community._id}`} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300">
                View Community
              </Link>
            </div>
          ))}
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">Public Communities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map(community => (
          <div key={community._id} className="bg-white rounded-lg shadow-md p-6">
            <img src={community.profileImage} alt={community.name} className="w-full h-40 object-cover rounded-t-lg mb-4" />
            <h2 className="text-xl font-bold mb-2">{community.name}</h2>
            <p className="text-gray-600 mb-4">{community.description}</p>
            <Link to={`/community/${community._id}`} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300">
              View Community
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;