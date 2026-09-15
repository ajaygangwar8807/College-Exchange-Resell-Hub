import api from './api';

export const orderService = {
  createOrder: async (productId) => {
    const response = await api.post('/orders', { productId });
    return response.data;
  },

  getMyOrders: async (role = '') => {
    const response = await api.get('/orders', { params: { role } });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}`, { status });
    return response.data;
  },
};
