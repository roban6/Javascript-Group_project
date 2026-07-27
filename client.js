// Connect the browser to the Socket.IO server
const socket = io();

// Get all the HTML elements we need
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const messages = document.getElementById("messages");

// Listen when the form is submitted
messageForm.addEventListener("submit", (event) => {
  // Prevent the webpage from refreshing
  event.preventDefault();

  // Get the message and remove extra spaces
  const message = messageInput.value.trim();

  // Do not send an empty message
  if (!message) {
    return;
  }

  // Send the message to the server
  socket.emit("chat message", message);

  // Clear the input box
  messageInput.value = "";

  // Put the cursor back inside the input
  messageInput.focus();
});

// Listen for messages coming from the server
socket.on("chat message", (message) => {
  // Find the starting message
  const systemMessage = document.querySelector(".system-message");

  // Remove the starting message if it is still there
  if (systemMessage) {
    systemMessage.remove();
  }

  // Create a new list item
  const messageItem = document.createElement("li");

  // Add the message text
  messageItem.textContent = message;

  // Add the message to the page
  messages.appendChild(messageItem);

  // Automatically scroll to the newest message
  messages.scrollTop = messages.scrollHeight;
});