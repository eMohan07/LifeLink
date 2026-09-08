const aiService = require('../services/ai.service');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const generateInsight = async (req, res) => {
  try {
    const { prompt } = req.body;
    const insight = await aiService.generateSystemInsight(prompt);
    return sendSuccess(res, 'AI Insight generated successfully', insight, 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getInsights = async (req, res) => {
  try {
    const insights = await aiService.getLatestInsights();
    return sendSuccess(res, 'AI Insights history fetched', insights);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  generateInsight,
  getInsights,
};
