const ExchangeRequest = require('../models/ExchangeRequest');
const Product = require('../models/Product');

// @desc    Create exchange request
// @route   POST /api/exchanges
// @access  Private
const createExchangeRequest = async (req, res) => {
  try {
    const { requestedProductId, offeredProductId, message } = req.body;

    if (!requestedProductId || !offeredProductId) {
      return res.status(400).json({
        success: false,
        message: 'Please specify both requested item and offered item',
      });
    }

    const requestedProduct = await Product.findById(requestedProductId);
    const offeredProduct = await Product.findById(offeredProductId);

    if (!requestedProduct || !offeredProduct) {
      return res.status(404).json({ success: false, message: 'One or both products not found' });
    }

    // Business Rule 6: Users cannot exchange products they do not own
    if (offeredProduct.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only offer products that you own',
      });
    }

    // Cannot request own product
    if (requestedProduct.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot initiate an exchange request for your own product',
      });
    }

    if (requestedProduct.status !== 'available' || offeredProduct.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Both products must be available for exchange',
      });
    }

    const exchange = await ExchangeRequest.create({
      requester: req.user._id,
      owner: requestedProduct.seller,
      requestedProduct: requestedProduct._id,
      offeredProduct: offeredProduct._id,
      message: message || '',
      status: 'pending',
    });

    const populatedExchange = await ExchangeRequest.findById(exchange._id)
      .populate('requestedProduct')
      .populate('offeredProduct')
      .populate('requester', 'name email phone college profileImage')
      .populate('owner', 'name email phone college profileImage');

    res.status(201).json({
      success: true,
      message: 'Exchange request sent successfully!',
      data: populatedExchange,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's exchange requests (sent & received)
// @route   GET /api/exchanges
// @access  Private
const getMyExchanges = async (req, res) => {
  try {
    const exchanges = await ExchangeRequest.find({
      $or: [{ requester: req.user._id }, { owner: req.user._id }],
    })
      .populate('requestedProduct')
      .populate('offeredProduct')
      .populate('requester', 'name email phone college profileImage')
      .populate('owner', 'name email phone college profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: exchanges,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single exchange request by ID
// @route   GET /api/exchanges/:id
// @access  Private
const getExchangeById = async (req, res) => {
  try {
    const exchange = await ExchangeRequest.findById(req.params.id)
      .populate('requestedProduct')
      .populate('offeredProduct')
      .populate('requester', 'name email phone college profileImage')
      .populate('owner', 'name email phone college profileImage');

    if (!exchange) {
      return res.status(404).json({ success: false, message: 'Exchange request not found' });
    }

    if (
      exchange.requester._id.toString() !== req.user._id.toString() &&
      exchange.owner._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }

    res.json({ success: true, data: exchange });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update exchange request status (accept, reject, cancel, complete)
// @route   PATCH /api/exchanges/:id
// @access  Private
const updateExchangeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const exchange = await ExchangeRequest.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({ success: false, message: 'Exchange request not found' });
    }

    const isRequester = exchange.requester.toString() === req.user._id.toString();
    const isOwner = exchange.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isRequester && !isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }

    if (!['pending', 'accepted', 'rejected', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid exchange status' });
    }

    exchange.status = status;

    if (status === 'completed') {
      // Update both items' status to 'exchanged'
      await Product.findByIdAndUpdate(exchange.requestedProduct, { status: 'exchanged' });
      await Product.findByIdAndUpdate(exchange.offeredProduct, { status: 'exchanged' });
    }

    const updatedExchange = await exchange.save();

    res.json({
      success: true,
      message: `Exchange request updated to ${status}`,
      data: updatedExchange,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createExchangeRequest,
  getMyExchanges,
  getExchangeById,
  updateExchangeStatus,
};
