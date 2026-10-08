const StudySession = require('../models/StudySession');

// @route GET /api/study-sessions
exports.getSessions = async (req, res, next) => {
    try {
        const sessions = await StudySession.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: sessions.length,
            sessions
        });
    } catch (err) {
        next(err);
    }
};

// @route POST /api/study-sessions
exports.createSession = async (req, res, next) => {
    try {
        const { duration, title, mode, subjectId, startTime, endTime } = req.body;

        const session = await StudySession.create({
            userId: req.userId,
            subjectId: subjectId || null,
            title: title ? title.trim() : 'Focus Pomodoro Session',
            duration: duration ? Number(duration) : 25,
            mode: mode || 'focus',
            status: 'completed',
            startTime: startTime ? new Date(startTime) : new Date(Date.now() - (duration || 25) * 60000),
            endTime: endTime ? new Date(endTime) : new Date()
        });

        res.status(201).json({
            success: true,
            session
        });
    } catch (err) {
        next(err);
    }
};
