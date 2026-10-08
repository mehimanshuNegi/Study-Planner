const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.use(auth);

router.route('/')
    .get(taskController.getTasks)
    .post(taskController.createTask);

router.route('/:id')
    .get(taskController.getTaskById)
    .put(taskController.updateTask)
    .delete(taskController.deleteTask);

router.patch('/:id/complete', taskController.toggleTaskComplete);

module.exports = router;
