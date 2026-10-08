/**
 * Study Planner — Centralized API Client
 * Manages request headers, authentication token propagation,
 * and automatic 401 session expiration redirects.
 */

const API_BASE_URL = window.API_BASE_URL || '';

const apiClient = {
    getToken() {
        return localStorage.getItem('sp_token') || '';
    },

    setToken(token) {
        if (token) {
            localStorage.setItem('sp_token', token);
        } else {
            localStorage.removeItem('sp_token');
        }
    },

    clearAuth() {
        localStorage.removeItem('sp_token');
        localStorage.removeItem('sp_user_profile');
    },

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);

            // Handle Unauthorized (401)
            if (response.status === 401) {
                this.clearAuth();
                const currentPath = window.location.pathname;
                const isAuthPage = currentPath.endsWith('login.html') || 
                                   currentPath.endsWith('register.html') ||
                                   currentPath.endsWith('/login') ||
                                   currentPath.endsWith('/register');
                if (!isAuthPage) {
                    window.location.href = 'login.html';
                }
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Unauthorized session. Please log in.');
            }

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || `Request failed with status ${response.status}`);
            }

            return data;
        } catch (err) {
            console.error(`API Error [${endpoint}]:`, err.message);
            throw err;
        }
    },

    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },

    post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body });
    },

    put(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body });
    },

    patch(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PATCH', body });
    },

    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
};

window.apiClient = apiClient;
