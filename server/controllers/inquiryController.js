const Inquiry = require('../models/Inquiry');
const Product = require('../models/Product');

// @desc    Send an inquiry to product seller
// @route   POST /api/inquiries
// @access  Private
const createInquiry = async (req, res) => {
  try {
    const { productId, message } = req.body;

    if (!productId || !message) {
      return res.status(400).json({ success: false, message: 'Product ID and message are required' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Business Rule 5: User cannot inquire about own product
    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send an inquiry for your own product listing',
      });
    }

    const inquiry = await Inquiry.create({
      buyer: req.user._id,
      seller: product.seller,
      product: product._id,
      message,
      status: 'pending',
    });

    const populatedInquiry = await Inquiry.findById(inquiry._id)
      .populate('product')
      .populate('buyer', 'name email phone college profileImage')
      .populate('seller', 'name email phone college profileImage');

    res.status(201).json({
      success: true,
      message: 'Inquiry sent to seller successfully',
      data: populatedInquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's inquiries (sent or received)
// @route   GET /api/inquiries
// @access  Private
const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }],
    })
      .populate('product')
      .populate('buyer', 'name email phone college course profileImage')
      .populate('seller', 'name email phone college course profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inquiry status
// @route   PATCH /api/inquiries/:id
// @access  Private
const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    const isBuyer = inquiry.buyer.toString() === req.user._id.toString();
    const isSeller = inquiry.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }

    if (!['pending', 'accepted', 'rejected', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid inquiry status' });
    }

    inquiry.status = status;
    const updatedInquiry = await inquiry.save();

    res.json({
      success: true,
      message: `Inquiry status updated to ${status}`,
      data: updatedInquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createInquiry,
  getMyInquiries,
  updateInquiryStatus,
};
