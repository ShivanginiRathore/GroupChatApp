const path = require('path');
const rootDir = path.dirname(process.mainModule.filename);
const Chat = require('../models/chat');

exports.loadChatPage = (req, res, next) => {
    res.sendFile(path.join(rootDir,'views','chat.html'));
}

exports.saveMessage = async (req, res, next) => {
    try{
        const {message} = req.body;

        await req.user.createChat({message});
        res.status(200).json();

    }catch(err){
        res.status(500).json(err);
    }
}

exports.loadChats = async (req, res, next) => {
    try{
        const chats = await Chat.findAll({where: {userId: req.user.id}});
        res.status(200).json(chats);
        
    } catch(err){
        res.status(500).json(err);
    }
}