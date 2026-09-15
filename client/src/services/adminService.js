import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  toggleBlockUser: async (id, isBlocked) => {
    const response = await api.patch(`/admin/users/${id}/block`, { isBlocked });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getProducts: async (params = {}) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  updateProductStatus: async (id, status) => {
    const response = await api.patch(`/admin/products/${id}/status`, { status });
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },

  getExchanges: async () => {
    const response = await api.get('/admin/exchanges');
    return response.data;
  },

  getInquiries: async () => {
    const response = await api.get('/admin/inquiries');
    return response.data;
  },

  getReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  },

  updateReportStatus: async (id, status, action) => {
    const response = await api.patch(`/admin/reports/${id}/status`, { status, action });
    return response.data;
  },

  updateAdminProfile: async (profileData) => {
    const response = await api.patch('/admin/profile', profileData);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.patch(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
