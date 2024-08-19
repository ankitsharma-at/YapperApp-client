import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCommunity } from '../utils/api';

function CreateCommunity() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [error, setError] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create a New Community</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Community Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">Profile Image</label>
          <input type="file" id="profileImage" onChange={(e) => setProfileImage(e.target.files[0])} 
            className="mt-1 block w-full" />
        </div>
        <div>
          <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700">Banner Image</label>
          <input type="file" id="bannerImage" onChange={(e) => setBannerImage(e.target.files[0])} 
            className="mt-1 block w-full" />
        </div>
        <div>
          <label htmlFor="isPrivate" className="block text-sm font-medium text-gray-700">Community Privacy</label>
          <select
            id="isPrivate"
            value={isPrivate}
            onChange={(e) => setIsPrivate(e.target.value === 'true')}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="false">Public</option>
            <option value="true">Private</option>
          </select>
        </div>
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300">
          Create Community
        </button>
      </form>
    </div>
  );
}

export default CreateCommunity;