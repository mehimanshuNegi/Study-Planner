require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const goalRoutes = require('./routes/goalRoutes');
const noteRoutes = require('./routes/noteRoutes');
const studyPlanRoutes = require('./routes/studyPlanRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static root directory for frontend files (CSS, images, JS, HTML)
const publicDir = path.join(__dirname, '..');
app.use(express.static(publicDir));

// Clean URL navigation shortcuts
app.get('/dashboard', (req, res) => res.sendFile(path.join(publicDir, 'index.html')));
app.get('/tasks', (req, res) => res.sendFile(path.join(publicDir, 'tasks.html')));
app.get('/calendar', (req, res) => res.sendFile(path.join(publicDir, 'schedule.html')));
app.get('/goals', (req, res) => res.sendFile(path.join(publicDir, 'goals.html')));
app.get('/study-plan', (req, res) => res.sendFile(path.join(publicDir, 'study-plan.html')));
app.get('/subjects', (req, res) => res.sendFile(path.join(publicDir, 'loops_arrays_output.html')));
app.get('/login', (req, res) => res.sendFile(path.join(publicDir, 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(publicDir, 'register.html')));
app.get('/settings', (req, res) => res.sendFile(path.join(publicDir, 'register.html')));
app.get('/feedback', (req, res) => res.sendFile(path.join(publicDir, 'feedback.html')));

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/study-plan', studyPlanRoutes);
app.use('/api/study-sessions', sessionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;
