const analyticsService = require('../services/analytics.service');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getSystemAnalytics();
    return sendSuccess(res, 'Analytics data fetched', data);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getAnalytics,
};
