const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
  //When user dissconnects
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('new user', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('broadcast', {
      description: `${name} connected!`,
    });
    console.log(users);
  });

  //Receiving message from from
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });

  //Broadcasting to all users
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', { msg: msg, name: users[socket.id] });
  });
});

server.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
