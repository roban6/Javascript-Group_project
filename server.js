<<<<<<< HEAD
// Import express so we can create the web server
const express = require("express");

// Import http because Socket.IO needs an HTTP server
const http = require("http");

// Import path to connect our public folder
const path = require("path");

// Import the Socket.IO server
const { Server } = require("socket.io");

// Create the Express app
const app = express();

// Create the HTTP server
const server = http.createServer(app);

// Connect Socket.IO to the HTTP server
const io = new Server(server);

// Use port 3000 when running locally
const PORT = process.env.PORT || 3000;

// Show all files inside the public folder
app.use(express.static(path.join(__dirname, "public")));

// Listen when a user connects to the chat
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for messages sent from the client
  socket.on("chat message", (message) => {
    console.log(`Message received: ${message}`);

    // Send the message to every connected user
    io.emit("chat message", message);
  });

  // Listen when a user disconnects
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
=======
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Socket.IO connection
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // User joins the application
    socket.on("join", (user) => {
        console.log(`${user.name} joined as ${user.role}`);

        socket.broadcast.emit("user-joined", {
            name: user.name,
            role: user.role
        });
    });

    // Real-time chat message
    socket.on("chat-message", (message) => {
        io.emit("chat-message", message);
    });

    // Real-time service status update
    socket.on("status-update", (status) => {
        io.emit("status-update", status);
    });

    // User is typing
    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data);
    });

    // User stopped typing
    socket.on("stop-typing", () => {
        socket.broadcast.emit("stop-typing");
    });

    // User disconnected
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`AutoCare Live is running at http://localhost:${PORT}`);
});
>>>>>>> b6ea57b490f2b5c6df90296c0922e081e27622d7
