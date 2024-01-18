const path = require('path');
const rootDir = path.dirname(process.mainModule.filename);
const Chat = require('../models/chat');
const User = require('../models/user');
const Sequelize = require('sequelize')

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

exports.loadUsers = async (req, res, next) => {
    try{
        // const users = await User.findAll();
        const users = await User.findAll({
            where: {
              id : {
                [Sequelize.Op.not]: 1
              }
            }
          });
        //   console.log("Users are >>>>>>>>>>>>", users)
        res.status(200).json(users);
        
    } catch(err){
        console.log(err)
        res.status(500).json(err);
    }
}