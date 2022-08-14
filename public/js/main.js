const chatForm = document.getElementById('chat-form'); 
const chatMessages = document.querySelector('.chat-messages')

const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');      

const socket = io(); 
 
//Message from the server

socket.on('message', (message) => {
    console.log(message);
    outPutMessage(message);

    // Auto Scroll Down 
    chatMessages.scrollTop = chatMessages.scrollHeight;
     
});

// Message Submit

chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    //Get Message Text

    const msg = e.target.elements.msg.value;
    console.log(msg);

    // emit Chat message to the server 
    socket.emit('chatMessage', msg);
    // clear input 
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();

})

function outPutMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>`;
    document.querySelector('.chat-messages').appendChild(div); 
}

// Get UserName And Room From  Url 

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix : true    
});

console.log(username, room);

// join Chat Room 

socket.emit('joinRoom', { username, room });

// Get Rooms and Users  

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

// Add Room Name to Dom 

function outputRoomName(room) {
    roomName.innerText = room;
}

// Add user to Dom 

function outputUsers(users) {
     userList.innerHTML=`${users.map(user=>`<li>${user.username}<li>`).join('')}`
}