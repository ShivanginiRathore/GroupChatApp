const socket = io();

const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

const chats = document.querySelector(".chats");
const msg_send = document.querySelector("#send-button");
const user_msg = document.querySelector("#user-msg");
const users_dropdown = document.getElementById("user-select");
const dynamic_users = document.getElementById('users-list');

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
    div.classList.add()
    chats.appendChild(div);                 
    chats.scrollTop = chats.scrollHeight;
}

socket.on('message', (data) => {
    appendMessage(data,'incoming');
})

window.addEventListener("DOMContentLoaded", async () => {
    const users = await axios.get('/loadUsers',{headers:{"Authorization":token}});
    // console.log(users);
    users.data.forEach(user => {
        let option = document.createElement("option");
        option.text = user.name;
        users_dropdown.add(option);

        // to add users dynamically
        let userList = document.createElement("li");
        userList.textContent = user.name
        dynamic_users.appendChild(userList);
    });
})

// to get the user/groupname to start the chat
dynamic_users.addEventListener('click', userclicked);    

function userclicked(e){
    e.preventDefault();
    console.log("user clicked", e.target.textContent)
    // document.getElementById('start-head').element.style.display = 'none';();
    // document.getElementById('chat-panel').show();

    // $('.start-head').hide();
//         $('#chat-panel').show();
//     })

}


function submitGroup() {
    var groupName = document.getElementById('groupName').value;
    var selectedUsers = Array.from(document.getElementById('user-select').selectedOptions).map(option => option.value);
    
    // Do something with the group name and selected users
    console.log('Group Name:', groupName);  
    console.log('Selected Users:', selectedUsers);

    // You can perform additional actions here, such as sending the data to a server or updating the UI.
  }

// $(document).ready(function(){
//     $('.users-list').click(function(){
//     alert('uservlicked')

//         
// })