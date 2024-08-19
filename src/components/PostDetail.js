import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Post from './Post';
import Comment from './Comment';

function PostDetail() {
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const { postId } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/post/${postId}`);
        setPost(response.data);
      } catch (err) {
        setError('Failed to fetch post');
      }
    };
    fetchPost();
  }, [postId]);

  const createComment = async (postId, content) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/post/${postId}/comment`, 
        { content },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const newCommentData = await createComment(postId, newComment);
      setPost({ ...post, comments: [...post.comments, newCommentData] });
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment');
      console.error('Error adding comment:', err.response?.data);
    }
  };

  const updatePost = (updatedPost) => {
    setPost(updatedPost);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/post/${postId}/comment/${commentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPost({ ...post, comments: post.comments.filter(comment => comment._id !== commentId) });
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  if (!post) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Post post={post} isDetailView={true} updatePost={updatePost} />
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Comments</h3>
        {post.comments.map(comment => (
          <Comment key={comment._id} comment={comment} onDelete={handleDeleteComment} />
        ))}
      </div>
      <form onSubmit={handleSubmitComment} className="mt-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Add a comment..."
          required
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Add Comment
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default PostDetail;