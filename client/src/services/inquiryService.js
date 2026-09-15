import api from './api';

export const inquiryService = {
  createInquiry: async (productId, message) => {
    const response = await api.post('/inquiries', { productId, message });
    return response.data;
  },

  getMyInquiries: async () => {
    const response = await api.get('/inquiries');
    return response.data;
  },

  updateInquiryStatus: async (id, status) => {
    const response = await api.patch(`/inquiries/${id}`, { status });
    return response.data;
  },
};
