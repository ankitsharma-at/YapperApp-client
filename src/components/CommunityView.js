import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import Post from './Post';

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
      const token = localStorage.getItem('token');

      const response = await axios.post(`http://localhost:5000/api/post/${id}`, {
        title: newPost.title,
        content: newPost.content,
        isAnonymous: newPost.isAnonymous
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      setPosts([response.data, ...posts]);
      setNewPost({ title: '', content: '', isAnonymous: false });
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    }
  };

  const updatePost = (updatedPost) => {
    setPosts(posts.map(post => post._id === updatedPost._id ? updatedPost : post));
  };

  if (!community) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">{community.name}</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            placeholder="Post Title"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            placeholder="Post Content"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={newPost.isAnonymous}
                onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                className="form-checkbox"
              />
              <span className="ml-2">Post Anonymously</span>
            </label>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Create Post
          </button>
        </form>
      </div>
      <div className="space-y-6">
        {posts.map(post => (
          <Post key={post._id} post={post} updatePost={updatePost} />
        ))}
      </div>
    </div>
  );
}

export default CommunityView;