const Category = require('../models/Category');
const slugify = require('slugify');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.json({
    success: true,
    data: categories,
  });
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    res.json({ success: true, data: category });
  } else {
    res.status(404).json({ success: false, message: 'Category not found' });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  const { name, description, icon } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  const existing = await Category.findOne({ name });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Category name already exists' });
  }

  const slug = slugify(name, { lower: true });
  const category = await Category.create({
    name,
    slug,
    description: description || '',
    icon: icon || 'BookOpen',
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  });
};

// @desc    Update category
// @route   PATCH /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  category.name = req.body.name || category.name;
  if (req.body.name) {
    category.slug = slugify(req.body.name, { lower: true });
  }
  category.description = req.body.description !== undefined ? req.body.description : category.description;
  category.icon = req.body.icon || category.icon;
  if (req.body.isActive !== undefined) {
    category.isActive = req.body.isActive;
  }

  const updatedCategory = await category.save();
  res.json({
    success: true,
    message: 'Category updated successfully',
    data: updatedCategory,
  });
};

// @desc    Delete category (soft deactivate)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  category.isActive = false;
  await category.save();

  res.json({
    success: true,
    message: 'Category deactivated successfully to preserve item history',
  });
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
