import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Post({ post, isDetailView = false, updatePost }) {
  const [isLiked, setIsLiked] = useState(post.likedBy.includes(localStorage.getItem('userId')));
  const [isDisliked, setIsDisliked] = useState(post.dislikedBy.includes(localStorage.getItem('userId')));

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/post/${post._id}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setIsLiked(!isLiked);
      setIsDisliked(false);
      if (updatePost) {
        updatePost(response.data);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/post/${post._id}/dislike`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setIsDisliked(!isDisliked);
      setIsLiked(false);
      if (updatePost) {
        updatePost(response.data);
      }
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-600 mb-4">
        {isDetailView ? post.content : truncateContent(post.content, 150)}
      </p>
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm">
          Posted by {post.isAnonymous ? 'Anonymous' : (post.author?.username || 'Unknown')}
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
        <button className="text-gray-500 hover:text-green-500">
          💬 {post.comments.length} Comments
        </button>
      </div>
    </div>
  );
}

export default Post;