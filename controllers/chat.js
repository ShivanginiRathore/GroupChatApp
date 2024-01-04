const path = require('path');
const rootDir = path.dirname(process.mainModule.filename);

exports.loadChatPage = (req, res, next) => {
    res.sendFile(path.join(rootDir,'views','chat.html'));
}