const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/auth');

router.use(auth);

router.route('/')
    .get(sessionController.getSessions)
    .post(sessionController.createSession);

module.exports = router;
