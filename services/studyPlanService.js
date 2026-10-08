/**
 * Study Planner — Study Plan & Timetable API Service
 */

const studyPlanService = {
    async getStudyPlans(dayOfWeek, grouped = false) {
        const params = new URLSearchParams();
        if (dayOfWeek) params.append('dayOfWeek', dayOfWeek);
        if (grouped) params.append('grouped', 'true');
        const qs = params.toString() ? `?${params.toString()}` : '';

        const res = await apiClient.get(`/api/study-plan${qs}`);
        return grouped ? res.schedule : (res.plans || []);
    },

    async createStudyPlan(data) {
        const res = await apiClient.post('/api/study-plan', data);
        return res.plan;
    },

    async updateStudyPlan(id, data) {
        const res = await apiClient.put(`/api/study-plan/${id}`, data);
        return res.plan;
    },

    async deleteStudyPlan(id) {
        return apiClient.delete(`/api/study-plan/${id}`);
    }
};

window.studyPlanService = studyPlanService;
