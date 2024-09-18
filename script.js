document.getElementById('sendButton').addEventListener('click', async () => {
    const query = document.getElementById('query').value;
    if (!query.trim()) return;

    // Display the user's message
    addMessage(query, 'user');
    document.getElementById('query').value = '';

    // Show typing indicator
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.style.display = 'block';

    try {
        const response = await fetch('http://127.0.0.1:8000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_query: query })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        
        // Hide typing indicator when response is received
        typingIndicator.style.display = 'none';
        addMessage(data.result, 'bot');
    } catch (error) {
        typingIndicator.style.display = 'none';
        addMessage(`Error: ${error.message}`, 'bot');
    }
});

function addMessage(message, sender) {
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
