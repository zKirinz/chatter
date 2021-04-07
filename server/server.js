const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
//http://localhost:5000/socket.io/socket.io.js//
const publicPath = path.join(__dirname + '/../public');
const io = socketIO(server);

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {Users} = require('./utils/users');

let users = new Users();

io.on('connection', (socket) => {
  socket.on('USER_INFO', (msg) => {
    const {name, room} = msg;

    socket.join(room);

    users.addUser(socket.id, name, room);
    io.to(room).emit('USERS_IN_ROOM', {
      usersInRoom: users.getListofUsersInRoom(room),
    });

    socket.emit(
      'MESSAGE_TO_CLIENT',
      generateMessage('Admin', `Welcome to the chat app  room #${room}`)
    );

    socket.broadcast
      .to(room)
      .emit('MESSAGE_TO_CLIENT', generateMessage('Admin', `${name} has joined the room`));
  });

  socket.on('MESSAGE_TO_SERVER', (msg) => {
    const user = users.getUserById(socket.id);
    console.log(socket.id);

    io.to(user.room).emit('MESSAGE_TO_CLIENT', generateMessage(msg.from, msg.content));
  });

  socket.on('LOCATION_TO_SERVER', (msg) => {
    const user = users.getUserById(socket.id);
    io.to(user.room).emit(
      'LOCATION_TO_CLIENT',
      generateLocationMessage(msg.from, msg.lat, msg.lng)
    );
  });

  socket.on('disconnect', () => {
    const user = users.removeUserById(socket.id);

    if (user) {
      io.to(user.room).emit('USERS_IN_ROOM', {
        usersInRoom: users.getListofUsersInRoom(user.room),
      });
      io.to(user.room).emit(
        'MESSAGE_TO_CLIENT',
        generateMessage('Admin', `<${user.name}> has left the room`)
      );
    }
  });
});

app.use(express.static(publicPath));

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
// Design pattern Observer (lifecycle hook, mongoose.pre(), ...)
// socket.emit 1
// io.emit N
// socket.broadcast.emit N-1
