import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
//Create express 
const app=express();
const server=http.createServer(app);

//setting up socket.io
export const io=new Server(server,{
    cors:{origin:"*"}
})
//Store onlune users
export const useSocketMap={};

//Socket.io connection handler

io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId;
    console.log("User connected", userId);
    if(userId){
        useSocketMap[userId]=socket.id;
    }

    io.emit("get online users", Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("User disconnected", userId);
        delete useSocketMap[userId];
        io.emit("get online users", Object.keys(userSocketMap));
    })
})

//Middle wares
app.use(cors());
app.use(express.json({limit:"4mb"}));

//Routes
app.use("/api/status",(req,res)=>{
    res.send("Server is live");
});
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);

const PORT=process.env.PORT || 5000;

//Connect to the database

await connectDB();


server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});