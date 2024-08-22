import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCommunity } from '../utils/api';
import Navbar from './Navbar';

function CreateCommunity() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [error, setError] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      if (bannerImage) {
        formData.append('bannerImage', bannerImage);
      }
      formData.append('isPrivate', isPrivate);

      const token = localStorage.getItem('token');
      const response = await createCommunity(formData, token);
      navigate(`/community/${response._id}`);
    } catch (err) {
      console.error('Error creating community:', err);
      setError(err.response?.data?.message || 'Failed to create community');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-home-image bg-cover bg-center">
      <Navbar showBackButton={true} isAuthPage={true} />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-caribbean-green">Create a New Community</h1>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-white text-sm font-medium mb-2">Community Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-caribbean-green" />
            </div>
            <div>
              <label htmlFor="description" className="block text-white text-sm font-medium mb-2">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-caribbean-green" />
            </div>
            <div>
              <label htmlFor="profileImage" className="block text-white text-sm font-medium mb-2">Profile Image</label>
              <input type="file" id="profileImage" onChange={(e) => setProfileImage(e.target.files[0])} 
                className="w-full text-white" />
            </div>
            <div>
              <label htmlFor="bannerImage" className="block text-white text-sm font-medium mb-2">Banner Image</label>
              <input type="file" id="bannerImage" onChange={(e) => setBannerImage(e.target.files[0])} 
                className="w-full text-white" />
            </div>
            <div>
              <label htmlFor="isPrivate" className="block text-white text-sm font-medium mb-2">Community Privacy</label>
              <select
                id="isPrivate"
                value={isPrivate}
                onChange={(e) => setIsPrivate(e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-caribbean-green"
              >
                <option value="false">Public</option>
                <option value="true">Private</option>
              </select>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-black text-white font-bold py-2 px-4 rounded-md transition duration-300 hover:bg-caribbean-green hover:text-black hover:shadow-lg hover:shadow-caribbean-green/50">
              {isLoading ? 'Creating...' : 'Create Community'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCommunity;