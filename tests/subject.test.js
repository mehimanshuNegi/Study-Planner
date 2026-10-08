const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/app');
const User = require('../server/models/User');
const Subject = require('../server/models/Subject');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_automated_testing_2026';
const TEST_DB_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/study_planner_test';

test.before(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(TEST_DB_URI);
    }
});

test.after(async () => {
    const users = await User.find({ email: { $regex: /@subjecttest\.com$/ } });
    const userIds = users.map(u => u._id);
    await Subject.deleteMany({ userId: { $in: userIds } });
    await User.deleteMany({ _id: { $in: userIds } });
    await mongoose.connection.close();
});

test('SUBJECT SUITE: Subject CRUD and Progress Tracking', async (t) => {
    const email = `subuser_${Date.now()}@subjecttest.com`;
    let token = '';
    let subjectId = '';

    const regRes = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Subject Student', email, password: 'password123' });
    token = regRes.body.token;

    await t.test('POST /api/subjects - Creates a subject', async () => {
        const res = await request(app)
            .post('/api/subjects')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Compiler Design',
                progress: 25,
                category: 'dsa',
                targetMarks: 85
            });

        assert.equal(res.status, 201);
        assert.equal(res.body.subject.name, 'Compiler Design');
        assert.equal(res.body.subject.progress, 25);
        subjectId = res.body.subject.id;
    });

    await t.test('GET /api/subjects - Reads subjects', async () => {
        const res = await request(app)
            .get('/api/subjects')
            .set('Authorization', `Bearer ${token}`);

        assert.equal(res.status, 200);
        assert.ok(res.body.subjects.length >= 1);
    });

    await t.test('PATCH /api/subjects/:id/progress - Updates progress', async () => {
        const res = await request(app)
            .patch(`/api/subjects/${subjectId}/progress`)
            .set('Authorization', `Bearer ${token}`)
            .send({ progress: 65 });

        assert.equal(res.status, 200);
        assert.equal(res.body.subject.progress, 65);
    });

    await t.test('DELETE /api/subjects/:id - Deletes subject', async () => {
        const res = await request(app)
            .delete(`/api/subjects/${subjectId}`)
            .set('Authorization', `Bearer ${token}`);

        assert.equal(res.status, 200);
    });
});
