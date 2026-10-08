const Feedback = require('../models/Feedback');

/**
 * @desc    Get all feedback entries for the authenticated student
 * @route   GET /api/feedback
 * @access  Private
 */
exports.getFeedbacks = async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: feedbacks.length,
            feedbacks
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get a single feedback entry by ID (must belong to authenticated student)
 * @route   GET /api/feedback/:id
 * @access  Private
 */
exports.getFeedbackById = async (req, res, next) => {
    try {
        const feedback = await Feedback.findOne({ _id: req.params.id, userId: req.userId });
        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback entry not found or access denied.'
            });
        }
        res.status(200).json({
            success: true,
            feedback
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Submit new student feedback
 * @route   POST /api/feedback
 * @access  Private
 */
exports.createFeedback = async (req, res, next) => {
    try {
        const { type, title, message, rating } = req.body;

        // Validation
        const validTypes = ['Suggestion', 'Bug / Issue', 'Feature Request', 'General Feedback'];
        if (!type || !validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: `Feedback type must be one of: ${validTypes.join(', ')}`
            });
        }

        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Feedback title is required.'
            });
        }

        if (title.trim().length > 150) {
            return res.status(400).json({
                success: false,
                message: 'Title cannot exceed 150 characters.'
            });
        }

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Feedback message is required.'
            });
        }

        if (message.trim().length > 2000) {
            return res.status(400).json({
                success: false,
                message: 'Message cannot exceed 2000 characters.'
            });
        }

        let parsedRating = null;
        if (rating !== undefined && rating !== null && rating !== '') {
            const numRating = Number(rating);
            if (isNaN(numRating) || !Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be an integer between 1 and 5.'
                });
            }
            parsedRating = numRating;
        }

        const feedback = await Feedback.create({
            userId: req.userId,
            type,
            title: title.trim(),
            message: message.trim(),
            rating: parsedRating,
            status: 'submitted'
        });

        res.status(201).json({
            success: true,
            message: 'Thank you! Your feedback has been submitted successfully.',
            feedback
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Delete a feedback entry
 * @route   DELETE /api/feedback/:id
 * @access  Private
 */
exports.deleteFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback entry not found or access denied.'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Feedback entry deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
};
