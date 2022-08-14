const express = require('express')
const path = require('path');
const http = require('http');  
const socketio = require('socket.io'); 
const app = express()

const dotenv = require('dotenv').config()

const port = process.env.PORT || 3000

const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser,getRoomUsers, userLeave} = require('./utils/users');


const Botname = 'Admin : Valere '
app.use(express.static(path.join(__dirname, 'public')));

//Run When a client  Connect

io.on('connection', (socket) => {

    socket.on('joinRoom', ({ username, room }) => { 
        
        const user = userJoin(socket.id, username, room)
        
        socket.join(user.room)
        //Welcome current User
        socket.emit('message', formatMessage(Botname, 'Welcome to Dev Chat'));

        //BroadCast when a user Connects 
        // Broadcast to a specific room with .to() methods
        socket.broadcast.to(user.room).emit('message', formatMessage(Botname, `${user.username} a rejoint le chat`));  

        //send users and room Info

        io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    })
    });


    

    console.log('New web socket Connection');

    //listen to Chat messages

    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //Run when a user Discinnect
        
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {

            io.to(user.room).emit('message', formatMessage(Botname, `${user.username} est parti`));

            io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
    })

        }
    });

}); 
server.listen(port, () => console.log(` server  listening on port ${port}!`))