import User from "../models/User.js"


// all user except me

export const getUsers = async (req,res)=>{
    try{
        const users = await User.find({
            _id:{ $ne: req.user.userId},
        })
        .select("-password")
        .sort({name:1});

        res.status(200).send({
            users
        });

    }catch(err){
        console.error(err);
        res.status(500).send({
            message:"Server Error"
        })
    }
}