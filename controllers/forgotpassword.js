const User = require('../models/user');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ForgotPasswordRequest = require('../models/forgotPasswordRequest');
const rootDir = path.dirname(process.mainModule.filename);
const Sib = require('sib-api-v3-sdk');
const jwt = require('jsonwebtoken');


exports.loadPage = (req, res, next) => {
    res.sendFile(path.join(rootDir,'views','forgotpassword.html'));
}

exports.sendEmail = async (req, res, next) => {
    try{
        const email = req.body.email;
        const id = uuidv4();
        const mailContent = `${process.env.WEBSITE}/resetpassword/${id}`;

        const user = await User.findAll({
            where:{
                email: email
            }
        })
        if(user.length > 0){
            const userId = user[0].id;

        // const response = await user[0].createForgotPasswordRequest({id, isActive: true});
        const response = await ForgotPasswordRequest.create({id, isActive:true,userId});
        
            const client = Sib.ApiClient.instance;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.API_KEY;

            const tranEmailApi = new Sib.TransactionalEmailsApi();
            const sender = {
                email: 'shivangini.atcs@gmail.com',
            }
    
            const receiver = [
                {
                    email
                },
            ]
            await tranEmailApi.sendTransacEmail({
                sender,
                to: receiver,
                subject: 'Reset Password link',
                textContent: mailContent
            }) 
            res.status(200).json({message: 'success'});
            
        } else {
            res.status(201).json({message: 'User does not exist! Check email id or Sign up'});
        }
    }
    catch(err){
        res.status(500).json({message: 'fail', Error : err});

    }
}
function generateAccessToken(id){
    return jwt.sign({userId : id}, 'longtoken')
}
exports.resetPassword = async (req, res, next) => {
    try{
        const id = req.params.id;

        const request = await ForgotPasswordRequest.findOne({where: {id:id}});
        const activeStatus = request.dataValues.isActive;
        console.log("user id is -",request.dataValues.userId);
       
        if(activeStatus){
            console.log("inside active")
            const response = await ForgotPasswordRequest.update({isActive:false}, {where:{id:id}});
            // token: generateAccessToken(user[0].id)

            // res.status(200).json({token: generateAccessToken(user[0].id)});

            res.status(200).sendFile(path.join(rootDir,'views','resetpassword.html'));
        } else{
            res.status(500).json({message: 'fail', Error : 'Link is not active'});
        }


    }
    catch(err) {
        res.status(500).json({message: 'fail', Error : err});
    }
}

exports.updatePassword = async(req, res, next) => {
    // const t = await sequelize.transaction();
    try{
        // const userId = req.user.id;
        const newPassword = req.body.password;

        bcrypt.hash(newPassword, 10, async (err, hash) => {
            console.log(err);
            await req.user.update({password: hash})
        })
         
        // await t.commit();
        res.status(201).json({message: 'success'});
    }
    catch(err) {
        res.status(500).json({message: 'fail', Error : err});
    }
}