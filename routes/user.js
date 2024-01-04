const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.get('/signup', userController.loadSignupPage);

router.post('/signup', userController.signupUser);

router.get('/login', userController.loadLoginPage);

router.post('/login', userController.loginUser);

module.exports = router;