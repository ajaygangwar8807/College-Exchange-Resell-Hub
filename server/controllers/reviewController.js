const Review = require('../models/Review');
const Order = require('../models/Order');

// @desc    Create a seller review (Only for completed orders)
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    if (!orderId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, rating (1-5), and review comment are required',
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Business Rule 10: Only completed transactions can be reviewed
    if (order.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted after an order status is completed',
      });
    }

    // Must be the buyer of the order
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only the buyer of this order can write a seller review',
      });
    }

    // Business Rule 11: Prevent duplicate reviews for the same order
    const existingReview = await Review.findOne({ order: orderId });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this completed order',
      });
    }

    const review = await Review.create({
      reviewer: req.user._id,
      seller: order.seller,
      order: order._id,
      rating: Number(rating),
      comment,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name profileImage college course')
      .populate('seller', 'name email');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: populatedReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for a seller
// @route   GET /api/reviews/seller/:sellerId
// @access  Public
const getSellerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ seller: req.params.sellerId })
      .populate('reviewer', 'name profileImage college course year')
      .sort({ createdAt: -1 });

    const total = reviews.length;
    const avgRating = total > 0 ? (reviews.reduce((acc, item) => acc + item.rating, 0) / total).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        reviews,
        total,
        avgRating: Number(avgRating),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReview,
  getSellerReviews,
};
