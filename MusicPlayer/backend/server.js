import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import songRouter from "./routes/songRoutes.js";

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

app.use('/api/auth', authRouter ); // User Authentication
app.use('/api/songs',songRouter);

//Listening to server..
app.listen(PORT, () => {
    console.log("SERVER RUNNING ON", PORT);
});