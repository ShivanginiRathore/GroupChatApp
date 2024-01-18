const express = require('express');
const chatController = require('../controllers/chat')
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.get('/chat', chatController.loadChatPage);

router.post('/saveMessage', userAuthentication.authenticate, chatController.saveMessage);

router.get('/loadUsers', userAuthentication.authenticate, chatController.loadUsers);

module.exports = router;