const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/app');
const User = require('../server/models/User');
const Feedback = require('../server/models/Feedback');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_automated_testing_2026';
const TEST_DB_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/study_planner_test';

test.before(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(TEST_DB_URI);
    }
});

test.after(async () => {
    const users = await User.find({ email: { $regex: /@feedbacktest\.com$/ } });
    const userIds = users.map(u => u._id);
    await Feedback.deleteMany({ userId: { $in: userIds } });
    await User.deleteMany({ _id: { $in: userIds } });
    await mongoose.connection.close();
});

test('FEEDBACK SUITE: Student Feedback Creation, Retrieval, Validation & Multi-User Isolation', async (t) => {
    // 1. Create User A
    const regResA = await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Feedback Student A',
            email: `studentA_${Date.now()}@feedbacktest.com`,
            password: 'password123'
        });
    const tokenA = regResA.body.token;

    // 2. Create User B
    const regResB = await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Feedback Student B',
            email: `studentB_${Date.now()}@feedbacktest.com`,
            password: 'password123'
        });
    const tokenB = regResB.body.token;

    let feedbackA_Id = '';

    await t.test('POST /api/feedback - Successfully creates feedback with rating', async () => {
        const res = await request(app)
            .post('/api/feedback')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({
                type: 'Suggestion',
                title: 'Add Pomodoro Sound Effect',
                message: 'It would be great to have an audio chime when the 25 minute study session completes.',
                rating: 5
            });

        assert.equal(res.status, 201);
        assert.equal(res.body.success, true);
        assert.equal(res.body.feedback.title, 'Add Pomodoro Sound Effect');
        assert.equal(res.body.feedback.type, 'Suggestion');
        assert.equal(res.body.feedback.rating, 5);
        assert.equal(res.body.feedback.status, 'submitted');
        feedbackA_Id = res.body.feedback.id;
    });

    await t.test('POST /api/feedback - Validates required fields', async () => {
        const res = await request(app)
            .post('/api/feedback')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({
                type: 'Suggestion',
                title: '',
                message: ''
            });

        assert.equal(res.status, 400);
        assert.equal(res.body.success, false);
    });

    await t.test('POST /api/feedback - Rejects invalid feedback type', async () => {
        const res = await request(app)
            .post('/api/feedback')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({
                type: 'InvalidType',
                title: 'Test',
                message: 'Testing invalid type'
            });

        assert.equal(res.status, 400);
        assert.equal(res.body.success, false);
    });

    await t.test('POST /api/feedback - Rejects invalid rating outside 1..5', async () => {
        const res = await request(app)
            .post('/api/feedback')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({
                type: 'Bug / Issue',
                title: 'Issue',
                message: 'Test message',
                rating: 7
            });

        assert.equal(res.status, 400);
        assert.equal(res.body.success, false);
    });

    await t.test('GET /api/feedback - Returns user feedback history', async () => {
        const res = await request(app)
            .get('/api/feedback')
            .set('Authorization', `Bearer ${tokenA}`);

        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.equal(Array.isArray(res.body.feedbacks), true);
        assert.equal(res.body.feedbacks.length >= 1, true);
        assert.equal(res.body.feedbacks[0].id, feedbackA_Id);
    });

    await t.test('GET /api/feedback/:id - Returns single feedback belonging to user', async () => {
        const res = await request(app)
            .get(`/api/feedback/${feedbackA_Id}`)
            .set('Authorization', `Bearer ${tokenA}`);

        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.equal(res.body.feedback.title, 'Add Pomodoro Sound Effect');
    });

    await t.test('DATA ISOLATION: User B CANNOT see User A feedback in list', async () => {
        const res = await request(app)
            .get('/api/feedback')
            .set('Authorization', `Bearer ${tokenB}`);

        assert.equal(res.status, 200);
        assert.equal(res.body.feedbacks.length, 0);
    });

    await t.test('DATA ISOLATION: User B CANNOT view User A feedback by ID', async () => {
        const res = await request(app)
            .get(`/api/feedback/${feedbackA_Id}`)
            .set('Authorization', `Bearer ${tokenB}`);

        assert.equal(res.status, 404);
    });

    await t.test('DATA ISOLATION: User B CANNOT delete User A feedback', async () => {
        const res = await request(app)
            .delete(`/api/feedback/${feedbackA_Id}`)
            .set('Authorization', `Bearer ${tokenB}`);

        assert.equal(res.status, 404);
    });

    await t.test('DELETE /api/feedback/:id - User A can delete own feedback', async () => {
        const res = await request(app)
            .delete(`/api/feedback/${feedbackA_Id}`)
            .set('Authorization', `Bearer ${tokenA}`);

        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);

        // Verify it is gone
        const checkRes = await request(app)
            .get('/api/feedback')
            .set('Authorization', `Bearer ${tokenA}`);
        assert.equal(checkRes.body.feedbacks.some(f => f.id === feedbackA_Id), false);
    });
});
