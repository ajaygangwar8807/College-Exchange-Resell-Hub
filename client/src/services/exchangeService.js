import api from './api';

export const exchangeService = {
  createExchangeRequest: async (data) => {
    const response = await api.post('/exchanges', data);
    return response.data;
  },

  getMyExchanges: async () => {
    const response = await api.get('/exchanges');
    return response.data;
  },

  getExchangeById: async (id) => {
    const response = await api.get(`/exchanges/${id}`);
    return response.data;
  },

  updateExchangeStatus: async (id, status) => {
    const response = await api.patch(`/exchanges/${id}`, { status });
    return response.data;
  },
};
