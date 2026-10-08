/**
 * Study Planner — Note API Service
 */

const noteService = {
    async getNotes() {
        const res = await apiClient.get('/api/notes');
        return res.notes || [];
    },

    async createNote(data) {
        const res = await apiClient.post('/api/notes', data);
        return res.note;
    },

    async updateNote(id, data) {
        const res = await apiClient.put(`/api/notes/${id}`, data);
        return res.note;
    },

    async deleteNote(id) {
        return apiClient.delete(`/api/notes/${id}`);
    }
};

window.noteService = noteService;
