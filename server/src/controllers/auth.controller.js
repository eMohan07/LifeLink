const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendSuccess(res, 'Registration successful', result, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    return sendSuccess(res, 'Login successful', result, 200);
  } catch (error) {
    return sendError(res, error.message, 401);
  }
};

const getMe = async (req, res) => {
  try {
    const result = await authService.getCurrentUser(req.user._id);
    return sendSuccess(res, 'User profile retrieved', result, 200);
  } catch (error) {
    return sendError(res, error.message, 404);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
