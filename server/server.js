import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { connectDB } from "./lib/db.js";

//Create e
// xpress 
const app=express();
const server=http.createServer(app);

//Middle wares
app.use(cors());
app.use(express.json({limit:"4mb"}));
app.use("/api/status",(req,res)=>{
    res.send("Server is live");
});


const PORT=process.env.PORT || 5000;

//Connect to the database

await connectDB();


server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});