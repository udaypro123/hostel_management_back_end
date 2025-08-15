import mongoose from "mongoose";

const connectDB = async()=>{
    try {
       const connectioInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
       console.log("✅ Connected to MongoDB")
    } catch (error) {
        console.log("error while connecting DB ")
        process.exit(1)
    }

}

export default connectDB;