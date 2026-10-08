const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/app');
const User = require('../server/models/User');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_automated_testing_2026';
const TEST_DB_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/study_planner_test';

test.before(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(TEST_DB_URI);
    }
});

test.after(async () => {
    await User.deleteMany({ email: { $regex: /@authtest\.com$/ } });
    await mongoose.connection.close();
});

test('AUTH SUITE: Registration & Login Flows', async (t) => {
    const testEmail = `user_${Date.now()}@authtest.com`;
    let userToken = '';

    await t.test('POST /api/auth/register - Successfully registers new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test Student',
                email: testEmail,
                password: 'securePassword123',
                confirmPassword: 'securePassword123',
                rollNo: '210052010999',
                semester: '6th'
            });

        assert.equal(res.status, 201);
        assert.equal(res.body.success, true);
        assert.ok(res.body.token);
        assert.equal(res.body.user.email, testEmail);
        assert.equal(res.body.user.passwordHash, undefined); // Password hash must never leak
        userToken = res.body.token;
    });

    await t.test('POST /api/auth/register - Rejects duplicate email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Duplicate Student',
                email: testEmail,
                password: 'securePassword123'
            });

        assert.equal(res.status, 409);
        assert.equal(res.body.success, false);
    });

    await t.test('POST /api/auth/register - Validates short password', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Short Pass',
                email: 'shortpass@authtest.com',
                password: '123'
            });

        assert.equal(res.status, 400);
        assert.equal(res.body.success, false);
    });

    await t.test('POST /api/auth/login - Rejects invalid password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testEmail,
                password: 'wrongPassword'
            });

        assert.equal(res.status, 401);
        assert.equal(res.body.success, false);
    });

    await t.test('POST /api/auth/login - Successfully logs in with valid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testEmail,
                password: 'securePassword123'
            });

        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.ok(res.body.token);
    });

    await t.test('GET /api/auth/me - Rejects unauthenticated request', async () => {
        const res = await request(app).get('/api/auth/me');
        assert.equal(res.status, 401);
        assert.equal(res.body.success, false);
    });

    await t.test('GET /api/auth/me - Returns user profile when authenticated', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${userToken}`);

        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.equal(res.body.user.email, testEmail);
    });

    await t.test('POST /api/auth/logout - Clears cookie and logs out', async () => {
        const res = await request(app).post('/api/auth/logout');
        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
    });
});
