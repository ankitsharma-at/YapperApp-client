import axios from 'axios';

export const createCommunity = async (formData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/community', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      timeout: 30000 // Increase timeout to 30 seconds
    });
    return response.data;
  } catch (error) {
    console.error('Error in createCommunity:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error;
  }
};