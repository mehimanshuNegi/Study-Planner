/**
 * Study Planner — Focus Session & Pomodoro API Service
 */

const sessionService = {
    async getSessions() {
        const res = await apiClient.get('/api/study-sessions');
        return res.sessions || [];
    },

    async recordSession(duration = 25, title = 'Focus Session', mode = 'focus', subjectId = null) {
        const res = await apiClient.post('/api/study-sessions', {
            duration,
            title,
            mode,
            subjectId
        });
        return res.session;
    }
};

window.sessionService = sessionService;
