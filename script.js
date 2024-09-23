document.getElementById("fileInput").addEventListener("change", (event) => {
    const fileName = event.target.files[0] ? event.target.files[0].name : "No file chosen";
    document.getElementById("fileLabel").textContent = fileName; // Update label with selected file name
});

document.getElementById("uploadButton").addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    const uploadMessage = document.getElementById("uploadMessage");

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    // Show loading spinner
    showLoadingSpinner();

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("https://manus-server-b4013d63b07b.herokuapp.com/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        uploadMessage.style.color = "green";
        uploadMessage.textContent = "File Uploaded Successfully";

        // Display success checkmark
        displayCheckmark();
    } catch (error) {
        console.error("Error uploading file:", error);
        uploadMessage.style.color = "red";
        uploadMessage.textContent = "Error uploading file: " + error.message;
    } finally {
        // Hide loading spinner
        hideLoadingSpinner();
    }
});

// Existing event listeners for sending messages
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
        const response = await fetch('https://manus-server-b4013d63b07b.herokuapp.com/analyze', {
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

function showLoadingSpinner() {
    const button = document.getElementById("uploadButton");
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    button.insertBefore(spinner, button.firstChild); // Insert spinner before button text
}

function hideLoadingSpinner() {
    const button = document.getElementById("uploadButton");
    const spinner = button.querySelector('.loading-spinner');
    if (spinner) {
        button.removeChild(spinner); // Remove the spinner
    }
}

function displayCheckmark() {
    const button = document.getElementById("uploadButton");
    const checkmark = document.createElement('span');
    checkmark.className = 'checkmark';
    checkmark.innerHTML = '&#10003;'; // Checkmark symbol
    button.appendChild(checkmark);
}
