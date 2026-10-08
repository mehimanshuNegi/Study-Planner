const StudyPlan = require('../models/StudyPlan');

// @route GET /api/study-plan
exports.getStudyPlans = async (req, res, next) => {
    try {
        const filter = { userId: req.userId };
        if (req.query.dayOfWeek) {
            filter.dayOfWeek = req.query.dayOfWeek;
        }

        const plans = await StudyPlan.find(filter).sort({ startTime: 1, createdAt: 1 });

        // Group by day for convenience if requested
        if (req.query.grouped === 'true') {
            const grouped = {
                mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: []
            };
            plans.forEach(p => {
                if (grouped[p.dayOfWeek]) {
                    grouped[p.dayOfWeek].push(p);
                }
            });
            return res.status(200).json({
                success: true,
                count: plans.length,
                schedule: grouped
            });
        }

        res.status(200).json({
            success: true,
            count: plans.length,
            plans
        });
    } catch (err) {
        next(err);
    }
};

// @route GET /api/study-plan/:id
exports.getStudyPlanById = async (req, res, next) => {
    try {
        const plan = await StudyPlan.findOne({ _id: req.params.id, userId: req.userId });
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Study plan slot not found or access denied.'
            });
        }
        res.status(200).json({
            success: true,
            plan
        });
    } catch (err) {
        next(err);
    }
};

// @route POST /api/study-plan
exports.createStudyPlan = async (req, res, next) => {
    try {
        const { title, dayOfWeek, startTime, endTime, timeRange, category, tag, type, priority, target, subjectId } = req.body;

        if (!title || !title.trim() || !dayOfWeek) {
            return res.status(400).json({
                success: false,
                message: 'Session title and day of week are required.'
            });
        }

        const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        if (!validDays.includes(dayOfWeek.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid day of week. Must be one of: mon, tue, wed, thu, fri, sat, sun.'
            });
        }

        const formattedTimeRange = timeRange || `${startTime || '09:00'} – ${endTime || '10:00'}`;

        const plan = await StudyPlan.create({
            userId: req.userId,
            subjectId: subjectId || null,
            title: title.trim(),
            dayOfWeek: dayOfWeek.toLowerCase(),
            startTime: startTime || '09:00',
            endTime: endTime || '10:00',
            timeRange: formattedTimeRange,
            category: category || 'dsa',
            tag: tag || 'Coding Practice',
            type: type || 'regular',
            priority: priority || 'Medium',
            target: target || ''
        });

        res.status(201).json({
            success: true,
            plan
        });
    } catch (err) {
        next(err);
    }
};

// @route PUT /api/study-plan/:id
exports.updateStudyPlan = async (req, res, next) => {
    try {
        const plan = await StudyPlan.findOne({ _id: req.params.id, userId: req.userId });
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Study plan slot not found or access denied.'
            });
        }

        const { title, dayOfWeek, startTime, endTime, timeRange, category, tag, type, priority, target, subjectId } = req.body;

        if (title !== undefined) plan.title = title.trim();
        if (dayOfWeek !== undefined) plan.dayOfWeek = dayOfWeek.toLowerCase();
        if (startTime !== undefined) plan.startTime = startTime;
        if (endTime !== undefined) plan.endTime = endTime;
        if (timeRange !== undefined) {
            plan.timeRange = timeRange;
        } else if (startTime || endTime) {
            plan.timeRange = `${plan.startTime} – ${plan.endTime}`;
        }
        if (category !== undefined) plan.category = category;
        if (tag !== undefined) plan.tag = tag;
        if (type !== undefined) plan.type = type;
        if (priority !== undefined) plan.priority = priority;
        if (target !== undefined) plan.target = target;
        if (subjectId !== undefined) plan.subjectId = subjectId || null;

        await plan.save();

        res.status(200).json({
            success: true,
            plan
        });
    } catch (err) {
        next(err);
    }
};

// @route DELETE /api/study-plan/:id
exports.deleteStudyPlan = async (req, res, next) => {
    try {
        const plan = await StudyPlan.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Study plan slot not found or access denied.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Study plan slot deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
};
