import apiClient from '../config';

export const getDestinations = async () => {
  try {
    const response = await apiClient.get('/destinations');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch destinations');
  }
};

export const searchTickets = async (params) => {
  try {
    const response = await apiClient.get('/tickets', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to search tickets');
  }
};