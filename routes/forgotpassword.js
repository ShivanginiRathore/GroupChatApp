const express = require('express');
const passwordController = require('../controllers/forgotpassword');

const router = express.Router();

router.get('/forgotpassword', passwordController.loadPage);

router.post('/forgotpassword', passwordController.sendEmail);

router.use('/resetpassword/:id', passwordController.resetPassword);

router.post('/updatePassword', passwordController.updatePassword);

module.exports = router;