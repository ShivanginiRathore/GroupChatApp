const express = require('express');
const chatController = require('../controllers/chat')
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.get('/chat', chatController.loadChatPage);

router.post('/saveMessage', userAuthentication.authenticate, chatController.saveMessage);

router.post('/loadUsers', userAuthentication.authenticate, chatController.loadUsers);

router.post('/createGroup', userAuthentication.authenticate, chatController.createGroup);

router.post('/storeGroupMembers', userAuthentication.authenticate, chatController.storeGroupMembers);

router.post('/loadGroupMembers', userAuthentication.authenticate, chatController.loadGroupMembers);

router.post('/searchUsers', userAuthentication.authenticate, chatController.searchUsers);

router.post('/addNewUser', userAuthentication.authenticate, chatController.addNewUser);

router.post('/deleteUser', userAuthentication.authenticate, chatController.deleteUser);


module.exports = router;