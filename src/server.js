const path = require('path');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

const PORT = 8787;

const URL_PAGES = {
  home: `${__dirname}/pages/index.html`,
};

const historyMsg = [];
let users = [
  { id: 'mMkfaVQKrAF8jET-AAAF', userName: 'qweqwe' },
  { id: 'mMkfaVQKrAF8jET-AAA', userName: 'weqewewqew' },
];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(URL_PAGES.home);
});

// io
io.on('connection', (socket) => {
  socket.on('USER_ONLINE', (userName) => {
    users.push({
      id: socket.id,
      userName,
    });

    const statusText = `User ${userName} - connection`;
    socket.broadcast.emit('USER_STATUS', statusText);

    console.log(users);
  });

  socket.on('disconnect', () => {
    const newUsers = users.filter((user) => {
      if (user.id === socket.id) {
        const statusText = `User ${user.userName} - disconnect`;
        socket.broadcast.emit('USER_STATUS', statusText);
        return false;
      } else {
        return true;
      }

    });

    users = newUsers;
  });

  socket.on('SEND_MESSAGE', (msg) => {
    io.emit('SEND_MESSAGE', msg);
  });
});

server.listen(PORT, () => {
  console.log(`listening on: ${PORT}`);
});
