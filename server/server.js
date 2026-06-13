import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";

//Create e
// xpress 
const app=express();
const server=http.createServer(app);

//Middle wares
app.use(cors());
app.use(express.json({limit:"4mb"}));

//Routes
app.use("/api/status",(req,res)=>{
    res.send("Server is live");
});
app.use("/api/auth",userRouter);


const PORT=process.env.PORT || 5000;

//Connect to the database

await connectDB();


server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});