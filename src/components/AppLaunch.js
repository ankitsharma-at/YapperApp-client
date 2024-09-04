import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AppLaunch() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (token && userId) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data) {
            navigate('/dashboard');
          } else {
            navigate('/login');
          }
        } catch (error) {
          console.error('Error checking user:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    checkUser();
  }, [navigate]);

  return (
    <div className="text-center">Loading...</div>
  );
}

export default AppLaunch;
