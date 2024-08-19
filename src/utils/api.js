import axios from 'axios';

export const createCommunity = async (formData, token) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/community`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in createCommunity:', error);
    console.log('Response data:', error.response?.data);
    console.log('Response status:', error.response?.status);
    throw error;
  }
};