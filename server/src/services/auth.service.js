const jwt = require('jsonwebtoken');
const User = require('../models/User');
const DonorProfile = require('../models/DonorProfile');
const Hospital = require('../models/Hospital');
const { JWT_SECRET } = require('../middleware/auth.middleware');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (userData) => {
  const { name, email, password, role, phone } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists with this email address');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'donor',
    phone: phone || '',
  });

  // Automatically create linked domain entity based on role
  if (user.role === 'donor') {
    await DonorProfile.create({
      user: user._id,
      bloodGroup: 'O+', // Default blood group until updated by user
      contactNumber: user.phone || '',
      location: {
        type: 'Point',
        coordinates: [77.2090, 28.6139],
      },
    });
  } else if (user.role === 'hospital') {
    await Hospital.create({
      user: user._id,
      name: `${user.name} Medical Center`,
      phone: user.phone || '',
      location: {
        type: 'Point',
        coordinates: [77.2090, 28.6139],
      },
    });
  }

  const token = generateToken(user._id);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    token,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    token,
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  let profile = null;
  if (user.role === 'donor') {
    profile = await DonorProfile.findOne({ user: user._id });
  } else if (user.role === 'hospital') {
    profile = await Hospital.findOne({ user: user._id });
  }

  return {
    user,
    profile,
  };
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
