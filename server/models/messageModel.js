import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index: true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index: true
    },
    message:{
        type:String,
        required:true
    }
},{timestamps:true});
export const Message = mongoose.model("Message", messageModel);