const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new student user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, phone, college, course, year } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and password',
    });
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email address already exists',
    });
  }

  // FORCE role to student regardless of body input (Security Requirement)
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone: phone || '',
    college: college || 'Main Campus',
    course: course || 'BCA',
    year: year || '3rd Year',
    role: 'student',
    isBlocked: false,
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        course: user.course,
        year: user.year,
        profileImage: user.profileImage,
        role: user.role,
        isBlocked: user.isBlocked,
        token: generateToken(user._id, user.role),
      },
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid user data provided',
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (user && (await user.matchPassword(password))) {
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by campus administration',
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        course: user.course,
        year: user.year,
        profileImage: user.profileImage,
        role: user.role,
        isBlocked: user.isBlocked,
        token: generateToken(user._id, user.role),
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid email address or password',
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      success: true,
      data: user,
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
};

// @desc    Update user profile
// @route   PATCH /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.college = req.body.college || user.college;
    user.course = req.body.course || user.course;
    user.year = req.body.year || user.year;
    user.profileImage = req.body.profileImage || user.profileImage;

    if (req.body.preferences) {
      user.preferences = { ...user.preferences, ...req.body.preferences };
    }

    // Role & isBlocked CANNOT be modified via profile update endpoint
    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        college: updatedUser.college,
        course: updatedUser.course,
        year: updatedUser.year,
        profileImage: updatedUser.profileImage,
        role: updatedUser.role,
        isBlocked: updatedUser.isBlocked,
        token: generateToken(updatedUser._id, updatedUser.role),
      },
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
};

// @desc    Change user password
// @route   PATCH /api/auth/change-password
// @access  Private
const changeUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current and new password',
    });
  }

  const user = await User.findById(req.user._id).select('+password');

  if (user && (await user.matchPassword(currentPassword))) {
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Incorrect current password',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
};
