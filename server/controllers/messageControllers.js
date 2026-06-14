//Get all users except logged in user

import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Messages.js";
import User from "../models/User.js";
import { io, useSocketMap } from "../server.js";


export const getUsersForSideBar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:userId}}).select("-password");

        const unseenMessages = {};
        const promises = filteredUsers.map(async(user) => {
            const messages = await Message.find({senderId:user._id, receiverId:userId, seen:false});  // ← FIXED receiverId
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success:true, users:filteredUsers, unseenMessages:unseenMessages})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

//get all message for selected user

export const getMessages=async(req,res)=>{
    try {
        const {id:slelectedUserId}=req.params;   
        const myId=req.user._id;
        
        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:slelectedUserId},
                {senderId:slelectedUserId,receiverId:myId}
            ]
        })
        await Message.updateMany({senderId:slelectedUserId,receiverId:myId,seen:true});
        res.json({success:true,messages})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message} )
    }
}

//api to mark messages as seen

export const markMessagesAsSeen=async(req,res)=>{
    try {
        const {id}=req.params;
        await Message.findByIdAndUpdate(id,{seen:true});
        res.json({success:true})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message} )
    }
}

//Send message from one user to another

export const sendMessage=async(req,res)=>{
    try {
        const {text,image}=req.body;

        const reveiverId=req.params.id;   
        const senderId=req.user._id; 
        let imageurl;
        if(image){
            const uploadRepsonse=await cloudinary.uploader.upload(image);
            inageurl=uploadRepsonse.secure_url;
        }
        const newMessage=await Message.create({
            senderId,
            receiverId,
            text,
            image:imageurl
        })
        const reciverSocketId=useSocketMap[reveiverId];
        if(reciverSocketId){
            io.to(reciverSocketId).emit("new message", newMessage);
        }
        res.json({success:true,newMessage});
        
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message} )
    }
}