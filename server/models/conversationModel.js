import mongoose from "mongoose";

const conversationModel = new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }]
},{timestamps:true});

// Compound index for faster conversation lookup
conversationModel.index({ participants: 1 });

export const Conversation = mongoose.model("Conversation", conversationModel);
