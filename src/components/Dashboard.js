import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CommunityCard from './CommunityCard';

function Dashboard() {
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const token = localStorage.getItem('token');// Log the token
        const [allCommunitiesResponse, userCommunitiesResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_SERVER_URL}/api/community`),
          axios.get(`${process.env.REACT_APP_SERVER_URL}/api/community/user`, {
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
        {userCommunities.length === 0 ? (
          <p className="text-gray-600">Find yourself a new community to Join.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCommunities.map(community => (
              <CommunityCard key={community._id} community={community} isMember={true} />
            ))}
          </div>
        )}
      </div>
      <h2 className="text-2xl font-bold mb-4">Public Communities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map(community => (
          <CommunityCard key={community._id} community={community} isMember={false} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;