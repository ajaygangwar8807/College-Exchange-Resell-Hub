const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyListings,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.get('/my-listings', protect, getMyListings);
router.get('/:id', getProductById);
router.post('/', protect, upload.array('images', 5), createProduct);
router.patch('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
