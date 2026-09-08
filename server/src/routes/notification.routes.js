const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/my', protect, notificationController.getMyNotifications);
router.patch('/:id/read', protect, notificationController.markRead);

module.exports = router;
