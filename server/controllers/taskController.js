const Task = require('../models/Task');

// @route GET /api/tasks
exports.getTasks = async (req, res, next) => {
    try {
        const filter = { userId: req.userId };

        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.completed !== undefined) {
            filter.completed = req.query.completed === 'true';
        }
        if (req.query.priority) {
            filter.priority = req.query.priority;
        }
        if (req.query.category) {
            filter.category = req.query.category;
        }

        const tasks = await Task.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });
    } catch (err) {
        next(err);
    }
};

// @route GET /api/tasks/:id
exports.getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or access denied.'
            });
        }

        res.status(200).json({
            success: true,
            task
        });
    } catch (err) {
        next(err);
    }
};

// @route POST /api/tasks
exports.createTask = async (req, res, next) => {
    try {
        const { title, description, subject, category, priority, dueDate, completed } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Task title is required.'
            });
        }

        const task = await Task.create({
            userId: req.userId,
            title: title.trim(),
            description: description ? description.trim() : '',
            subject: subject ? subject.trim() : 'General',
            category: category ? category.trim() : 'dsa',
            priority: priority || 'Medium',
            dueDate: dueDate || new Date().toISOString().split('T')[0],
            completed: Boolean(completed)
        });

        res.status(201).json({
            success: true,
            task
        });
    } catch (err) {
        next(err);
    }
};

// @route PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or access denied.'
            });
        }

        const { title, description, subject, category, priority, dueDate, completed } = req.body;
        if (title !== undefined) task.title = title.trim();
        if (description !== undefined) task.description = description.trim();
        if (subject !== undefined) task.subject = subject.trim();
        if (category !== undefined) task.category = category.trim();
        if (priority !== undefined) task.priority = priority;
        if (dueDate !== undefined) task.dueDate = dueDate;
        if (completed !== undefined) {
            task.completed = Boolean(completed);
            task.status = task.completed ? 'completed' : 'pending';
            task.completedAt = task.completed ? new Date() : null;
        }

        await task.save();

        res.status(200).json({
            success: true,
            task
        });
    } catch (err) {
        next(err);
    }
};

// @route DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or access denied.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
};

// @route PATCH /api/tasks/:id/complete
exports.toggleTaskComplete = async (req, res, next) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or access denied.'
            });
        }

        if (req.body && req.body.completed !== undefined) {
            task.completed = Boolean(req.body.completed);
        } else {
            task.completed = !task.completed;
        }

        task.status = task.completed ? 'completed' : 'pending';
        task.completedAt = task.completed ? new Date() : null;

        await task.save();

        res.status(200).json({
            success: true,
            task
        });
    } catch (err) {
        next(err);
    }
};
