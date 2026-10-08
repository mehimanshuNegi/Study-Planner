/**
 * Study Planner — Subject API Service
 */

const subjectService = {
    async getSubjects() {
        const res = await apiClient.get('/api/subjects');
        return res.subjects || [];
    },

    async getSubjectById(id) {
        const res = await apiClient.get(`/api/subjects/${id}`);
        return res.subject;
    },

    async createSubject(data) {
        const res = await apiClient.post('/api/subjects', data);
        return res.subject;
    },

    async updateSubject(id, data) {
        const res = await apiClient.put(`/api/subjects/${id}`, data);
        return res.subject;
    },

    async deleteSubject(id) {
        return apiClient.delete(`/api/subjects/${id}`);
    },

    async updateProgress(id, progress) {
        const res = await apiClient.patch(`/api/subjects/${id}/progress`, { progress });
        return res.subject;
    }
};

window.subjectService = subjectService;
