const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create a purchase order (Academic Workflow)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Business Rule 4: User cannot purchase their own product
    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot place a purchase order on your own listing',
      });
    }

    // Business Rule 2: Sold/removed products cannot be purchased
    if (product.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `This item is currently ${product.status} and unavailable for purchase`,
      });
    }

    // Check for existing active pending order by this buyer for this product
    const existingOrder = await Order.findOne({
      buyer: req.user._id,
      product: productId,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active pending order for this product',
      });
    }

    const order = await Order.create({
      buyer: req.user._id,
      seller: product.seller,
      product: product._id,
      price: product.price,
      status: 'pending',
    });

    // Mark product status as reserved
    product.status = 'reserved';
    await product.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('product')
      .populate('buyer', 'name email phone college course year')
      .populate('seller', 'name email phone college course year');

    res.status(201).json({
      success: true,
      message: 'Purchase order created successfully! Waiting for seller confirmation.',
      data: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's orders (both buying & selling)
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const roleFilter = req.query.role; // 'buyer' or 'seller'
    let filter = {};

    if (roleFilter === 'buyer') {
      filter = { buyer: req.user._id };
    } else if (roleFilter === 'seller') {
      filter = { seller: req.user._id };
    } else {
      filter = { $or: [{ buyer: req.user._id }, { seller: req.user._id }] };
    }

    const orders = await Order.find(filter)
      .populate('product')
      .populate('buyer', 'name email phone college profileImage')
      .populate('seller', 'name email phone college profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product')
      .populate('buyer', 'name email phone college course year profileImage')
      .populate('seller', 'name email phone college course year profileImage');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authorization check
    if (
      order.buyer._id.toString() !== req.user._id.toString() &&
      order.seller._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied to this order' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (confirm, complete, cancel)
// @route   PATCH /api/orders/:id
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isBuyer = order.buyer.toString() === req.user._id.toString();
    const isSeller = order.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status transition' });
    }

    order.status = status;

    if (status === 'completed') {
      order.completedAt = new Date();
      // Mark product as sold
      await Product.findByIdAndUpdate(order.product, { status: 'sold' });
    } else if (status === 'cancelled') {
      // Revert product to available
      await Product.findByIdAndUpdate(order.product, { status: 'available' });
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
