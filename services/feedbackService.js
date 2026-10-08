/**
 * Study Planner — Feedback API Service
 * Handles submitting student feedback, retrieving personal feedback history,
 * and deleting feedback entries via MongoDB.
 */

const feedbackService = {
    async getFeedbacks() {
        const res = await apiClient.get('/api/feedback');
        return res.feedbacks || [];
    },

    async getFeedbackById(id) {
        const res = await apiClient.get(`/api/feedback/${id}`);
        return res.feedback;
    },

    async createFeedback(data) {
        const res = await apiClient.post('/api/feedback', data);
        return res.feedback;
    },

    async deleteFeedback(id) {
        return apiClient.delete(`/api/feedback/${id}`);
    }
};

window.feedbackService = feedbackService;
