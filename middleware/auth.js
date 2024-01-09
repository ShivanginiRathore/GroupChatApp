const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = async (req, res, next) => {
    try{
        const token = req.header('Authorization');
        const userObj = jwt.verify(token, 'longtoken');
        const user = await User.findByPk(userObj.userId);
        req.user = user;
        next();

    } catch(err) {
        return res.status(401).json({success: false})
    }
}