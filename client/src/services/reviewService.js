import api from './api';

export const reviewService = {
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  getSellerReviews: async (sellerId) => {
    const response = await api.get(`/reviews/seller/${sellerId}`);
    return response.data;
  },
};
