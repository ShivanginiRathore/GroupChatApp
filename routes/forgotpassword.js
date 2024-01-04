const express = require('express');
const passwordController = require('../controllers/forgotpassword');

const router = express.Router();

router.get('/forgotpassword', passwordController.loadPage);

router.post('/forgotpassword', passwordController.sendEmail);

module.exports = router;