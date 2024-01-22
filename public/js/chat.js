const socket = io();

const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

const chats = document.querySelector(".chats");
const msg_send = document.querySelector("#send-button");
const user_msg = document.querySelector("#user-msg");
const users_dropdown = document.getElementById("user-select");
const search_users_dropdown = document.getElementById("member-select");

const dynamic_users = document.getElementById('users-list');
const group_members = document.getElementById('group-members-name');

let sender_id = localStorage.getItem('useremail');
let groupName;


var debounceTimer;

function searchUsers() {
            // Get the value from the search input
    var searchTerm = document.getElementById('userInput').value;
    document.getElementById('error_message').innerHTML = '';


    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async function() {
        // document.getElementById('searchResults').innerHTML = 'Searching for: ' + searchTerm;
        let userDetails = {
            name:searchTerm
        }
        const response = await axios.post('/searchUsers',userDetails,{headers:{"Authorization":token}});
        console.log(response.data);
        search_users_dropdown.innerHTML='';
        response.data.forEach(user => {
            let option = document.createElement("option");
            option.text = user.name;
            search_users_dropdown.add(option);
        })
    }, 300);
}


// Attach the searchUsers function to the oninput event of the input field
document.getElementById('userInput').oninput = searchUsers;
search_users_dropdown.addEventListener('click', newUserSelected);    

async function newUserSelected(e){
    e.preventDefault();
    // let newUserName = e.target.textContent;
    var newUserName = Array.from(document.getElementById('member-select').selectedOptions).map(option => option.value);

    document.getElementById('userInput').value = newUserName;
}

async function addNewUser(){
    let newUser = document.getElementById('userInput').value;
    let userDetails = {
        newUser,
        groupName
    }
    const response = await axios.post('/addNewUser',userDetails,{headers:{"Authorization":token}});
    if(response.data.success){
        let userList = document.createElement("li");
        userList.textContent = newUser;
        userList.setAttribute('id',newUser);

        // because add user can be performed only by admin
        let deleteButton = document.createElement("button");
        deleteButton.innerText = 'Delete';
        deleteButton.addClass = 'delete-btn';
        userList.appendChild(deleteButton);
        
        group_members.appendChild(userList);

    }else{
        // console.log(response.data.message)
        document.getElementById('error_message').innerHTML += `<div style="color:red;"> ${response.data.message} </div>`;
    }
    

}

msg_send.addEventListener('click', async () => {
    try{
        let msg = user_msg.value;
    
    if(user_msg.value!=''){
        
        messageDetails = {
            sender_id,
            groupName,
            message:msg
        }
        const response = await axios.post("/saveMessage", messageDetails, {headers: {"Authorization":token}});
        console.log(response)
        if(response.data.success){
            let data = response.data.data
            
            user_msg.value = '';
            appendMessage(data,'outgoing');
            // socket.emit('message', data);
            socket.emit('newChat', data);

        } else {
            alert(response.data);
        }
    }
    }catch(err){
        console.log(err);
        }
    
})



function appendMessage(data, status) {
    let div = document.createElement('div');
    div.classList.add('message', status);
    let content = `<h5>${data.senderId}</h5>
     <p>${data.message}</p>`;
    div.innerHTML=content;
    div.classList.add()
    chats.appendChild(div);                 
    chats.scrollTop = chats.scrollHeight;
}

socket.on('message', (data) => {
    appendMessage(data,'incoming');
})
socket.on('loadNewChat', (data) => {
    // if(sender_id == data.receiverId && receiver_id == data.senderId){
    //     appendMessage(data,'incoming');

    // }
    if(groupName == data.receiverId){
        appendMessage(data,'incoming');

    }

    
})

window.addEventListener("DOMContentLoaded", async () => {
// to display the user name above
    let content = `<h4>Welcome ${username}</h4>`;
    document.getElementById('welcome_msg').innerHTML=content;

    let userDetails = {
        email:sender_id
    }

    const response = await axios.post('/loadUsers',userDetails,{headers:{"Authorization":token}});
    console.log(response)
    response.data.users.forEach(user => {
        let option = document.createElement("option");
        option.text = user.name;
        users_dropdown.add(option);

        // to add users dynamically
        // createUserList(user.name, user.email, '');
        
    });

    response.data.adminOfGroups.forEach(user => {
        createUserList(user.groupName, user.admin, 'group')
    })

    response.data.memberOfGroups.forEach(user => {
        createUserList(user.groupName,user.name, 'group')
    })
})

function createUserList(name, email, isGroup){
    let userList = document.createElement("li");
    // to add group icon if its a group
    if(isGroup === 'group'){
        // console.log('inside group image')
        const icon = document.createElement("img");
        icon.src = "/src/user.svg";
        userList.appendChild(icon)
    }
    userList.textContent = name;
    userList.id = email;
    dynamic_users.appendChild(userList);

}

// to click the user/groupname to start the chat
dynamic_users.addEventListener('click', userclicked);    

async function userclicked(e){
    e.preventDefault();
    groupName = e.target.textContent;

    // hide the user/group names and show the group details only if the clicked name is a group
    document.getElementById('users-panel').style.display = 'none';
    document.getElementById('group-details').style.display = 'block';

    let group = {
        groupName
    }

    const response = await axios.post('/loadGroupMembers',group,{headers:{"Authorization":token}});
    let admin = response.data.admin.admin;

    // to show the add user functionality for admin user
    if(username == admin){
        document.getElementById('admin-rights-add-user').style.display = 'block';
    } else {
        document.getElementById('admin-rights-add-user').style.display = 'none';
    }

    let adminList = document.createElement("li");
    let adminLabel = document.createElement("label");
    adminLabel.textContent = 'Admin';
    adminList.appendChild(adminLabel);
    let content = `<p>${admin}<h6><i>~admin</i></h6>`;
    adminList.innerHTML=content;
    group_members.appendChild(adminList);

    response.data.groupMembers.forEach(user => {
        let userList = document.createElement("li");
        userList.textContent = user.name;
        userList.setAttribute('id',user.name);

        if(username == admin){
            let deleteButton = document.createElement("button");
            deleteButton.innerText = 'Delete';
            deleteButton.classList = 'delete-btn';
            userList.appendChild(deleteButton);
        }
        // userList.id = user.email;
        group_members.appendChild(userList);
    })

    

    receiver_id = e.target.id;
    document.getElementById('start-head').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';

    socket.emit('existsChat', {groupName:groupName});
}

function backToUserPanel(){
    document.getElementById('users-panel').style.display = 'block';
    document.getElementById('group-members-name').innerHTML = '';
    document.getElementById('group-details').style.display = 'none';
    document.getElementById('start-head').style.display = 'block';
    document.getElementById('chat-container').style.display = 'none';
}
// new group creation
async function submitGroup() {
    var groupName = document.getElementById('groupName').value;
    var selectedUsers = Array.from(document.getElementById('user-select').selectedOptions).map(option => option.value);
    
    // Do something with the group name and selected users
    console.log('Group Name:', groupName);  
    console.log('Selected Users:', selectedUsers);
    let groupDetails = {
        groupName,
        sender_id
    }
    let memberDetails = {
        selectedUsers,
        groupName
    }

    const response = await axios.post('/createGroup',groupDetails,{headers:{"Authorization":token}});
    const membersResponse = await axios.post('/storeGroupMembers',memberDetails,{headers:{"Authorization":token}});
    // console.log(response);
    // to add group name in left panel when created
    let groupList = document.createElement("li");
    // let adminButton = document.createElement("button");

    groupList.textContent = groupName;
    // groupList.id = admin
    // adminButton.textContent = 'View details';
    // adminButton.classList = 'button';
    // groupList.appendChild(adminButton);
    dynamic_users.appendChild(groupList);

  }


//   load old chats
  socket.on('loadChats', function(data){
    let chats = data.chats;

    document.getElementById('chat-box').innerHTML = '';
    
    chats.forEach(chat => {
        let addClass = '';
        if(chat.senderId == username){
            addClass = 'outgoing'
        } else {
            addClass = 'incoming'
        }

        appendMessage(chat,addClass);
    })

    
  })

group_members.addEventListener('click', deleteUserFromGroup);

async function deleteUserFromGroup(e){

    if(e.target.classList.contains('delete-btn')){
        const deleteUser = e.target.parentNode.id;

        let userDetails = {
            deleteUser
        }
        const response = await axios.post('/deleteUser',userDetails,{headers:{"Authorization":token}});
        if(response.data.success){
            group_members.removeChild(e.target.parentNode);
        }
    }
}