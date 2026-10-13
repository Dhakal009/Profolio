import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js"


export const getMessage = async (req,res)=>{
    try{
        const senderId = req.user.userId;
        const {conversationId} = req.params;


        const conversation = await Conversation.findById(conversationId);

        if(!conversation){
            return res.status(404).send({
                message:"Conversation doesn't exist"
            });
        }

        const isParticipant = conversation.participants.some(
            (participant)=> participant.toString() === senderId.toString()
        )

        if(!isParticipant){
            return res.status(403).send({
                message:"User isn't authorized"
            })
        }

        const message = await Message.find({
            conversation:conversationId
        })
        .populate("sender","name email profilePicture")
        .sort({
            createdAt:1
        })

        res.status(200).send({
            message
        })
    }
    catch(err){
        console.error(err)
    }
}

export const sendMessage = async (req,res)=>{
    try{
        const senderId = req.user.userId;
        let {conversationId,text} = req.body;

        if(text){
            text=text.trim();
        }
        
        if(!conversationId || !text){
            return res.status(400).send({
                message:"ConversationId is not valid and text is empty"
            })
        }

        const conversation = await Conversation.findById(conversationId)
        if(!conversation){
            return res.status(404).send({
                message:"Conversation doesn't exist"
            })
        }

        const isParticipant = conversation.participants.some(
            participant => participant.toString() === senderId.toString()
        )

        if(!isParticipant){
            return res.status(403).send({
                message:"User isn't authorized "
            })
        }

       const newMessage = await Message.create({
            conversation:conversationId,
            sender:senderId,
            text:text
       })

       conversation.lastMessage = newMessage._id;
       await conversation.save();


       res.status(201).send({
        newMessage
       })

       


    }catch(err){
        console.error(err);
        res.status(500).send({
            message:"Server error"
        })
    }
}

