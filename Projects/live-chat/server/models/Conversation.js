import mongoose from "mongoose";


const ConversationSchemea = new mongoose.Schema(
    {
        participants:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
        ],

        lastMessage:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message",
            default:null
        }
    },
    {
        timestamps:true,
    }
);

const Conversation = mongoose.model(
    "Conversation",
    ConversationSchemea
);

export default Conversation;