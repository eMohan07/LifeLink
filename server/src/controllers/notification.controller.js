const notificationService = require('../services/notification.service');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user._id);
    return sendSuccess(res, 'User notifications retrieved', notifications);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const markRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);
    return sendSuccess(res, 'Notification marked as read', notification);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

module.exports = {
  getMyNotifications,
  markRead,
};
