const User = require('../models/user');
const path = require('path');
const rootDir = path.dirname(process.mainModule.filename);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.loadLoginPage = (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'login.html'));
}

exports.loadSignupPage = (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'signup.html'))
}

exports.signupUser = async (req, res, next) => {
    try{
        const {name, email, password, phoneNumber} = req.body;
        if(name == undefined || name.length === 0 
            || email == undefined || email.length === 0
            || password == undefined || password.length === 0
            || phoneNumber == undefined || phoneNumber.length === 0){
                return res.status(400).json({err: "Bad parameters"});
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            await User.create({name, email, password: hash, phoneNumber});
            res.status(201).json({message: 'Successfully created new user'})
        })
    }
    catch(err) {
        res.status(500).json(err);
    }
}

function generateAccessToken(email){
    return jwt.sign({email : email}, 'longtoken')
}


exports.loginUser = async(req, res, next) => {
    try{
        const{email, password} = req.body;
        const user = await User.findAll({
            where:{
                email: email
            }
        })

        if(user.length > 0){
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(err){
                    res.status(500).json(err);
                }
                if(result === true){
                    res.status(200).json({message: 'Successfully logged in', token: generateAccessToken(user[0].email), username: user[0].name, email: user[0].email})
                } else {
                    res.status(401).json({message: 'Incorrect password'});
                }
            })
        } else {
            res.status(404).json({message:'User not exists! Check your email id or Sign up'});
        }
    } 
    catch(err) {
        res.status(500).json(err);
    }
}