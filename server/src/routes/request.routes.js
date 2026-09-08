const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createRequestSchema, updateStatusSchema } = require('../validations/request.validation');

router.get('/', requestController.getRequests);
router.get('/my', protect, requestController.getMyRequests);
router.get('/:id', requestController.getRequestById);
router.get('/:id/matches', requestController.getMatches);
router.post('/', protect, validate(createRequestSchema), requestController.createRequest);
router.patch('/:id/status', protect, validate(updateStatusSchema), requestController.updateStatus);

module.exports = router;
