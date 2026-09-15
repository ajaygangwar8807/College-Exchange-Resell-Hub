const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// @desc    Get all products (Search, Filter, Sort, Pagination)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = { status: 'available' };

    // Search by title/description
    if (req.query.keyword) {
      query.$or = [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { location: { $regex: req.query.keyword, $options: 'i' } },
      ];
    }

    // Category filter
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Condition filter
    if (req.query.condition && req.query.condition !== 'All') {
      query.condition = req.query.condition;
    }

    // Listing type filter
    if (req.query.listingType && req.query.listingType !== 'All') {
      query.listingType = req.query.listingType;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Sorting
    let sort = { createdAt: -1 }; // newest default
    if (req.query.sortBy === 'price_asc') sort = { price: 1 };
    if (req.query.sortBy === 'price_desc') sort = { price: -1 };
    if (req.query.sortBy === 'oldest') sort = { createdAt: 1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('seller', 'name email college phone profileImage course year')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: {
        products,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'name email college phone profileImage course year createdAt'
    );

    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404).json({ success: false, message: 'Product listing not found' });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid product ID' });
  }
};

// @desc    Create a product listing
// @route   POST /api/products
// @access  Private (Student)
const createProduct = async (req, res) => {
  try {
    const { title, description, category, price, condition, listingType, location, images } = req.body;

    if (!title || !description || !category || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, and condition',
      });
    }

    let imageUrls = [];

    // Handle Cloudinary upload if files exist
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (process.env.CLOUDINARY_CLOUD_NAME) {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = `data:${file.mimetype};base64,${b64}`;
          const uploadRes = await cloudinary.uploader.upload(dataURI, {
            folder: 'college_exchange_products',
          });
          imageUrls.push(uploadRes.secure_url);
        } else {
          // Fallback to base64 inline image URI if Cloudinary is unconfigured
          const b64 = Buffer.from(file.buffer).toString('base64');
          imageUrls.push(`data:${file.mimetype};base64,${b64}`);
        }
      }
    } else if (images && Array.isArray(images) && images.length > 0) {
      imageUrls = images;
    } else {
      imageUrls = ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'];
    }

    // DERIVE SELLER FROM JWT (Security Rule: Never trust seller ID from frontend)
    const product = await Product.create({
      seller: req.user._id,
      title,
      description,
      category,
      price: price ? Number(price) : 0,
      condition,
      images: imageUrls,
      listingType: listingType || 'sell',
      location: location || req.user.college || 'Campus',
      status: 'available',
    });

    const populatedProduct = await Product.findById(product._id).populate(
      'seller',
      'name email college phone profileImage'
    );

    res.status(201).json({
      success: true,
      message: 'Product listed successfully',
      data: populatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product listing
// @route   PATCH /api/products/:id
// @access  Private (Owner only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product listing not found' });
    }

    // Ownership check (Security Rule)
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit your own product listings',
      });
    }

    product.title = req.body.title || product.title;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
    product.condition = req.body.condition || product.condition;
    product.listingType = req.body.listingType || product.listingType;
    product.location = req.body.location || product.location;
    if (req.body.status) product.status = req.body.status;
    if (req.body.images) product.images = req.body.images;

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: 'Product listing updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete/Remove product listing (Soft delete)
// @route   DELETE /api/products/:id
// @access  Private (Owner or Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product listing not found' });
    }

    // Ownership or Admin check
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own product listings',
      });
    }

    product.status = 'removed';
    await product.save();

    res.json({
      success: true,
      message: 'Listing removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's listings
// @route   GET /api/products/my-listings
// @access  Private
const getMyListings = async (req, res) => {
  try {
    const listings = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: listings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyListings,
};
