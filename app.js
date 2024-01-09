const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./util/database');

const app = express();

app.use(cors());
app.set('views', 'views');

const userRoutes = require('./routes/user');
const forgotpasswordRoutes = require('./routes/forgotpassword');
const chatRoutes = require('./routes/chat')

app.use(bodyParser.json());
app.use(express.static('public'));

const User = require('./models/user');
const forgotPasswordRequest = require('./models/forgotPasswordRequest');
const Chat = require('./models/chat')

app.use(userRoutes);
app.use(forgotpasswordRoutes);
app.use(chatRoutes);

User.hasMany(forgotPasswordRequest);
forgotPasswordRequest.belongsTo(User);

User.hasMany(Chat);
Chat.belongsTo(User);

const PORT = process.env.PORT;

sequelize.sync().then(result => {
    app.listen(PORT);
})
.catch(err => console.log(err));
