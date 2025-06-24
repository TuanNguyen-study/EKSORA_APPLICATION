import apiClient from '../config';

export const getOffers = async () => {
  try {
    const response = await apiClient.get('/offers');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch offers');
  }
};