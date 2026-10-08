/**
 * Study Planner — Goal API Service
 */

const goalService = {
    async getGoals(status) {
        let query = status ? `?status=${encodeURIComponent(status)}` : '';
        const res = await apiClient.get(`/api/goals${query}`);
        return res.goals || [];
    },

    async getGoalById(id) {
        const res = await apiClient.get(`/api/goals/${id}`);
        return res.goal;
    },

    async createGoal(data) {
        const res = await apiClient.post('/api/goals', data);
        return res.goal;
    },

    async updateGoal(id, data) {
        const res = await apiClient.put(`/api/goals/${id}`, data);
        return res.goal;
    },

    async deleteGoal(id) {
        return apiClient.delete(`/api/goals/${id}`);
    },

    async updateProgress(id, progressPercent, currentProgress) {
        const res = await apiClient.patch(`/api/goals/${id}/progress`, { progressPercent, currentProgress });
        return res.goal;
    }
};

window.goalService = goalService;
