const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middleware/auth');

// All feedback routes require authentication
router.use(auth);

router.route('/')
    .get(feedbackController.getFeedbacks)
    .post(feedbackController.createFeedback);

router.route('/:id')
    .get(feedbackController.getFeedbackById)
    .delete(feedbackController.deleteFeedback);

module.exports = router;
