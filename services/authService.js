/**
 * Study Planner — Authentication Service & Central Auth State
 */

const authService = {
    currentUser: null,
    loading: true,

    async checkAuth(redirectIfNotAuth = true) {
        this.loading = true;
        const token = apiClient.getToken();
        if (!token) {
            this.currentUser = null;
            this.loading = false;
            if (redirectIfNotAuth) {
                const current = window.location.pathname;
                const isAuthPage = current.endsWith('login.html') || 
                                   current.endsWith('register.html') ||
                                   current.endsWith('/login') ||
                                   current.endsWith('/register');
                if (!isAuthPage) {
                    window.location.href = 'login.html';
                }
            }
            return null;
        }

        try {
            const res = await apiClient.get('/api/auth/me');
            if (res.success && res.user) {
                this.currentUser = res.user;
                localStorage.setItem('sp_user_profile', JSON.stringify(res.user));
                this.syncUserDOM(res.user);
                this.loading = false;
                return res.user;
            }
        } catch (err) {
            this.currentUser = null;
            apiClient.clearAuth();
            if (redirectIfNotAuth) {
                window.location.href = 'login.html';
            }
        }
        this.loading = false;
        return null;
    },

    async login(email, password) {
        const res = await apiClient.post('/api/auth/login', { email, password });
        if (res.success && res.token) {
            apiClient.setToken(res.token);
            this.currentUser = res.user;
            localStorage.setItem('sp_user_profile', JSON.stringify(res.user));
            return res;
        }
        throw new Error(res.message || 'Login failed');
    },

    async register(data) {
        const res = await apiClient.post('/api/auth/register', data);
        if (res.success && res.token) {
            apiClient.setToken(res.token);
            this.currentUser = res.user;
            localStorage.setItem('sp_user_profile', JSON.stringify(res.user));
            return res;
        }
        throw new Error(res.message || 'Registration failed');
    },

    async logout() {
        try {
            await apiClient.post('/api/auth/logout', {});
        } catch (e) {
            // Proceed even if server call fails
        }
        apiClient.clearAuth();
        this.currentUser = null;
        window.location.href = 'login.html';
    },

    async updateProfile(data) {
        const res = await apiClient.put('/api/auth/profile', data);
        if (res.success && res.user) {
            this.currentUser = res.user;
            localStorage.setItem('sp_user_profile', JSON.stringify(res.user));
            this.syncUserDOM(res.user);
            return res.user;
        }
        throw new Error(res.message || 'Failed to update profile');
    },

    async updatePassword(currentPassword, newPassword) {
        return apiClient.put('/api/auth/password', { currentPassword, newPassword });
    },

    getUser() {
        if (this.currentUser) return this.currentUser;
        try {
            const raw = localStorage.getItem('sp_user_profile');
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return null;
    },

    syncUserDOM(user) {
        if (!user) return;
        const nameDisplays = document.querySelectorAll('.user-name-display, #studentDisplayName, .user-pill-name, .topbar-name');
        nameDisplays.forEach(el => {
            el.textContent = user.name;
        });

        const initial = user.name ? user.name.charAt(0).toUpperCase() : 'S';
        const avatars = document.querySelectorAll('.user-avatar-sm, .avatar-topbar');
        avatars.forEach(el => {
            el.textContent = initial;
        });

        // Pill subtitle
        const subDisplays = document.querySelectorAll('.user-pill-sub');
        subDisplays.forEach(el => {
            if (user.branch && user.semester) {
                el.textContent = `${user.branch.split(' ')[0]} • ${user.semester} Sem`;
            } else if (user.branch) {
                el.textContent = user.branch;
            } else if (user.semester) {
                el.textContent = `${user.semester} Sem`;
            } else {
                el.textContent = 'Student Profile';
            }
        });
    }
};

window.authService = authService;
