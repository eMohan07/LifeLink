const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimiter');

// Protect all AI routes with strict rate limiter
router.use(aiLimiter);

router.get('/insights', aiController.getInsights);
router.post('/insights', protect, aiController.generateInsight);

module.exports = router;
