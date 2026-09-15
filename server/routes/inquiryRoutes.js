const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getMyInquiries,
  updateInquiryStatus,
} = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createInquiry);
router.get('/', protect, getMyInquiries);
router.patch('/:id', protect, updateInquiryStatus);

module.exports = router;
