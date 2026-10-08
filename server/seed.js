require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const Subject = require('./models/Subject');
const Goal = require('./models/Goal');
const Note = require('./models/Note');
const StudyPlan = require('./models/StudyPlan');
const StudySession = require('./models/StudySession');

const seedData = async () => {
    if (process.env.NODE_ENV === 'production') {
        console.error('CRITICAL: Cannot run development seed in production environment!');
        process.exit(1);
    }

    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/study_planner';
        await mongoose.connect(uri);
        console.log('--- DEVELOPMENT DATABASE SEEDING STARTED ---');

        // 1. Remove existing demo user data if present
        const demoEmail = 'seed.student@example.com';
        const existingUser = await User.findOne({ email: demoEmail });
        if (existingUser) {
            console.log(`Clearing previous data for demo user: ${demoEmail}`);
            await Task.deleteMany({ userId: existingUser._id });
            await Subject.deleteMany({ userId: existingUser._id });
            await Goal.deleteMany({ userId: existingUser._id });
            await Note.deleteMany({ userId: existingUser._id });
            await StudyPlan.deleteMany({ userId: existingUser._id });
            await StudySession.deleteMany({ userId: existingUser._id });
            await User.deleteOne({ _id: existingUser._id });
        }

        // 2. Create Demo User
        const demoUser = await User.create({
            name: 'Sample Student',
            email: demoEmail,
            passwordHash: 'password123',
            rollNo: '210052010045',
            branch: 'Computer Science and Engineering',
            semester: '6th',
            studyGoal: '25',
            notes: 'Targeting 8.5+ SGPA in 6th semester. Focus on Web Tech Lab and Data Structures coding.'
        });
        console.log(`✓ Dev Seed User created: ${demoUser.email} (Password: password123)`);

        const userId = demoUser._id;

        // 3. Create Sample Subjects
        const subjects = await Subject.insertMany([
            { userId, name: 'Data Structures & Algorithms', progress: 70, targetProgress: 100, category: 'dsa', dailyHours: 3, targetMarks: 90 },
            { userId, name: 'Web Technologies', progress: 45, targetProgress: 100, category: 'webtech', dailyHours: 2, targetMarks: 85 },
            { userId, name: 'OOP (Java)', progress: 60, targetProgress: 100, category: 'oop', dailyHours: 2, targetMarks: 88 },
            { userId, name: 'DBMS', progress: 30, targetProgress: 100, category: 'dbms', dailyHours: 1.5, targetMarks: 80 },
            { userId, name: 'Operating Systems', progress: 50, targetProgress: 100, category: 'dsa', dailyHours: 1.5, targetMarks: 82 }
        ]);
        console.log(`✓ ${subjects.length} Subjects created`);

        // 4. Create Sample Tasks
        const todayStr = new Date().toISOString().split('T')[0];
        const tasks = await Task.insertMany([
            { userId, title: 'Complete DSA practice questions (Two Pointers)', subject: 'DSA', category: 'dsa', priority: 'High', dueDate: todayStr, completed: true, status: 'completed', completedAt: new Date() },
            { userId, title: 'Read Web Tech notes (Unit 2 DOM APIs)', subject: 'Web Technologies', category: 'webtech', priority: 'High', dueDate: todayStr, completed: true, status: 'completed', completedAt: new Date() },
            { userId, title: 'Work on Study Planner UI & API Integration', subject: 'Project', category: 'project', priority: 'Medium', dueDate: todayStr, completed: false, status: 'pending' },
            { userId, title: 'Prepare for AMCAT (Quantitative Math)', subject: 'Placement', category: 'placement', priority: 'Medium', dueDate: '2026-10-10', completed: false, status: 'pending' },
            { userId, title: 'Revise DBMS Normalization & ACID Properties', subject: 'DBMS', category: 'dbms', priority: 'Low', dueDate: '2026-10-12', completed: false, status: 'pending' }
        ]);
        console.log(`✓ ${tasks.length} Tasks created`);

        // 5. Create Sample Goals
        const goals = await Goal.insertMany([
            {
                userId,
                title: 'Improve DSA Problem Solving',
                category: 'dsa',
                target: 'Complete 150 DSA problems',
                currentProgress: '102 / 150 problems solved',
                progressPercent: 68,
                deadline: '30 Nov 2026',
                status: 'active'
            },
            {
                userId,
                title: 'Maintain Semester Performance',
                category: 'webtech',
                target: 'Maintain 8.5+ CGPA',
                currentProgress: 'On track (SGPA 8.7 target)',
                progressPercent: 82,
                deadline: 'End of semester',
                status: 'active'
            },
            {
                userId,
                title: 'Complete Java Backend Roadmap',
                category: 'oop',
                target: 'Java + Spring Boot + REST APIs',
                currentProgress: 'Java + Spring Boot in progress',
                progressPercent: 55,
                deadline: '15 Dec 2026',
                status: 'active'
            },
            {
                userId,
                title: 'Complete Major Project',
                category: 'project',
                target: 'Finish Study Planner project',
                currentProgress: 'UI + Full-stack API completed',
                progressPercent: 85,
                deadline: '30 Nov 2026',
                status: 'active'
            },
            {
                userId,
                title: 'Finish Java OOP Fundamentals',
                category: 'oop',
                target: 'Class hierarchies, collections & exceptions',
                currentProgress: 'Course completed & certified',
                progressPercent: 100,
                deadline: 'Sep 2026',
                status: 'completed'
            },
            {
                userId,
                title: 'AMCAT Full Placement Mock Certification',
                category: 'placement',
                target: 'Full-length adaptive simulated exam',
                currentProgress: 'Scheduled',
                progressPercent: 0,
                deadline: '10 Oct 2026',
                status: 'upcoming'
            }
        ]);
        console.log(`✓ ${goals.length} Goals created`);

        // 6. Create Sample Quick Notes
        const notes = await Note.insertMany([
            { userId, title: 'Algorithms', content: 'Revise sorting and tree traversal algorithms tomorrow.', color: '' },
            { userId, title: 'Project', content: 'Check project backend feedback and verify user isolation.', color: 'sage' },
            { userId, title: 'Exam Prep', content: 'Web Tech MST scheduled for next Monday. Review Unit 1 & 2.', color: 'pink' }
        ]);
        console.log(`✓ ${notes.length} Notes created`);

        // 7. Create Sample Study Sessions (Pomodoro)
        const sessions = await StudySession.insertMany([
            { userId, title: 'DSA Trees & Graphs', duration: 50, mode: 'focus', status: 'completed', createdAt: new Date(Date.now() - 86400000) },
            { userId, title: 'Web Tech REST APIs', duration: 50, mode: 'focus', status: 'completed', createdAt: new Date(Date.now() - 43200000) },
            { userId, title: 'DBMS Indexing', duration: 25, mode: 'focus', status: 'completed', createdAt: new Date() }
        ]);
        console.log(`✓ ${sessions.length} Study Sessions created (Total 125 min study time)`);

        // 8. Create Weekly Study Plan slots
        const plans = await StudyPlan.insertMany([
            { userId, title: 'Data Structures — Arrays & Two Pointers', dayOfWeek: 'mon', startTime: '09:00', endTime: '10:00', timeRange: '09:00 – 10:00', category: 'dsa', tag: 'Coding Practice', priority: 'High' },
            { userId, title: 'Web Technologies — HTML/CSS/JS', dayOfWeek: 'mon', startTime: '10:30', endTime: '11:30', timeRange: '10:30 – 11:30', category: 'webtech', tag: 'Theory & Lab Notes', priority: 'High' },
            { userId, title: 'Project Development', dayOfWeek: 'mon', startTime: '14:00', endTime: '15:00', timeRange: '14:00 – 15:00', category: 'project', tag: 'Frontend Integration', priority: 'Medium' },
            { userId, title: 'DSA Practice', dayOfWeek: 'mon', startTime: '17:00', endTime: '18:00', timeRange: '17:00 – 18:00', category: 'dsa', tag: 'LeetCode Problems', priority: 'High' },

            { userId, title: 'OOP — Java Concepts', dayOfWeek: 'tue', startTime: '09:00', endTime: '10:00', timeRange: '09:00 – 10:00', category: 'oop', tag: 'Inheritance & Polymorphism', priority: 'Medium' },
            { userId, title: 'Database Management Systems', dayOfWeek: 'tue', startTime: '11:00', endTime: '12:00', timeRange: '11:00 – 12:00', category: 'dbms', tag: 'Normalization & ER', priority: 'High' },

            { userId, title: 'Data Structures — Trees', dayOfWeek: 'wed', startTime: '09:00', endTime: '10:00', timeRange: '09:00 – 10:00', category: 'dsa', tag: 'Binary Tree Traversals', priority: 'High' },
            { userId, title: 'Web Technologies', dayOfWeek: 'wed', startTime: '11:00', endTime: '12:00', timeRange: '11:00 – 12:00', category: 'webtech', tag: 'DOM Manipulation', priority: 'Medium' },

            { userId, title: 'Operating Systems', dayOfWeek: 'thu', startTime: '09:00', endTime: '10:00', timeRange: '09:00 – 10:00', category: 'dsa', tag: 'CPU Scheduling & Memory', priority: 'Medium' },
            { userId, title: 'DBMS', dayOfWeek: 'thu', startTime: '11:00', endTime: '12:00', timeRange: '11:00 – 12:00', category: 'dbms', tag: 'Transactions & ACID', priority: 'High' },

            { userId, title: 'DSA Practice', dayOfWeek: 'fri', startTime: '09:00', endTime: '10:00', timeRange: '09:00 – 10:00', category: 'dsa', tag: 'Dynamic Programming Intro', priority: 'High' },
            { userId, title: 'OOP / Java', dayOfWeek: 'fri', startTime: '11:00', endTime: '12:00', timeRange: '11:00 – 12:00', category: 'oop', tag: 'Exception Handling & Streams', priority: 'Medium' },

            { userId, title: 'Project Work', dayOfWeek: 'sat', startTime: '10:00', endTime: '12:00', timeRange: '10:00 – 12:00', category: 'project', tag: 'Milestone Documentation', priority: 'Medium' },
            { userId, title: 'DSA Practice', dayOfWeek: 'sat', startTime: '14:00', endTime: '15:00', timeRange: '14:00 – 15:00', category: 'dsa', tag: 'Mock Coding Contest', priority: 'High' },

            { userId, title: 'Weekly Review', dayOfWeek: 'sun', startTime: '10:00', endTime: '11:00', timeRange: '10:00 – 11:00', category: 'placement', tag: 'Self Evaluation & Habits', priority: 'Low' }
        ]);
        console.log(`✓ ${plans.length} Study Plan slots created`);

        console.log('--- DEVELOPMENT DATABASE SEEDING COMPLETED SUCCESSFULLY ---');
        console.log(`Login credentials:\n  Email: ${demoEmail}\n  Password: password123`);
        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Database seeding failed:', err);
        process.exit(1);
    }
};

seedData();
