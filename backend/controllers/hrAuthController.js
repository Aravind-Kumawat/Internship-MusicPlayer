import bcrypt from "bcryptjs";
import HR from "../models/HR.js";
import jwt from "jsonwebtoken";

export const hrSignup = async (req, res) => {
    try {
        const {  hrName, hrDOB, hrDepartment, hrEmail, hrAddress, hrPhone, hrPassword } = req.body;

        const hrExists = await HR.findOne({hrEmail});
        if (hrExists) {
            return res.status(400).json({ message: "hr already exists!" });
        }
        
        const generatehrID = () => {
            const date = new Date(hrDOB);
            const yy = date.getFullYear().toString().slice(-2);
            const mm = String(date.getMonth() + 1).padStart(2,'0');
            const dd = String(date.getDate()).padStart(2,'0');

            const random = Math.floor(100+Math.random() * 900);

            return `HR-${yy}${mm}${dd}-${random}`;
        };
        
        const hrID = generatehrID();
        console.log("Id",hrID);
        console.log("DOB",hrDOB);

        const hashedPassword = await bcrypt.hash(hrPassword, 10);
        const hr = new HR({
            hrID, hrName, hrDOB, hrDepartment, hrEmail, hrAddress, hrPhone, hrPassword: hashedPassword
        });

        const savedhr = await hr.save();

       
        return res
            .status(201)
            .json({ message: "Signup successful!", hr: savedhr });

    } catch (error) {
        console.log("Error in hr signup", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const hrLogin = async (req, res) => {

    try {
        const { hrID, hrPassword } = req.body;

        const hr = await HR.findOne({ hrID });
        if (!hr) {
            return res.status(404).json({ message: "hr does not exists!" });
        }
        const isMatch = await bcrypt.compare(hrPassword, hr.hrPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ hrID }, process.env.JWT_SECRET, {
            expiresIn: "24h",  // change expiry time
        });

        return res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
        console.log("Error in login", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
