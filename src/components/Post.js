import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function Post({ post, isDetailView = false, updatePost, deletePost, isAdmin }) {
  const [isLiked, setIsLiked] = useState(post.likedBy.includes(localStorage.getItem('userId')));
  const [isDisliked, setIsDisliked] = useState(post.dislikedBy.includes(localStorage.getItem('userId')));
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const { currentUser } = useAuth();

  const isAuthor = post.author && localStorage.getItem('userId') === post.author._id;
  const authorName = post.isAnonymous ? 'Anonymous' : (post.author ? post.author.username : 'Unknown');

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/post/${post._id}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setIsLiked(!isLiked);
      setIsDisliked(false);
      if (updatePost) {
        updatePost(response.data);
      }
     // window.location.reload();
     // window.scrollTo(0, window.pageYOffset);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/post/${post._id}/dislike`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setIsDisliked(!isDisliked);
      setIsLiked(false);
      if (updatePost) {
        updatePost(response.data);
      }
      //window.location.reload();
      //window.scrollTo(0, window.pageYOffset);
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/post/${post._id}`, 
        { content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (updatePost) {
        updatePost(response.data);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error editing post:', error);
      alert('Failed to edit post: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Attempting to delete post:', post._id);
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/post/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (deletePost) {
        deletePost(post._id);
      }
    } catch (error) {
      console.error('Error deleting post:', error.response?.data || error.message);
      alert('Failed to delete post: ' + (error.response?.data?.message || error.message));
    }
  };

  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
          rows="4"
        />
      ) : (
        <p className="text-gray-600 mb-4">
          {isDetailView ? post.content : truncateContent(post.content, 150)}
        </p>
      )}
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm">
          Posted by {authorName} on {new Date(post.createdAt).toLocaleString()}
        </p>
        {!isDetailView && (
          <Link to={`/post/${post._id}`} className="text-blue-500 hover:underline">
            Read more
          </Link>
        )}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div>
          <button 
            onClick={handleLike}
            className={`mr-2 ${isLiked ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}
          >
            ▲ {post.likedBy.length}
          </button>
          <button 
            onClick={handleDislike}
            className={`mr-2 ${isDisliked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
          >
            ▼ {post.dislikedBy.length}
          </button>
        </div>
        <div>
          {isAuthor && (
            <>
              {isEditing ? (
                <button onClick={handleSaveEdit} className="text-green-500 hover:text-green-700 mr-2">
                  Save
                </button>
              ) : (
                <button onClick={handleEdit} className="text-blue-500 hover:text-blue-700 mr-2">
                  Edit
                </button>
              )}
            </>
          )}
          {(isAuthor || isAdmin) && (
            <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;