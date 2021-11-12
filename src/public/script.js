const socket = io();

const blockName = document.querySelector('#block-name');
const inputName = document.querySelector('#block-name > input');
const sendName = document.querySelector('#block-name > button');

const blockChat = document.querySelector('#block-chat');
const messages = document.getElementById('messages');
const nickname = document.getElementById('nickname');
const form = document.getElementById('form');
const input = document.getElementById('input');

const user = {
  name: '',
  message: '',
};

// Swap screen
sendName.addEventListener('click', (e) => {
  if (inputName.value) {
    nickname.textContent = inputName.value;
    user.name = inputName.value;
    input.value = '';

    socket.emit('USER_ONLINE', user.name);

    blockName.style.display = 'none';
    blockChat.style.display = 'block';
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('SEND_MESSAGE', input.value);
    input.value = '';
  }
});

socket.on('SEND_MESSAGE', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('USER_STATUS', (statusText) => {
  const item = document.createElement('li');

  item.textContent = statusText;

  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
