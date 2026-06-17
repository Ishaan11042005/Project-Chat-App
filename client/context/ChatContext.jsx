import { useState } from "react";
import { useContext } from "react";
import { Children } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { sendMessage } from "../../server/controllers/messageControllers";

export const ChatContext=createContext();

export const ChatProvider=()=>{

    const [messages,setMessages]=useState([]);
    const [userSocketMap,setUsers]=useState([]);
    const [selectedUser,setSelectedUser]=useState(null);
    const [unseenMessages,setUnseenMessages]=useState({});
    const {socket,axios}=useContext(AuthContext);

    const getUsers=async()=>{
        try {
            const {data}=await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.Users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //for getting messages
    const getMessages=async(userId)=>{
        try {
            const {data}=await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //to send to selected user
    const sendMessage=async(messageData)=>{
        try {
            const {data}=await axios.post(`/api/messages/send/${selectedUser._id}`,messageData)
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages,data.newMessage])
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //to subscribe to messages for user
    const  subscribeToMessages=async()=>{
        if(!socket){
            return;
        }

        socket.on("newMessage",(newMessage)=>{
            if(selectedUser && newMessage.senderId===selectedUser._id){
                newMessage.seen=true;
                setMessages((prevMessages)=>[...prevMessages,newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }
            else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages,[newMessage.senderId]:
                    prevUnseenMessages[newMessage.senderId]?
                    prevUnseenMessages[newMessage.senderId]+1:1 
                }))
            }
        })
    }
    
    //function to unsubscribe
    const unsubscribeFromMessages=()=>{
        if(socket) socket.off("newMessage")
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    },[socket,selectedUser])

    const value={
        messages,Users,selectedUser,getUsers,setMessages,sendMessage,setSelectedUser,
        unseenMessages,setUnseenMessages
    }
    return 
    (
    <ChatContext.Provider value={value}>
        {Children}
    </ChatContext.Provider>
    )
}