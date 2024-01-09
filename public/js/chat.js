async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    const token = localStorage.getItem('token');


    if (message !== '') {
        const chatBox = document.getElementById('chat-box');
        const newMessage = document.createElement('div');
        newMessage.className = 'message';
        newMessage.textContent = message;

        chatBox.appendChild(newMessage);
        let messageDetails = {
            message
        }
        const response = await axios.post("/saveMessage", messageDetails, {headers: {"Authorization":token}});

        // Clear the input field after sending the message
        messageInput.value = '';

        // Optionally, you can implement functionality to scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
