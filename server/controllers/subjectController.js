const Subject = require('../models/Subject');

// @route GET /api/subjects
exports.getSubjects = async (req, res, next) => {
    try {
        const subjects = await Subject.find({ userId: req.userId }).sort({ createdAt: 1 });
        res.status(200).json({
            success: true,
            count: subjects.length,
            subjects
        });
    } catch (err) {
        next(err);
    }
};

// @route GET /api/subjects/:id
exports.getSubjectById = async (req, res, next) => {
    try {
        const subject = await Subject.findOne({ _id: req.params.id, userId: req.userId });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found or access denied.'
            });
        }
        res.status(200).json({
            success: true,
            subject
        });
    } catch (err) {
        next(err);
    }
};

// @route POST /api/subjects
exports.createSubject = async (req, res, next) => {
    try {
        const { name, progress, targetProgress, category, dailyHours, targetMarks } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Subject name is required.'
            });
        }

        const subject = await Subject.create({
            userId: req.userId,
            name: name.trim(),
            progress: progress !== undefined ? Math.min(100, Math.max(0, Number(progress))) : 0,
            targetProgress: targetProgress !== undefined ? Math.min(100, Math.max(0, Number(targetProgress))) : 100,
            category: category ? category.trim() : 'webtech',
            dailyHours: dailyHours !== undefined ? Number(dailyHours) : 2,
            targetMarks: targetMarks !== undefined ? Number(targetMarks) : 85
        });

        res.status(201).json({
            success: true,
            subject
        });
    } catch (err) {
        next(err);
    }
};

// @route PUT /api/subjects/:id
exports.updateSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findOne({ _id: req.params.id, userId: req.userId });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found or access denied.'
            });
        }

        const { name, progress, targetProgress, category, dailyHours, targetMarks } = req.body;

        if (name !== undefined) subject.name = name.trim();
        if (progress !== undefined) subject.progress = Math.min(100, Math.max(0, Number(progress)));
        if (targetProgress !== undefined) subject.targetProgress = Math.min(100, Math.max(0, Number(targetProgress)));
        if (category !== undefined) subject.category = category.trim();
        if (dailyHours !== undefined) subject.dailyHours = Number(dailyHours);
        if (targetMarks !== undefined) subject.targetMarks = Number(targetMarks);

        await subject.save();

        res.status(200).json({
            success: true,
            subject
        });
    } catch (err) {
        next(err);
    }
};

// @route DELETE /api/subjects/:id
exports.deleteSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found or access denied.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subject deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
};

// @route PATCH /api/subjects/:id/progress
exports.updateProgress = async (req, res, next) => {
    try {
        const { progress } = req.body;
        if (progress === undefined || isNaN(progress)) {
            return res.status(400).json({
                success: false,
                message: 'Valid progress number (0-100) is required.'
            });
        }

        const subject = await Subject.findOne({ _id: req.params.id, userId: req.userId });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found or access denied.'
            });
        }

        subject.progress = Math.min(100, Math.max(0, Number(progress)));
        await subject.save();

        res.status(200).json({
            success: true,
            subject
        });
    } catch (err) {
        next(err);
    }
};
