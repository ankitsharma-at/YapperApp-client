import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [communities, setCommunities] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (location) {
      // Fetch nearby communities
      axios.get(`/api/communities/nearby?lat=${location.lat}&lng=${location.lng}`)
        .then(response => {
          setCommunities(response.data);
        })
        .catch(error => {
          console.error('Error fetching communities:', error);
        });
    }
  }, [location]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nearby Communities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map(community => (
          <div key={community._id} className="bg-white rounded-lg shadow-md p-6">
            <img src={community.profileImage} alt={community.name} className="w-full h-40 object-cover rounded-t-lg mb-4" />
            <h2 className="text-xl font-bold mb-2">{community.name}</h2>
            <p className="text-gray-600 mb-4">{community.description}</p>
            <Link to={`/community/${community._id}`} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300">
              Join Community
            </Link>
          </div>
        ))}
      </div>
      <Link to="/create-community" className="mt-8 inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300">
        Create New Community
      </Link>
    </div>
  );
}

export default Dashboard;
