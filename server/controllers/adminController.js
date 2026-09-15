const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ExchangeRequest = require('../models/ExchangeRequest');
const Inquiry = require('../models/Inquiry');
const Report = require('../models/Report');
const Category = require('../models/Category');

// @desc    Get real MongoDB statistics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const blockedStudents = await User.countDocuments({ role: 'student', isBlocked: true });
    
    const totalProducts = await Product.countDocuments({});
    const activeProducts = await Product.countDocuments({ status: 'available' });
    const soldProducts = await Product.countDocuments({ status: 'sold' });
    const exchangedProducts = await Product.countDocuments({ status: 'exchanged' });
    const removedProducts = await Product.countDocuments({ status: 'removed' });

    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });

    const totalExchanges = await ExchangeRequest.countDocuments({});
    const pendingExchanges = await ExchangeRequest.countDocuments({ status: 'pending' });

    const totalInquiries = await Inquiry.countDocuments({});
    const pendingInquiries = await Inquiry.countDocuments({ status: 'pending' });

    const totalReports = await Report.countDocuments({});
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });

    const totalCategories = await Category.countDocuments({ isActive: true });

    // Recent activity log across system
    const recentOrders = await Order.find({})
      .populate('buyer', 'name')
      .populate('product', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentReports = await Report.find({})
      .populate('reporter', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalStudents,
        blockedStudents,
        totalProducts,
        activeProducts,
        soldProducts,
        exchangedProducts,
        removedProducts,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalExchanges,
        pendingExchanges,
        totalInquiries,
        pendingInquiries,
        totalReports,
        pendingReports,
        resolvedReports,
        totalCategories,
        recentOrders,
        recentReports,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const query = {};
    if (req.query.role) query.role = req.query.role;
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { college: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    if (req.query.status === 'blocked') query.isBlocked = true;
    if (req.query.status === 'active') query.isBlocked = false;

    const users = await User.find(query).sort({ createdAt: -1 });

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single user details & activity
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const listings = await Product.find({ seller: user._id });
    const orders = await Order.find({ $or: [{ buyer: user._id }, { seller: user._id }] }).populate('product');

    res.json({
      success: true,
      data: {
        user,
        listings,
        orders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Block or Unblock a user
// @route   PATCH /api/admin/users/:id/block
// @access  Private/Admin
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot block an administrator account' });
    }

    user.isBlocked = req.body.isBlocked !== undefined ? req.body.isBlocked : !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a student user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Business Rule 30: Admin cannot delete themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Student account deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all products for moderation
// @route   GET /api/admin/products
// @access  Private/Admin
const getAdminProducts = async (req, res) => {
  try {
    const query = {};
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    const products = await Product.find(query)
      .populate('seller', 'name email college phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Moderate product status (remove/restore)
// @route   PATCH /api/admin/products/:id/status
// @access  Private/Admin
const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ success: false, message: 'Product listing not found' });

    product.status = status;
    await product.save();

    res.json({
      success: true,
      message: `Product listing status changed to ${status}`,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders for admin management
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('product')
      .populate('buyer', 'name email college')
      .populate('seller', 'name email college')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all exchange requests for admin
// @route   GET /api/admin/exchanges
// @access  Private/Admin
const getAdminExchanges = async (req, res) => {
  try {
    const exchanges = await ExchangeRequest.find({})
      .populate('requestedProduct')
      .populate('offeredProduct')
      .populate('requester', 'name email college')
      .populate('owner', 'name email college')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: exchanges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all inquiries for admin
// @route   GET /api/admin/inquiries
// @access  Private/Admin
const getAdminInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({})
      .populate('product')
      .populate('buyer', 'name email college')
      .populate('seller', 'name email college')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all user reports
// @route   GET /api/admin/reports
// @access  Private/Admin
const getAdminReports = async (req, res) => {
  try {
    const reports = await Report.find({})
      .populate('reporter', 'name email college')
      .populate('reportedUser', 'name email college isBlocked')
      .populate('product', 'title price status images')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update report status and optionally action moderation
// @route   PATCH /api/admin/reports/:id/status
// @access  Private/Admin
const updateReportStatus = async (req, res) => {
  try {
    const { status, action } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    report.status = status || report.status;
    await report.save();

    // Perform moderation action if specified
    if (action === 'block_user' && report.reportedUser) {
      await User.findByIdAndUpdate(report.reportedUser, { isBlocked: true });
    } else if (action === 'remove_product' && report.product) {
      await Product.findByIdAndUpdate(report.product, { status: 'removed' });
    }

    res.json({
      success: true,
      message: `Report status updated to ${report.status}`,
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update admin profile
// @route   PATCH /api/admin/profile
// @access  Private/Admin
const updateAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ success: false, message: 'Admin user not found' });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.profileImage = req.body.profileImage || user.profileImage;

    if (req.body.password) {
      user.password = req.body.password;
    }

    // Role MUST remain admin
    const updatedAdmin = await user.save();

    res.json({
      success: true,
      message: 'Admin profile updated successfully',
      data: {
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        phone: updatedAdmin.phone,
        role: updatedAdmin.role,
        profileImage: updatedAdmin.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  getUserById,
  toggleBlockUser,
  deleteUser,
  getAdminProducts,
  updateProductStatus,
  getAdminOrders,
  getAdminExchanges,
  getAdminInquiries,
  getAdminReports,
  updateReportStatus,
  updateAdminProfile,
};
