import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// Create express
const app = express();
const server = http.createServer(app);

// Setting up socket.io
export const io = new Server(server, {
    cors: { origin: "*" }
});

// Store online users
export const userSocketMap = {}; 

// Socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected", userId);

    if (userId) {
        userSocketMap[userId] = socket.id;  
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));  

    socket.on("disconnect", () => {
        console.log("User disconnected", userId);
        delete userSocketMap[userId]; 
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); 
    });
});

// Middlewares
app.use(cors());
app.use(express.json({ limit: "4mb" }));

// Routes
app.use("/api/status", (req, res) => {
    res.send("Server is live");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);



// Connect to the database
await connectDB();

if(process.env.NODE_ENV!=="production"){
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
}
export default server;
