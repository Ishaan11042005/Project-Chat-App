//signup a new User
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
    const {email, fullName, password, bio} = req.body;  // ← ADDED bio
    try {
        if(!fullName || !email || !password || !bio){
            return res.json({success:false, message:"All fields are required"});
        }
        const user = await User.findOne({email});
        if(user){
            return res.json({success:false, message:"User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            fullName, email, password:hashedPassword, bio
        });
        const token = generateToken(newUser._id);

        res.json({success:true, userData:newUser, token, message:"User created successfully"});
    }
    catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message});
    }
}

//login an existing user

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const userData = await User.findOne({email});

        if(!userData){   // ← ADDED null check
            return res.json({success:false, message:"User not found"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if(!isPasswordCorrect){
            return res.json({success:false, message:"Invalid credentials"});
        }

        const token = generateToken(userData._id);
        res.json({success:true, userData, token, message:"Login successful"});
    }
    catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message});
    }
}

//controller to check user authentication status

export const checkAuth = (req, res) => {
    res.json({success:true, userData:req.user});
}

//update profile

export const updateProfile = async (req, res) => {
    try {
        const {profilePic, fullName, bio} = req.body;
        const userId = req.user._id;
        let updatedUser;

        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new:true});  // ← ADDED updatedUser =
        }
        else{
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, {profilePic:upload.secure_url, bio, fullName}, {new:true});
        }
        res.json({success:true, user:updatedUser});
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message});
    }
}