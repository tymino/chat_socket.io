const path = require('path');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

const PORT = 8787;

const historyMsg = [];
const users = [];

app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   // res.sendFile(`${__dirname}/index.html`);
//   console.log('test');
// });

io.on('connection', (socket) => {
  socket.broadcast.emit('user_status', socket.connected);

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`listening on: ${PORT}`);
});
