const socket = io();

// Get HTML elements
const setupScreen = document.getElementById("setupScreen");
const appScreen = document.getElementById("appScreen");

const userNameInput = document.getElementById("userName");
const userRoleSelect = document.getElementById("userRole");
const joinButton = document.getElementById("joinButton");

const welcomeMessage = document.getElementById("welcomeMessage");

const connectionDot = document.getElementById("connectionDot");
const connectionText = document.getElementById("connectionText");

const advisorControls = document.getElementById("advisorControls");
const statusSelect = document.getElementById("statusSelect");
const updateStatusButton = document.getElementById("updateStatusButton");

const serviceStatus = document.getElementById("serviceStatus");
const statusDescription = document.getElementById("statusDescription");
const statusIcon = document.getElementById("statusIcon");
const lastUpdated = document.getElementById("lastUpdated");

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");

const typingIndicator = document.getElementById("typingIndicator");


// Store current user information
let currentUser = {
    name: "",
    role: ""
};


// ------------------------------------
// SOCKET.IO CONNECTION
// ------------------------------------

socket.on("connect", () => {

    console.log("Connected to Socket.IO");

    connectionDot.style.backgroundColor = "#22c55e";
    connectionText.textContent = "Connected";

});


// ------------------------------------
// JOIN APPLICATION
// ------------------------------------

joinButton.addEventListener("click", () => {

    const name = userNameInput.value.trim();
    const role = userRoleSelect.value;

    if (name === "") {

        alert("Please enter your name.");

        return;

    }

    currentUser.name = name;
    currentUser.role = role;

    // Send user information to server
    socket.emit("join", {
        name: name,
        role: role
    });

    // Hide setup screen
    setupScreen.classList.add("hidden");

    // Show application
    appScreen.classList.remove("hidden");

    // Update welcome message
    welcomeMessage.textContent =
        `Welcome, ${name}!`;

    // Show advisor controls only for advisor
    if (role === "advisor") {

        advisorControls.classList.remove("hidden");

    }

});


// ------------------------------------
// REAL-TIME CHAT
// ------------------------------------

function sendMessage() {

    const messageText = messageInput.value.trim();

    if (messageText === "") {

        return;

    }

    const message = {

        name: currentUser.name,

        role: currentUser.role,

        text: messageText,

        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })

    };

    // Send message through Socket.IO
    socket.emit("chat-message", message);

    // Clear input
    messageInput.value = "";

}


// Send button
sendButton.addEventListener("click", sendMessage);


// Press Enter to send
messageInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        sendMessage();

    }

});


// Receive chat message
socket.on("chat-message", (message) => {

    const messageElement = document.createElement("div");

    // Check if message belongs to current user
    const isOwnMessage =
        message.name === currentUser.name;

    messageElement.classList.add(
        "chat-message",
        isOwnMessage ? "own-message" : "other-message"
    );

    messageElement.innerHTML = `

        <div class="message-header">

            <strong>
                ${message.name}
            </strong>

            <span>
                ${message.time}
            </span>

        </div>

        <div class="message-text">

            ${message.text}

        </div>

    `;

    chatMessages.appendChild(messageElement);

    // Automatically scroll to latest message
    chatMessages.scrollTop =
        chatMessages.scrollHeight;

});


// ------------------------------------
// REAL-TIME SERVICE STATUS
// ------------------------------------

updateStatusButton.addEventListener("click", () => {

    const newStatus = statusSelect.value;

    socket.emit("status-update", {

        status: newStatus,

        updatedBy: currentUser.name

    });

});


// Receive status update
socket.on("status-update", (data) => {

    serviceStatus.textContent =
        data.status;

    lastUpdated.textContent =
        `Updated by ${data.updatedBy}`;

    // Change icon depending on status

    if (data.status === "Vehicle Checked In") {

        statusIcon.textContent = "🔵";

        statusDescription.textContent =
            "Your vehicle has been checked in and is waiting for inspection.";

    }

    else if (data.status === "Inspection in Progress") {

        statusIcon.textContent = "🔧";

        statusDescription.textContent =
            "A technician is currently inspecting your vehicle.";

    }

    else if (data.status === "Waiting for Approval") {

        statusIcon.textContent = "⏳";

        statusDescription.textContent =
            "Your vehicle inspection is complete. Waiting for customer approval.";

    }

    else if (data.status === "Repair in Progress") {

        statusIcon.textContent = "🛠️";

        statusDescription.textContent =
            "The technician is currently working on your vehicle.";

    }

    else if (data.status === "Ready for Pickup") {

        statusIcon.textContent = "✅";

        statusDescription.textContent =
            "Your vehicle is ready for pickup!";

    }

});


// ------------------------------------
// TYPING INDICATOR
// ------------------------------------

let typingTimeout;

messageInput.addEventListener("input", () => {

    socket.emit("typing", {

        name: currentUser.name

    });

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {

        socket.emit("stop-typing");

    }, 1000);

});


socket.on("typing", (data) => {

    typingIndicator.textContent =
        `${data.name} is typing...`;

});


socket.on("stop-typing", () => {

    typingIndicator.textContent = "";

});


// ------------------------------------
// USER JOINED NOTIFICATION
// ------------------------------------

socket.on("user-joined", (user) => {

    const notification =
        document.createElement("div");

    notification.classList.add(
        "system-message"
    );

    notification.textContent =
        `${user.name} joined as ${user.role}.`;

    chatMessages.appendChild(notification);

});
