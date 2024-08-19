import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import Post from './Post';
import { useAuth } from '../contexts/AuthContext';

function CommunityView() {
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', isAnonymous: false });
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedCommunity, setEditedCommunity] = useState(null);
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/community/${id}`);
        setCommunity(response.data);
        setEditedCommunity(response.data);
        setPosts(response.data.posts || []);
        setUserId(localStorage.getItem('userId'));
        if (response.data.inviteCode) {
          setInviteCode(response.data.inviteCode);
        } else {
          console.error('Invite code not found for community');
        }
      } catch (err) {
        console.error('Failed to fetch community:', err);
        setError('Failed to fetch community');
      }
    };
    fetchCommunity();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/post/${id}`, {
        title: newPost.title,
        content: newPost.content,
        isAnonymous: newPost.isAnonymous
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      console.log('New post created:', response.data);
      setPosts(prevPosts => [response.data, ...prevPosts]);
      setNewPost({ title: '', content: '', isAnonymous: false });
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post: ' + (err.response?.data?.message || err.message));
    }
  };

  const updatePost = (updatedPost) => {
    setPosts(posts.map(post => post._id === updatedPost._id ? updatedPost : post));
  };

  const deletePost = async (postId) => {
    try {
      console.log('Deleting post:', postId);
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/post/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err.response?.data || err.message);
      setError('Failed to delete post: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEditCommunity = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!isAdmin) {
      setError('You are not authorized to edit this community');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/community/${id}`, editedCommunity, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommunity(response.data);
      setEditedCommunity(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error editing community:', err);
      setError('Failed to edit community: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteCommunity = async () => {
    if (!isAdmin) {
      setError('You are not authorized to delete this community');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/community/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting community:', err);
      setError('Failed to delete community: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleShareCommunity = () => {
    if (community && community.inviteCode) {
      const inviteLink = `${window.location.origin}/join/${community.inviteCode}`;
      navigator.clipboard.writeText(inviteLink).then(() => {
        alert('Invite link copied to clipboard!');
      }, (err) => {
        console.error('Could not copy text: ', err);
      });
    } else {
      console.error('Invite code not available');
      setError('Unable to generate invite link. Please try again later.');
    }
  };

  if (!community) return <div className="text-center">Loading...</div>;

  const isAdmin = userId && community.admin === userId;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="relative">
        <img src={community.bannerImage} alt={community.name} className="w-full h-48 object-cover rounded-t-lg" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h1 className="text-3xl font-bold text-white">{community.name}</h1>
        </div>
      </div>
      {isAdmin && (
        <div className="mt-4 flex justify-end space-x-2">
          {isEditing ? (
            <button onClick={handleSaveEdit} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
              Save Changes
            </button>
          ) : (
            <button onClick={handleEditCommunity} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Edit Community
            </button>
          )}
          <button onClick={handleDeleteCommunity} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            Delete Community
          </button>
          <button onClick={handleShareCommunity} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Share Community
          </button>
        </div>
      )}
      {isEditing && (
        <div className="mt-4">
          <input
            type="text"
            value={editedCommunity.name}
            onChange={(e) => setEditedCommunity({...editedCommunity, name: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          />
          <textarea
            value={editedCommunity.description}
            onChange={(e) => setEditedCommunity({...editedCommunity, description: e.target.value})}
            className="w-full px-3 py-2 border rounded-md mt-2"
          />
        </div>
      )}
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
          <Post key={post._id} post={post} updatePost={updatePost} deletePost={deletePost} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  );
}

export default CommunityView;