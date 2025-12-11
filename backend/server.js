import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import hrRoutes from "./routes/hrRoutes.js"

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5050;

app.use("/employee",employeeRoutes);
app.use("/HR",hrRoutes);


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on the PORT ", PORT);
    })
}) 