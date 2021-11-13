const socket = io();

const iconButton = document.querySelector('.custom-icon-wrapper');
const userList = document.querySelector('.user-list');

const blockName = document.querySelector('#block-name');
const inputName = document.querySelector('#block-name > input');
const sendName = document.querySelector('#block-name > button');

const blockChat = document.querySelector('#block-chat');
const messages = document.querySelector('#messages');
const nickname = document.querySelector('#nickname');
const form = document.querySelector('#form');
const input = document.querySelector('#input');

const USER = {
  name: '',
};

const createMessage = (message) => {
  const item = document.createElement('li');
  item.textContent = `${message.author}: ${message.message}`;
  messages.appendChild(item);

  window.scrollTo(0, document.body.scrollHeight);
};

iconButton.addEventListener('click', () => {
  iconButton.classList.add('active');
  userList.classList.remove('active');

  socket.emit('GET_ONLINE_USERS');
});
userList.addEventListener('click', () => {
  iconButton.classList.remove('active');

  while (userList.firstChild) {
    userList.removeChild(userList.firstChild);
  }
});

// Swap screen
blockName.addEventListener('submit', (e) => {
  e.preventDefault();

  if (inputName.value) {
    nickname.textContent = inputName.value;
    USER.name = inputName.value;
    input.value = '';

    socket.emit('USER_ONLINE', USER.name);

    blockName.style.display = 'none';
    blockChat.style.display = 'block';
  }
});

socket.on('USER_STATUS', (statusText) => {
  const item = document.createElement('li');

  item.textContent = statusText;

  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('GET_HISTORY', (history) => {
  history.forEach((e) => {
    createMessage(e);
  });
});

socket.on('SET_ONLINE_USERS', (users) => {
  users.forEach((el) => {
    const item = document.createElement('li');
    item.textContent = el;
    userList.appendChild(item);
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    const message = {
      author: USER.name,
      message: input.value,
    };

    createMessage(message);

    socket.emit('SEND_MESSAGE', message);
    input.value = '';
  }
});

socket.on('SEND_MESSAGE', (msg) => {
  createMessage(msg);
});
