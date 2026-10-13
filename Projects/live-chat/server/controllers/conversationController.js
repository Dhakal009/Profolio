import Conversation from "../models/Conversation.js";
import User from "../models/User.js"


export const createOrGetConversation =  async (req,res)=>{
    try{

        const currentUserId = req.user.userId;
        const {userId} = req.body

        if(currentUserId === userId){
            return res.status(400).send({
                message:"You cann't create a conversation with yourself"
            })
        }

        const conversation = await Conversation.findOne({
            participants:{
                $all:[currentUserId,userId]
            }
        });

        if(conversation){
            return res.status(200).send({
                conversation
            })
        }
        else{
            const newConversation = await Conversation.create({
                participants:[currentUserId,userId]
            })

            return res.status(201).send({
                conversation:newConversation
            })
        }

    }catch(err){

        console.error(err)
        res.status(500).send({
            message:"Server error"
        })
    }
};