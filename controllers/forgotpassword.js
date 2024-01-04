const path = require('path');
const rootDir = path.dirname(process.mainModule.filename);

exports.loadPage = (req, res, next) => {
    res.sendFile(path.join(rootDir,'views','forgotpassword.html'));
}

exports.sendEmail = async (req, res, next) => {
    try{
        const email = req.body.email;
        console.log("Email is ----------------------- ", email)
    }
    catch(err){

    }
}