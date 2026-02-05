import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

//MongoDB connection
connectDB();

// Handle API's
app.get('/api',(req,res) => {
    console.log("Jai Hind Jai Bharat!");
});


//Listening to server..
app.listen(PORT, () => {
    console.log("SERVER RUNNING ON", PORT);
});