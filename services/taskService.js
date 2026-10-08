/**
 * Study Planner — Task API Service
 */

const taskService = {
    async getTasks(params = {}) {
        let query = '';
        const searchParams = new URLSearchParams();
        if (params.status) searchParams.append('status', params.status);
        if (params.completed !== undefined) searchParams.append('completed', params.completed);
        if (params.category) searchParams.append('category', params.category);
        if (params.priority) searchParams.append('priority', params.priority);
        const qs = searchParams.toString();
        if (qs) query = `?${qs}`;

        const res = await apiClient.get(`/api/tasks${query}`);
        return res.tasks || [];
    },

    async getTaskById(id) {
        const res = await apiClient.get(`/api/tasks/${id}`);
        return res.task;
    },

    async createTask(taskData) {
        const res = await apiClient.post('/api/tasks', taskData);
        return res.task;
    },

    async updateTask(id, taskData) {
        const res = await apiClient.put(`/api/tasks/${id}`, taskData);
        return res.task;
    },

    async deleteTask(id) {
        return apiClient.delete(`/api/tasks/${id}`);
    },

    async toggleComplete(id, completed) {
        const body = completed !== undefined ? { completed } : {};
        const res = await apiClient.patch(`/api/tasks/${id}/complete`, body);
        return res.task;
    }
};

window.taskService = taskService;
