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