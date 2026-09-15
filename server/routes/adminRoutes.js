const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Protect all admin endpoints with protect + admin middleware
router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);

router.get('/products', getAdminProducts);
router.patch('/products/:id/status', updateProductStatus);

router.get('/orders', getAdminOrders);
router.get('/exchanges', getAdminExchanges);
router.get('/inquiries', getAdminInquiries);

router.get('/reports', getAdminReports);
router.patch('/reports/:id/status', updateReportStatus);

router.patch('/profile', updateAdminProfile);

module.exports = router;
