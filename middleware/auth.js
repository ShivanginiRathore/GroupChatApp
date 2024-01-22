const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = async (req, res, next) => {
    try{
        const token = req.header('Authorization');
        const userObj = jwt.verify(token, 'longtoken');
        const user = await User.findOne({where:{email:userObj.email}});
        req.user = user;
        next();

    } catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
    }
}