const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/app');
const User = require('../server/models/User');
const Task = require('../server/models/Task');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_automated_testing_2026';
const TEST_DB_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/study_planner_test';

test.before(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(TEST_DB_URI);
    }
});

test.after(async () => {
    const users = await User.find({ email: { $regex: /@tasktest\.com$/ } });
    const userIds = users.map(u => u._id);
    await Task.deleteMany({ userId: { $in: userIds } });
    await User.deleteMany({ _id: { $in: userIds } });
    await mongoose.connection.close();
});

test('TASK SUITE: Full CRUD and Completion Operations', async (t) => {
    const email = `taskuser_${Date.now()}@tasktest.com`;
    let token = '';
    let taskId = '';

    // Register test user
    const regRes = await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Task Tester',
            email,
            password: 'password123'
        });
    token = regRes.body.token;

    await t.test('POST /api/tasks - Creates a new study task', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Review Graph Theory Notes',
                subject: 'DSA',
                category: 'dsa',
                priority: 'High',
                dueDate: '2026-10-15'
            });

        assert.equal(res.status, 201);
        assert.equal(res.body.success, true);
        assert.equal(res.body.task.title, 'Review Graph Theory Notes');
        assert.equal(res.body.task.completed, false);
        taskId = res.body.task.id;
    });

    await t.test('GET /api/tasks - Reads user tasks', async () => {
        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);

        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.ok(res.body.tasks.length >= 1);
        assert.equal(res.body.tasks[0].id, taskId);
    });

    await t.test('PATCH /api/tasks/:id/complete - Toggles task completion', async () => {
        const res = await request(app)
            .patch(`/api/tasks/${taskId}/complete`)
            .set('Authorization', `Bearer ${token}`);

        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.equal(res.body.task.completed, true);
        assert.equal(res.body.task.status, 'completed');
        assert.ok(res.body.task.completedAt);
    });

    await t.test('PUT /api/tasks/:id - Updates task details', async () => {
        const res = await request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Updated Graph Theory Practice',
                priority: 'Medium'
            });

        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.equal(res.body.task.title, 'Updated Graph Theory Practice');
        assert.equal(res.body.task.priority, 'Medium');
    });

    await t.test('DELETE /api/tasks/:id - Deletes the task', async () => {
        const res = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);

        // Verify it is gone
        const checkRes = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);
        assert.equal(checkRes.status, 404);
    });
});
