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
const server = http.createServer(app);

// Socket io setup
const io = require('socket.io')(server);
var users = {};

io.on("connection", (socket) => {
    socket.on('new-user-joined', (username) => {
        users[socket.id] = username;
        socket.broadcast.emit('user-connected', username)
        io.emit("user-list", users);
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit('user-disconnected', user=users[socket.id]);
        delete users[socket.id]; 
        io.emit("user-list", users);

    })

    socket.on('message', (data) => {
        socket.broadcast.emit("message", {user: data.user, msg:data.msg});
    })
})


sequelize.sync().then(result => {
    server.listen(PORT, () => {
        console.log("Server started at ",PORT);
    })
})
.catch(err => console.log(err));
