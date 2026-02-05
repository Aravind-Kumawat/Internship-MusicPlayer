import mongoose from "mongoose";

export async function connectDB(){
    try {
       await mongoose.connect(process.env.MONGO_URI);
       console.log("Connected to MongoDB!");
    } catch (error) {
        console.error('Error connecting to mngoDB',error);
        process.exit(1); // exit with failure
    }
}