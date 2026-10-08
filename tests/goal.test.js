const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/app');
const User = require('../server/models/User');
const Goal = require('../server/models/Goal');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_automated_testing_2026';
const TEST_DB_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/study_planner_test';

test.before(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(TEST_DB_URI);
    }
});

test.after(async () => {
    const users = await User.find({ email: { $regex: /@goaltest\.com$/ } });
    const userIds = users.map(u => u._id);
    await Goal.deleteMany({ userId: { $in: userIds } });
    await User.deleteMany({ _id: { $in: userIds } });
    await mongoose.connection.close();
});

test('GOAL SUITE: Goal CRUD and Status Operations', async (t) => {
    const email = `goaluser_${Date.now()}@goaltest.com`;
    let token = '';
    let goalId = '';

    const regRes = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Goal Student', email, password: 'password123' });
    token = regRes.body.token;

    await t.test('POST /api/goals - Creates a goal', async () => {
        const res = await request(app)
            .post('/api/goals')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Solve 100 LeetCode Problems',
                target: '100 Medium Problems',
                progressPercent: 40,
                deadline: '31 Dec 2026'
            });

        assert.equal(res.status, 201);
        assert.equal(res.body.goal.title, 'Solve 100 LeetCode Problems');
        goalId = res.body.goal.id;
    });

    await t.test('GET /api/goals - Reads goals', async () => {
        const res = await request(app)
            .get('/api/goals')
            .set('Authorization', `Bearer ${token}`);

        assert.equal(res.status, 200);
        assert.ok(res.body.goals.length >= 1);
    });

    await t.test('PATCH /api/goals/:id/progress - Updates goal progress', async () => {
        const res = await request(app)
            .patch(`/api/goals/${goalId}/progress`)
            .set('Authorization', `Bearer ${token}`)
            .send({ progressPercent: 100 });

        assert.equal(res.status, 200);
        assert.equal(res.body.goal.progressPercent, 100);
        assert.equal(res.body.goal.status, 'completed');
    });

    await t.test('DELETE /api/goals/:id - Deletes goal', async () => {
        const res = await request(app)
            .delete(`/api/goals/${goalId}`)
            .set('Authorization', `Bearer ${token}`);

        assert.equal(res.status, 200);
    });
});
