const express = require('express');
const chatController = require('../controllers/chat')

const router = express.Router();

router.get('/chat', chatController.loadChatPage);

module.exports = router;