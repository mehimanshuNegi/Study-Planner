const express = require('express');
const router = express.Router();
const studyPlanController = require('../controllers/studyPlanController');
const auth = require('../middleware/auth');

router.use(auth);

router.route('/')
    .get(studyPlanController.getStudyPlans)
    .post(studyPlanController.createStudyPlan);

router.route('/:id')
    .get(studyPlanController.getStudyPlanById)
    .put(studyPlanController.updateStudyPlan)
    .delete(studyPlanController.deleteStudyPlan);

module.exports = router;
