document.getElementById('sendButton').addEventListener('click', async () => {
    const query = document.getElementById('query').value;
    if (!query.trim()) return;

    // Display the user's message
    addMessage(query, 'user');
    document.getElementById('query').value = '';

    try {
        const response = await fetch(' https://manus-server-b4013d63b07b.herokuapp.com/analyze', {
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
        addMessage(data.result, 'bot');
    } catch (error) {
        addMessage(`Error: ${error.message}`, 'bot');
    }
});

function addMessage(message, sender) {
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = message; // Use innerHTML to render HTML content
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}
