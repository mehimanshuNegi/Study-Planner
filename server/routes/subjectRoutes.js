const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const auth = require('../middleware/auth');

router.use(auth);

router.route('/')
    .get(subjectController.getSubjects)
    .post(subjectController.createSubject);

router.route('/:id')
    .get(subjectController.getSubjectById)
    .put(subjectController.updateSubject)
    .delete(subjectController.deleteSubject);

router.patch('/:id/progress', subjectController.updateProgress);

module.exports = router;
