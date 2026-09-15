const Report = require('../models/Report');

// @desc    Submit a report for suspicious product/user
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  try {
    const { productId, reportedUserId, reason, description } = req.body;

    if (!reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reason and description for report',
      });
    }

    const report = await Report.create({
      reporter: req.user._id,
      product: productId || null,
      reportedUser: reportedUserId || null,
      reason,
      description,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully to campus moderators',
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's submitted reports
// @route   GET /api/reports
// @access  Private
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user._id })
      .populate('product', 'title price images')
      .populate('reportedUser', 'name email college')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReport,
  getMyReports,
};
