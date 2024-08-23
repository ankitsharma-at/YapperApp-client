import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import Post from './Post';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faShare, faPlus, faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function CommunityView() {
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', isAnonymous: false });
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedCommunity, setEditedCommunity] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [inviteCode, setInviteCode] = useState('');
  const [isMember, setIsMember] = useState(false);

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
        setIsMember(response.data.members.includes(userId));
      } catch (err) {
        console.error('Failed to fetch community:', err);
        setError('Failed to fetch community');
      }
    };
    fetchCommunity();
  }, [id, userId]);

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
      setNewPost({ title: '', content: '', isAnonymous: false });
      setShowCreatePost(false);
      window.location.reload(); // Refresh the page
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post: ' + (err.response?.data?.message || err.message));
    }
  };

  const updatePost = (updatedPost) => {
    setPosts(posts.map(post => post._id === updatedPost._id ? updatedPost : post));
    window.location.reload(); // Refresh the page
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

  const handleShareCommunity = async () => {
    if (community && community.inviteCode) {
      const inviteLink = `${window.location.origin}/join/${community.inviteCode}`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Join ${community.name} on YapperApp`,
            text: `I invite you to join our community on YapperApp!`,
            url: inviteLink
          });
        } catch (err) {
          console.error('Error sharing:', err);
          fallbackCopyToClipboard(inviteLink);
        }
      } else {
        fallbackCopyToClipboard(inviteLink);
      }
    } else {
      console.error('Invite code not available');
      setError('Unable to generate invite link. Please try again later.');
    }
  };

  const fallbackCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Invite link copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const handleJoinCommunity = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/community/${id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsMember(true);
      window.location.reload();
    } catch (err) {
      console.error('Error joining community:', err);
      setError('Failed to join community: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLeaveCommunity = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/community/${id}/leave`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsMember(false);
      window.location.reload();
    } catch (err) {
      console.error('Error leaving community:', err);
      setError('Failed to leave community: ' + (err.response?.data?.message || err.message));
    }
  };

  if (!community) return <div className="text-center">Loading...</div>;

  const isAdmin = userId && community.admin === userId;

  return (
    <>
      <Navbar showBackButton={true} />
      <div className="max-w-4xl mx-auto p-4 mt-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative">
            <img src={community.bannerImage} alt={community.name} className="w-full h-64 object-cover" />
            <div className="absolute bottom-0 left-0 w-32 h-32 -mb-16 ml-8">
              <img src={community.profileImage} alt={community.name} className="w-full h-full rounded-full border-4 border-white object-cover" />
            </div>
          </div>
          <div className="mt-20 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold">{community.name}</h1>
                <p className="text-gray-600 mt-2">{community.description}</p>
              </div>
              <div className="flex space-x-2">
                {isAdmin && (
                  <>
                    <button onClick={handleEditCommunity} className="text-gray-600 hover:text-blue-500 transition-colors" title='Edit Community'>
                      <FontAwesomeIcon icon={faEdit} size="lg" />
                    </button>
                    <button onClick={handleDeleteCommunity} className="text-gray-600 hover:text-red-500 transition-colors" title='Delete Community'>
                      <FontAwesomeIcon icon={faTrash} size="lg" />
                    </button>
                  </>
                )}
                <button onClick={handleShareCommunity} className="text-gray-600 hover:text-green-500 transition-colors" title='Share Community'>
                  <FontAwesomeIcon icon={faShare} size="lg" />
                </button>
                {!isMember && (
                  <button 
                    onClick={handleJoinCommunity} 
                    className="text-purple-600 hover:text-purple-700 transition-colors"
                    title="Join Community"
                  >
                    <FontAwesomeIcon icon={faUserPlus} size="lg" />
                  </button>
                )}
                {isMember && !isAdmin && (
                  <button 
                    onClick={handleLeaveCommunity} 
                    className="text-red-600 hover:text-red-700 transition-colors"
                    title="Leave Community"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
                  </button>
                )}
              </div>
            </div>
            {isEditing && (
              <div className="mt-4">
                <input
                  type="text"
                  value={editedCommunity.name}
                  onChange={(e) => setEditedCommunity({...editedCommunity, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md mb-2"
                />
                <textarea
                  value={editedCommunity.description}
                  onChange={(e) => setEditedCommunity({...editedCommunity, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Posts</h2>
            <button 
              onClick={() => setShowCreatePost(!showCreatePost)}
              className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Create Post
            </button>
          </div>
          {showCreatePost && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
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
          )}
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map(post => (
                <Post key={post._id} post={post} updatePost={updatePost} deletePost={deletePost} isAdmin={isAdmin} />
              ))
            ) : (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">Be the First to Post!</h3>
                <p className="text-gray-600 mb-4">This community is waiting for its first post. Why not be the one to start the conversation?</p>
                <button 
                  onClick={() => setShowCreatePost(true)}
                  className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Create the First Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CommunityView;