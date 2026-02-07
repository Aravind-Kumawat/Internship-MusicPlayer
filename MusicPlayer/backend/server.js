import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/authRoutes.js"
import { connectDB } from "./config/db.js";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 8000;

//MongoDB connection and CORS validation
connectDB();
app.use(express.json());
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}));
// Handle API's

app.use('/api/auth', authRoute ); // User Authentication


//Listening to server..
app.listen(PORT, () => {
    console.log("SERVER RUNNING ON", PORT);
});