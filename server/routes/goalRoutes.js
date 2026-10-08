const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const auth = require('../middleware/auth');

router.use(auth);

router.route('/')
    .get(goalController.getGoals)
    .post(goalController.createGoal);

router.route('/:id')
    .get(goalController.getGoalById)
    .put(goalController.updateGoal)
    .delete(goalController.deleteGoal);

router.patch('/:id/progress', goalController.updateGoalProgress);

module.exports = router;
