import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import CreateCommunity from './components/CreateCommunity';
import CommunityView from './components/CommunityView';
import About from './components/About';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import PostDetail from './components/PostDetail';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import JoinCommunity from './components/JoinCommunity';
import AppLaunch from './components/AppLaunch';

function AppContent() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Google One Tap setup
    if (!user) {
      const { google } = window;
      if (google) {
        google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.log('One Tap is not displayed');
          }
        });
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [user]);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/google-one-tap`, {
        credential: response.credential,
      });
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user._id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google One Tap error:', error);
      // You might want to show an error message to the user here
      // For example, using a toast notification or setting an error state
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/create-community" element={
          <PrivateRoute>
            <CreateCommunity />
          </PrivateRoute>
        } />
        <Route path="/community/:id" element={
          <PrivateRoute>
            <CommunityView />
          </PrivateRoute>
        } />
        <Route path="/post/:postId" element={<PostDetail />} />
        <Route path="/join/:inviteCode" element={
          <PrivateRoute>
            <JoinCommunity />
          </PrivateRoute>
        } />
        <Route path="/app-launch" element={<AppLaunch />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/tos" element={<TermsOfService />} />
        <Route path="/about" element={<About />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </GoogleOAuthProvider>
    </Router>
  );
}

export default App;