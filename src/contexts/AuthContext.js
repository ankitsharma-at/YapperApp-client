import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setCurrentUser(response.data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user._id); // Add this line
      setCurrentUser(response.data.user);
      return response; // Return the response
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Rethrow the error so it can be caught in the component
    }
  };

  const signup = async (username, email, password) => {
    const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/signup`, { username, email, password });
    localStorage.setItem('token', response.data.token);
    setCurrentUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    setCurrentUser,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}