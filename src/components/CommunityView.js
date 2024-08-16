import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

function CommunityView() {
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', isAnonymous: false });
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const data = await axios.get(`http://localhost:5000/api/community/${id}`);
        setCommunity(data.data);
        setPosts(data.data.posts);
      } catch (err) {
        setError('Failed to fetch community');
      }
    };
    fetchCommunity();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const post = await axios.post(`http://localhost:5000/api/community/${id}/post`, newPost);
      setPosts([post.data, ...posts]);
      setNewPost({ title: '', content: '', isAnonymous: false });
    } catch (err) {
      setError('Failed to create post');
    }
  };

  if (!community) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <img src={community.bannerImage} alt={community.name} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
          <p className="text-gray-600 mb-4">{community.description}</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-md mb-4"
            required
          />
          <textarea
            placeholder="Content"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="w-full px-3 py-2 border rounded-md mb-4"
            required
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isAnonymous"
              checked={newPost.isAnonymous}
              onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isAnonymous">Post anonymously</label>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Create Post
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {posts.map(post => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default CommunityView;