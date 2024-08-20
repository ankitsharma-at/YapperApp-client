import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CommunityCard({ community, isMember }) {
  const handleJoin = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/community/${community._id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      console.error('Error joining community:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <img src={community.bannerImage} alt={community.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 w-20 h-20 -mb-10 ml-4">
          <img src={community.profileImage} alt={community.name} className="w-full h-full rounded-full border-4 border-white object-cover" />
        </div>
      </div>
      <div className="p-6 pt-12">
        <h2 className="text-xl font-bold mb-2">{community.name}</h2>
        <p className="text-gray-600 mb-4">{community.description}</p>
        <div className="flex justify-between items-center">
          <Link to={`/community/${community._id}`} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300">
            View Community
          </Link>
          {!isMember && (
            <button onClick={handleJoin} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
              Join
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunityCard;