const Task = require('../models/Task');
const Subject = require('../models/Subject');
const Goal = require('../models/Goal');
const StudySession = require('../models/StudySession');
const StudyPlan = require('../models/StudyPlan');
const Note = require('../models/Note');

// @route GET /api/dashboard/stats
exports.getDashboardStats = async (req, res, next) => {
    try {
        const userId = req.userId;

        // 1. Task metrics
        const totalTasks = await Task.countDocuments({ userId });
        const completedTasks = await Task.countDocuments({ userId, completed: true });
        const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // 2. Study Time from completed sessions
        const sessions = await StudySession.find({ userId, status: 'completed' });
        const totalStudyMinutes = sessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
        const hours = Math.floor(totalStudyMinutes / 60);
        const mins = totalStudyMinutes % 60;
        const studyTimeFormatted = `${hours}h ${mins < 10 ? '0' : ''}${mins}m`;

        // Daily target comparison (default 5h or user studyGoal)
        const targetHours = Number(req.user.studyGoal) > 0 ? Math.round(Number(req.user.studyGoal) / 5) : 5;
        const targetMinutes = targetHours * 60;
        const studyTimePercent = targetMinutes > 0 ? Math.min(100, Math.round((totalStudyMinutes / targetMinutes) * 100)) : 0;

        // 3. Subjects
        const subjects = await Subject.find({ userId });
        const subjectsCount = subjects.length;
        const subjectsStudiedNames = subjects.slice(0, 3).map(s => s.name).join(', ') || 'None yet';

        // 4. Weekly Progress (average of tasks completion and goal progress)
        const goals = await Goal.find({ userId });
        let avgGoalProgress = 0;
        if (goals.length > 0) {
            const sumGoalPct = goals.reduce((acc, g) => acc + (g.progressPercent || 0), 0);
            avgGoalProgress = Math.round(sumGoalPct / goals.length);
        }
        const weeklyProgress = totalTasks > 0 && goals.length > 0
            ? Math.round((taskPercent + avgGoalProgress) / 2)
            : (totalTasks > 0 ? taskPercent : (goals.length > 0 ? avgGoalProgress : 0));

        // 5. Deadlines from tasks and goals
        const upcomingTasks = await Task.find({
            userId,
            completed: false
        }).sort({ dueDate: 1 }).limit(5);

        const upcomingGoals = await Goal.find({
            userId,
            status: { $ne: 'completed' }
        }).sort({ createdAt: -1 }).limit(3);

        const deadlines = [];
        upcomingTasks.forEach(t => {
            deadlines.push({
                id: t._id,
                title: t.title,
                subtext: `${t.subject} • Task Deadline`,
                date: t.dueDate,
                type: 'task'
            });
        });
        upcomingGoals.forEach(g => {
            deadlines.push({
                id: g._id,
                title: g.title,
                subtext: `${g.target} • Goal Deadline`,
                date: g.deadline,
                type: 'goal'
            });
        });

        // 6. Recent Notes
        const notesCount = await Note.countDocuments({ userId });

        res.status(200).json({
            success: true,
            stats: {
                tasks: {
                    total: totalTasks,
                    completed: completedTasks,
                    pending: totalTasks - completedTasks,
                    percent: taskPercent
                },
                studyTime: {
                    totalMinutes: totalStudyMinutes,
                    formatted: studyTimeFormatted,
                    targetFormatted: `${targetHours}h 00m`,
                    percent: studyTimePercent
                },
                subjects: {
                    count: subjectsCount,
                    summary: subjectsStudiedNames,
                    items: subjects
                },
                weeklyProgress: {
                    percent: weeklyProgress
                },
                deadlines,
                notesCount
            }
        });
    } catch (err) {
        next(err);
    }
};
