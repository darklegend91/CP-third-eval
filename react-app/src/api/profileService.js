import api from './client';

export const fetchProfileData = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    throw error;
  }
};
