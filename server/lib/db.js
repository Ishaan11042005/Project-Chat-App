import mongoose from "mongoose";
//connect to the database
export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => console.log("Connected to the database"));  
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
    }
    catch (error) { 
        console.log(error);
    }
};