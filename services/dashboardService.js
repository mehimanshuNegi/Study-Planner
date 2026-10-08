/**
 * Study Planner — Dashboard Statistics API Service
 */

const dashboardService = {
    async getStats() {
        const res = await apiClient.get('/api/dashboard/stats');
        return res.stats;
    }
};

window.dashboardService = dashboardService;
