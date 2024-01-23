const path = require('path');
const rootDir = path.dirname(process.mainModule.filename);

const Chat = require('../models/chat');
const User = require('../models/user');
const Group = require('../models/group');
const GroupMember = require('../models/groupMember');

const Sequelize = require('sequelize');
const S3Services = require('../services/S3services');


exports.loadChatPage = (req, res, next) => {
    res.sendFile(path.join(rootDir,'views','chat.html'));
}

exports.saveMessage = async (req, res, next) => {
    try{

        const {message} = req.body;
        const sender_id = req.user.name;
        const groupName = req.body.groupName;

        const response = await req.user.createChat({senderId: sender_id, receiverId:groupName, message:message, groupGroupName:groupName});

        res.status(200).json({data:response,success:true,msg:'Chat inserted'});

    }catch(err){
        console.log(err)
        res.status(500).json(err);
    }
}

exports.loadChats = async (req, res, next) => {
    try{
        const chats = await Chat.findAll({where: {userEmail: req.user.email}});
        res.status(200).json(chats);
        
    } catch(err){
        res.status(500).json(err);
    }
}

exports.loadUsers = async (req, res, next) => {
    try{
        const loggedInUser = req.user.name;
        const users = await User.findAll({
            where: {
              name : {
                [Sequelize.Op.not]: loggedInUser
              }
            }
          });
          
          const adminOfGroups = await Group.findAll({
            where:{
                admin:req.user.name
            }
          })
          const memberOfGroups = await GroupMember.findAll({
            where:{
                name:req.user.name
            }
          })

        res.status(200).json({users:users, adminOfGroups:adminOfGroups, memberOfGroups:memberOfGroups});
        
    } catch(err){
        console.log(err)
        res.status(500).json(err);
    }
}



exports.createGroup = async (req, res, next) => {
    try{
        const groupName = req.body.groupName;
        const admin = req.user.name;
        
        const response = await req.user.createGroup({groupName:groupName, admin:admin});
        
        res.status(200).json({data:response,success:true,msg:'Group created'});

    } catch(err) {
        console.log(err)
        res.status(500).json(err);
    }

}

exports.storeGroupMembers = async (req, res, next) => {
    try{

        const{selectedUsers, groupName} = req.body

        selectedUsers.forEach(async user => {
            const response = await GroupMember.create({name:user, groupName:groupName});    
        });

        res.status(200).json({success:true});

    } catch(err){
        console.log(err)
        res.status(500).json(err);
    }
}


exports.loadGroupMembers = async (req, res, next) => {
    try{
        const {groupName} = req.body;
        const groupMembers = await GroupMember.findAll({where: {groupName: groupName}});
        const admin = await Group.findByPk(groupName);

        res.status(200).json({groupMembers:groupMembers,admin:admin});
        
    } catch(err){
        res.status(500).json(err);
    }
}

exports.searchUsers = async (req, res, next) => {
    try{
        const searchString = req.body.name;
        const user = await User.findAll({
            
            where: {
                [Sequelize.Op.and]: [
                  {
                    name: {
                      [Sequelize.Op.not]: req.user.name
                      
                    }
                  },
                  Sequelize.where(
                    Sequelize.fn('LOWER', Sequelize.col('name')),
                    'LIKE',
                    `${searchString.toLowerCase()}%`
                  )
                ]
              }
          })
        res.status(200).json(user);
        
    } catch(err){
        console.log(err)
        res.status(500).json(err);
    }
}

exports.addNewUser = async (req, res, next) => {
    try{
        const {newUser, groupName} = req.body;
        const response = await GroupMember.findOne({where:{name:newUser, groupName:groupName}});
        
        if(response){
            res.status(200).json({success:false, message:'User already exists'});
        } else {
            const userAdded = await GroupMember.create({name:newUser, groupName:groupName});
            res.status(200).json({success:true});

        }
        
    } catch(err){
        console.log(err)
        res.status(500).json(err);
    }
}

exports.deleteUser = async (req, res, next) => {
    try{
        const {deleteUser} = req.body;

        const result = await GroupMember.destroy({
            where: {
              name: deleteUser
            }
          });
      
        res.status(200).json({success:true});

        
    } catch(err){
        console.log(err)
        res.status(500).json({success:false,Error:err});
    }
}

exports.fileUpload = async(req, res, next) => {
    try{

        const fileName = req.file.originalname;
        const fileData = req.file.buffer;
        const senderId = req.user.name;
        const {groupName} = req.body;

        const url = await S3Services.uploadToS3(fileData, fileName);
        console.log('url is ',url)
        // const fileList = await req.user.createFileDownloaded({url});
        const response = await req.user.createChat({senderId: senderId, receiverId:groupName, message:url, groupGroupName:groupName});

        res.status(200).json({data:response,success: true});
    
    } catch(err) {
        console.log(err);
        res.status(500).json({url: '', success: false})
    }
}