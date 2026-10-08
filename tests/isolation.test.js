const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/app');
const User = require('../server/models/User');
const Task = require('../server/models/Task');
const Subject = require('../server/models/Subject');
const Goal = require('../server/models/Goal');
const Note = require('../server/models/Note');
const StudyPlan = require('../server/models/StudyPlan');
const StudySession = require('../server/models/StudySession');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_automated_testing_2026';
const TEST_DB_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/study_planner_test';

test.before(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(TEST_DB_URI);
    }
});

test.after(async () => {
    const users = await User.find({ email: { $regex: /@isolationtest\.com$/ } });
    const userIds = users.map(u => u._id);
    await Task.deleteMany({ userId: { $in: userIds } });
    await Subject.deleteMany({ userId: { $in: userIds } });
    await Goal.deleteMany({ userId: { $in: userIds } });
    await Note.deleteMany({ userId: { $in: userIds } });
    await StudyPlan.deleteMany({ userId: { $in: userIds } });
    await StudySession.deleteMany({ userId: { $in: userIds } });
    await User.deleteMany({ _id: { $in: userIds } });
    await mongoose.connection.close();
});

test('DATA ISOLATION SUITE: Strict Cross-User Data Protection', async (t) => {
    // 1. Create User A
    const regA = await request(app)
        .post('/api/auth/register')
        .send({
            name: 'User Alpha',
            email: `userA_${Date.now()}@isolationtest.com`,
            password: 'password123'
        });
    const tokenA = regA.body.token;

    // 2. Create User B
    const regB = await request(app)
        .post('/api/auth/register')
        .send({
            name: 'User Beta',
            email: `userB_${Date.now()}@isolationtest.com`,
            password: 'password123'
        });
    const tokenB = regB.body.token;

    // User A creates resources
    let taskA_Id = '';
    let subjectA_Id = '';
    let goalA_Id = '';
    let noteA_Id = '';
    let planA_Id = '';

    await t.test('User A creates own resources', async () => {
        // Task
        const tRes = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ title: 'User A Secret Task', subject: 'DSA' });
        taskA_Id = tRes.body.task.id;

        // Subject
        const sRes = await request(app)
            .post('/api/subjects')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ name: 'User A Confidential Subject', progress: 50 });
        subjectA_Id = sRes.body.subject.id;

        // Goal
        const gRes = await request(app)
            .post('/api/goals')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ title: 'User A Secret Goal', target: 'Top Rank' });
        goalA_Id = gRes.body.goal.id;

        // Note
        const nRes = await request(app)
            .post('/api/notes')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ content: 'User A Private Note' });
        noteA_Id = nRes.body.note.id;

        // Study Plan
        const pRes = await request(app)
            .post('/api/study-plan')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ title: 'User A Private Session', dayOfWeek: 'mon' });
        planA_Id = pRes.body.plan.id;

        // Study Session
        await request(app)
            .post('/api/study-sessions')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ title: 'User A Focus 25m', duration: 25 });
    });

    await t.test('User B CANNOT see User A tasks in list or by ID', async () => {
        // List check
        const listRes = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${tokenB}`);
        const found = listRes.body.tasks.some(t => t.id === taskA_Id || t.title === 'User A Secret Task');
        assert.equal(found, false);

        // Direct ID check
        const directRes = await request(app)
            .get(`/api/tasks/${taskA_Id}`)
            .set('Authorization', `Bearer ${tokenB}`);
        assert.equal(directRes.status, 404);
    });

    await t.test('User B CANNOT update or delete User A task', async () => {
        const updateRes = await request(app)
            .put(`/api/tasks/${taskA_Id}`)
            .set('Authorization', `Bearer ${tokenB}`)
            .send({ title: 'Hacked Title' });
        assert.equal(updateRes.status, 404);

        const deleteRes = await request(app)
            .delete(`/api/tasks/${taskA_Id}`)
            .set('Authorization', `Bearer ${tokenB}`);
        assert.equal(deleteRes.status, 404);
    });

    await t.test('User B CANNOT see or modify User A subjects', async () => {
        const listRes = await request(app)
            .get('/api/subjects')
            .set('Authorization', `Bearer ${tokenB}`);
        const found = listRes.body.subjects.some(s => s.id === subjectA_Id);
        assert.equal(found, false);

        const delRes = await request(app)
            .delete(`/api/subjects/${subjectA_Id}`)
            .set('Authorization', `Bearer ${tokenB}`);
        assert.equal(delRes.status, 404);
    });

    await t.test('User B CANNOT see or modify User A goals', async () => {
        const listRes = await request(app)
            .get('/api/goals')
            .set('Authorization', `Bearer ${tokenB}`);
        const found = listRes.body.goals.some(g => g.id === goalA_Id);
        assert.equal(found, false);

        const putRes = await request(app)
            .put(`/api/goals/${goalA_Id}`)
            .set('Authorization', `Bearer ${tokenB}`)
            .send({ target: 'Hacked Goal' });
        assert.equal(putRes.status, 404);
    });

    await t.test('User B CANNOT see or modify User A notes', async () => {
        const listRes = await request(app)
            .get('/api/notes')
            .set('Authorization', `Bearer ${tokenB}`);
        const found = listRes.body.notes.some(n => n.id === noteA_Id);
        assert.equal(found, false);

        const delRes = await request(app)
            .delete(`/api/notes/${noteA_Id}`)
            .set('Authorization', `Bearer ${tokenB}`);
        assert.equal(delRes.status, 404);
    });

    await t.test('User B CANNOT see or modify User A study plans', async () => {
        const listRes = await request(app)
            .get('/api/study-plan')
            .set('Authorization', `Bearer ${tokenB}`);
        const found = listRes.body.plans.some(p => p.id === planA_Id);
        assert.equal(found, false);

        const getDirect = await request(app)
            .get(`/api/study-plan/${planA_Id}`)
            .set('Authorization', `Bearer ${tokenB}`);
        assert.equal(getDirect.status, 404);
    });

    await t.test('User B dashboard does NOT count User A data', async () => {
        const dashRes = await request(app)
            .get('/api/dashboard/stats')
            .set('Authorization', `Bearer ${tokenB}`);

        assert.equal(dashRes.status, 200);
        assert.equal(dashRes.body.stats.tasks.total, 0);
        assert.equal(dashRes.body.stats.studyTime.totalMinutes, 0);
        assert.equal(dashRes.body.stats.subjects.count, 0);
    });
});
