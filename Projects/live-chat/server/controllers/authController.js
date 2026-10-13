import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

// register

export const registerUser = async (req,res)=>{
    try{

        const {name,email,password} = req.body

        if(!name || !email || !password){
            return  res.status(400).json({ message:"Please enter name, email and password"})
        }


        const existingUser =  await User.findOne({ email});

        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            })
        }


        const hasedPassword = await bcrypt.hash(password,10)


        const user =  await User.create({
            name,
            email,
            password:hasedPassword
        })

        res.status(201).json({
            message:"User Registered",
            user:{
                id: user._id,
                name:user.name,
                email:user.email
            }
        })

    }catch(error){
            console.error(error)
            res.send(500).json({
                message:"Server error"
            })
    }
};


// login

export const loginUser =  async (req,res)=>{
    try{

        const {email, password} = req.body;


        if(!email || !password){
            return res.status(400).send({message:"Please provide email and password"})
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).send({message:"Invalid email"})
        }

        const isCorrectPassword = await bcrypt.compare(
            password,
            user.password
        )

        if(!isCorrectPassword){
            return res.status(400).send({message:"Invalid password"})
        }


        // generate jwt
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        )

        res.status(200).send({
            message:"Login Successfull",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                profilePicture:user.profilePicture
            }
        })

    }catch(error){
        console.error(error);
        res.status(500).send({
            message:"Server error"
        })
    }   
}


//currentUser

export const getCurrentUser = async (req,res)=>{
    try{

        const user = await User.findById(req.user.userId).select("-password");

        if(!user){
            return  res.status(404).send({
                message:"User not found",
            });
        }

        res.status(200).send({
            user
        });

    }catch(err){
        console.error(err);
        res.status(500).send({
            message:"Server error"
        });
    }
};