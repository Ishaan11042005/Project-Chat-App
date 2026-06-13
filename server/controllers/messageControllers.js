
//Get all users except logged in user

import Message from "../models/Messages.js";
import User from "../models/User.js";

export const getUsersForSideBar=async(req,res)=>{
    try {
        const userId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:userId}}).select("-password");

        const unseenMessages={};
        const promises=filteredUsers.map(async(user)=>{
        const messages=await Message.find({senderId:user._id,receiverId:user._id,seen:false});
        if(messages.length>0){
            unseenMessages[user._id]=messages.length;
        }
        })
        await Promise.all(promises);
        res.json({success:true,users:filteredUsers,unseenMessages:unseenMessages})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message} )
    }
}

//get all message for selected user