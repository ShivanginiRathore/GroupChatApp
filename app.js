// import { Server } from "socket.io";

const http = require("http");
const express = require('express');

const bodyParser = require('body-parser');
var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./util/database');

const app = express();

app.use(cors());
app.set('views', 'views');

const chatController = require('./controllers/chat')

const userRoutes = require('./routes/user');
const forgotpasswordRoutes = require('./routes/forgotpassword');
const chatRoutes = require('./routes/chat')

app.use(bodyParser.json());
app.use(express.static('public'));

const User = require('./models/user');
const forgotPasswordRequest = require('./models/forgotPasswordRequest');
const Chat = require('./models/chat');
const Group = require('./models/group');
const { Op } = require("sequelize");
const Grant = require("./models/grant");

app.use(userRoutes);
app.use(forgotpasswordRoutes);
app.use(chatRoutes);

User.belongsToMany(Group, {through: Grant});
Group.belongsToMany(User, {through: Grant});
User.hasMany(Grant);
Grant.belongsTo(User);
Group.hasMany(Grant);
Grant.belongsTo(Group);

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.hasMany(Chat);
Chat.belongsTo(User);

User.hasMany(forgotPasswordRequest);
forgotPasswordRequest.belongsTo(User);

const PORT = process.env.PORT;
const server = http.createServer(app);

// Socket io setup
const io = require('socket.io')(server);
var users = {};

io.on("connection", (socket) => {
    // socket.on('new-user-joined', (username) => {
    //     users[socket.id] = username;
    //     socket.broadcast.emit('user-connected', username)
    //     io.emit("user-list", users);
    // });

    // socket.on("disconnect", () => {
    //     socket.broadcast.emit('user-disconnected', user=users[socket.id]);
    //     delete users[socket.id]; 
    //     io.emit("user-list", users);
    // })

    socket.on('newChat', (data) => {
        // socket.broadcast.emit("message", {user: data.user, msg:data.msg});
        socket.broadcast.emit("loadNewChat", data);

    })

    // load old chats
    socket.on('existsChat', async function(data){
        try{
        // const chats = await Chat.findAll({where:{[Op.or]: [{senderId : data.sender_id, receiverId : data.receiver_id}, {senderId : data.receiver_id, receiverId : data.sender_id}]}});
            const chats = await Chat.findAll({where:{groupGroupName:data.groupName}})
        socket.emit('loadChats', {chats:chats});
        } catch(err){
            console.log(err)
        }
    })
})


sequelize.sync().then(result => {
    server.listen(PORT, () => {
        console.log("Server started at ",PORT);
    })
})
.catch(err => console.log(err));
