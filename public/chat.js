document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('uploadForm').addEventListener('submit', uploadPhoto);
document.getElementById('userInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

let currentStep = 0;
let chatEnded = false;

function updateChatbox(message, sender = 'bot') {
    const chatbox = document.getElementById('chatbox');
    const messageElement = document.createElement('p');

    if(sender === 'bot') {
        // Typing animation
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerText = 'Typing...';
        chatbox.appendChild(typingIndicator);
        setTimeout(() => {
            chatbox.removeChild(typingIndicator);
            messageElement.innerText = message;
            messageElement.className = 'alert alert-secondary';
            chatbox.appendChild(messageElement);
            chatbox.scrollTop = chatbox.scrollHeight;

            // Check if the message includes the photo upload prompt
            if (message.includes('upload a clear photo')) {
                document.getElementById('uploadForm').style.display = 'block';
            } else {
                document.getElementById('uploadForm').style.display = 'none';
            }
        }, 1000); // Simulates a 1-second typing delay
    } else {
        messageElement.innerText = message;
        messageElement.className = 'alert alert-info';
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    }
}

function sendMessage() {
    if (chatEnded) return;
    const userInput = document.getElementById('userInput').value;
    document.getElementById('userInput').value = '';

    if (!userInput.trim()) return;

    updateChatbox(userInput, 'user');

    const formData = new FormData();
    formData.set('step', currentStep);
    formData.set('text', userInput);

    fetch('/chat', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        updateChatbox(data.bot_message);

        // Check if the bot's response requires a photo upload
        if (data.user_prompt) {
            updateChatbox(data.user_prompt);
            if (data.user_prompt.includes('upload a clear photo')) {
                document.getElementById('uploadForm').style.display = 'block';
            } else {
                document.getElementById('uploadForm').style.display = 'none';
            }
        } else {
            endChat();
        }
        currentStep++;
    })
    .catch(error => console.error('Error:', error));
}

function uploadPhoto(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    fetch('/chat', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        updateChatbox(data.bot_message);
        document.getElementById('uploadForm').style.display = 'none';
        endChat();
    })
    .catch(error => console.error('Error:', error));
}

function endChat() {
    updateChatbox("Do you have any questions for us?", 'bot');
    document.getElementById('sendButton').onclick = function () {
        if (document.getElementById('userInput').value.trim().toLowerCase() === 'yes') {
            updateChatbox("Type your question and press send.", 'bot');
        } else {
            updateChatbox("Thank you for your participation. Goodbye!", 'bot');
            document.getElementById('userInput').disabled = true;
            document.getElementById('sendButton').disabled = true;
            chatEnded = true;
        }
    };
}