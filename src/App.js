import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import CreateCommunity from './components/CreateCommunity';
import CommunityView from './components/CommunityView';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import PostDetail from './components/PostDetail';
import JoinCommunity from './components/JoinCommunity';
import AppLaunch from './components/AppLaunch';

function App() {
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;