const socket = io();


const token = localStorage.getItem('token');
const username = localStorage.getItem('username');
var chats = document.querySelector(".chats");
var users_list = document.querySelector(".users-list");
var users_count = document.querySelector(".users-count");
var msg_send = document.querySelector("#user-send");
var user_msg = document.querySelector("#user-msg");


socket.emit('new-user-joined', username);

socket.on('user-connected', (socket_name) => {
    userJoinLeft(socket_name, "joined")
})

function userJoinLeft(name, status){
    let div = document.createElement("div");
    div.classList.add('user-join');
    let content = `<p><b>${name}</b>${status} the chat<p>`;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

socket.on('user-disconnected', (socket_name) => {
    userJoinLeft(socket_name, "left")
})

socket.on('user-list', (users) => {
    users_list.innerHTML="";
    users_arr = Object.values(users);
    for(i=0; i<users_arr.length; i++){
        let p = document.createElement('p');
        p.innerText = users_arr[i];
        users_list.appendChild(p);

    }
    users_count.innerHTML = users_arr.length;

})

msg_send.addEventListener('click', () => {
    let data = {
        user: username,
        msg: user_msg.value
    };
    if(user_msg.value!=''){
        appendMessage(data,'outgoing');
        socket.emit('message', data);
        user_msg.value = '';

    }
})

function appendMessage(data, status) {
    let div = document.createElement('div');
    div.classList.add('message', status);
    let content = `<h5>${data.user}</h5>
    <p>${data.msg}</p>`;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

socket.on('message', (data) => {
    appendMessage(data,'incoming');
})

function showMessageinChatBox(message){
    const chatBox = document.getElementById('chat-box');
    const newMessage = document.createElement('div');
    newMessage.className = 'message';
    newMessage.textContent = message;

    chatBox.appendChild(newMessage);
}

// window.addEventListener("DOMContentLoaded", async () => {
//     const chats = await axios.get('/loadChats',{headers:{"Authorization":token}});

//     chats.data.forEach(row => {
//         showMessageinChatBox(row.message);
//     });

// })

// async function sendMessage() {
//     const messageInput = document.getElementById('user-msg');
//     const message = messageInput.value.trim();


//     if (message !== '') {
//         const chatBox = document.getElementById('chat-box');
//         const newMessage = document.createElement('div');
//         newMessage.className = 'message';
//         newMessage.textContent = message;

//         chatBox.appendChild(newMessage);
//         let messageDetails = {
//             message
//         }
//         const response = await axios.post("/saveMessage", messageDetails, {headers: {"Authorization":token}});

//         // Clear the input field after sending the message
//         messageInput.value = '';

//         // Optionally, you can implement functionality to scroll to the bottom of the chat box
//         chatBox.scrollTop = chatBox.scrollHeight;
//     }
// }
