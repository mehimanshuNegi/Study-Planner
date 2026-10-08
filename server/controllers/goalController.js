const Goal = require('../models/Goal');

// @route GET /api/goals
exports.getGoals = async (req, res, next) => {
    try {
        const filter = { userId: req.userId };
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const goals = await Goal.find(filter).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: goals.length,
            goals
        });
    } catch (err) {
        next(err);
    }
};

// @route GET /api/goals/:id
exports.getGoalById = async (req, res, next) => {
    try {
        const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found or access denied.'
            });
        }
        res.status(200).json({
            success: true,
            goal
        });
    } catch (err) {
        next(err);
    }
};

// @route POST /api/goals
exports.createGoal = async (req, res, next) => {
    try {
        const { title, description, category, target, currentProgress, progressPercent, deadline, status } = req.body;

        if (!title || !title.trim() || !target || !target.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Goal title and target description are required.'
            });
        }

        const goal = await Goal.create({
            userId: req.userId,
            title: title.trim(),
            description: description ? description.trim() : '',
            category: category ? category.trim() : 'dsa',
            target: target.trim(),
            currentProgress: currentProgress ? currentProgress.trim() : '',
            progressPercent: progressPercent !== undefined ? Math.min(100, Math.max(0, Number(progressPercent))) : 0,
            deadline: deadline ? deadline.trim() : 'End of semester',
            status: status || 'active'
        });

        res.status(201).json({
            success: true,
            goal
        });
    } catch (err) {
        next(err);
    }
};

// @route PUT /api/goals/:id
exports.updateGoal = async (req, res, next) => {
    try {
        const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found or access denied.'
            });
        }

        const { title, description, category, target, currentProgress, progressPercent, deadline, status } = req.body;

        if (title !== undefined) goal.title = title.trim();
        if (description !== undefined) goal.description = description.trim();
        if (category !== undefined) goal.category = category.trim();
        if (target !== undefined) goal.target = target.trim();
        if (currentProgress !== undefined) goal.currentProgress = currentProgress.trim();
        if (progressPercent !== undefined) goal.progressPercent = Math.min(100, Math.max(0, Number(progressPercent)));
        if (deadline !== undefined) goal.deadline = deadline.trim();
        if (status !== undefined) goal.status = status;

        await goal.save();

        res.status(200).json({
            success: true,
            goal
        });
    } catch (err) {
        next(err);
    }
};

// @route DELETE /api/goals/:id
exports.deleteGoal = async (req, res, next) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found or access denied.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Goal deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
};

// @route PATCH /api/goals/:id/progress
exports.updateGoalProgress = async (req, res, next) => {
    try {
        const { progressPercent, currentProgress } = req.body;

        const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found or access denied.'
            });
        }

        if (progressPercent !== undefined) {
            goal.progressPercent = Math.min(100, Math.max(0, Number(progressPercent)));
            if (goal.progressPercent === 100) {
                goal.status = 'completed';
            }
        }
        if (currentProgress !== undefined) {
            goal.currentProgress = currentProgress.trim();
        }

        await goal.save();

        res.status(200).json({
            success: true,
            goal
        });
    } catch (err) {
        next(err);
    }
};
