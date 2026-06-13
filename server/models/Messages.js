import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongooes.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    receiverId:{
        type:mongooes.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    image:{
        type:String
    },
    seen:{
        type:Boolean,
        default: false
    }

},{timestamps: true});
const Message = mongoose.model("Message", messageSchema);

export default Message;