const express = require('express');
const router = express.Router();
const { createReport, getMyReports } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReport);
router.get('/', protect, getMyReports);

module.exports = router;
