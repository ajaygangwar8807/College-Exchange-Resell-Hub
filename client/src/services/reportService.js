import api from './api';

export const reportService = {
  createReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  getMyReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },
};
