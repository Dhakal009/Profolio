import mongoose from 'mongoose'

const connectDB = async ()=>{
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDb Connected : ${connection.connection.host}`);

    }catch(error){
        console.error(`MongoDb connection failed: ${error.message}`)
        process.exit(1)
    }
};

export default connectDB;