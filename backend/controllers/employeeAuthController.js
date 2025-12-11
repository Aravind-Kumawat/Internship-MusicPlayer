import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const employeeSignup = async (req, res) => {
    try {
        const {  employeeName, employeeDOB, employeeDepartment, employeeEmail, employeeAddress, employeePhone, employeePassword } = req.body;

        const employeeExists = await Employee.findOne({ employeeEmail });
        if (employeeExists) {
            return res.status(400).json({ message: "Employee already exists!" });
        }
        
        const generateEmployeeID = () => {
            const date = new Date(employeeDOB);
            const yy = date.getFullYear().toString().slice(-2);
            const mm = String(date.getMonth() + 1).padStart(2,'0');
            const dd = String(date.getDate()).padStart(2,'0');

            const random = Math.floor(100+Math.random() * 900);

            return `EMP-${yy}${mm}${dd}-${random}`;
        };
        
        const employeeID = generateEmployeeID();
        console.log("Id",employeeID);
        console.log("DOB",employeeDOB);

        const hashedPassword = await bcrypt.hash(employeePassword, 10);
        const employee = new Employee({
            employeeID, employeeName, employeeDOB, employeeDepartment, employeeEmail, employeeAddress, employeePhone, employeePassword: hashedPassword
        });

        const savedEmployee = await employee.save();

       
        return res
            .status(201)
            .json({ message: "Signup successful!", employee: savedEmployee });

    } catch (error) {
        console.log("Error in employee signup", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const employeeLogin = async (req, res) => {

    try {
        const { employeeID, employeePassword } = req.body;

        const employee = await Employee.findOne({ employeeID });
        if (!employee) {
            return res.status(404).json({ message: "Employee does not exists!" });
        }
        const isMatch = await bcrypt.compare(employeePassword, employee.employeePassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ employeeID }, process.env.JWT_SECRET, {
            expiresIn: "24h",  // change expiry time
        });

        return res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
        console.log("Error in login", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
