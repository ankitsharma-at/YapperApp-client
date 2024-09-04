import React, { useEffect, useState, lazy, Suspense } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
const Home = lazy(() => import('./components/Home'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const CreateCommunity = lazy(() => import('./components/CreateCommunity'));
const CommunityView = lazy(() => import('./components/CommunityView'));
const About = lazy(() => import('./components/About'));
const PostDetail = lazy(() => import('./components/PostDetail'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const JoinCommunity = lazy(() => import('./components/JoinCommunity'));
const AppLaunch = lazy(() => import('./components/AppLaunch'));

import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

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
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <AuthProvider>
        <Suspense fallback={<Preloader />}>
          <AppContent />
          </Suspense>
        </AuthProvider>
      </GoogleOAuthProvider>
    </Router>
  );
}
function Preloader() {
  return (
    <div id="preloader" class="text-center">
    <div class="bg-gray-200 w-full min-h-screen flex justify-center items-center">
      <div class="flex min-h-screen w-full items-center justify-center bg-gray-200">
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 animate-spin">
          <div class="h-9 w-9 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default App;