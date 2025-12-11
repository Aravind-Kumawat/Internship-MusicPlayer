import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    employeeID: {
        type: String,
        unique: true
    },
    employeeName: {
        type: String,
        required: true
    },
    employeeDOB : {
        type : Date,
        required : true
    },
    employeeDepartment: {
        type: String,
        required: true
    },
    employeeEmail: {
        type: String,
        required: true,
        unique: true
    },
    employeePhone: {
        type: String,
        required: true
    },
    //experience
    employeeAddress: {
        type: String,
        required:true
    },
    employeePassword: {
        type: String,
        required: true
    },

}, {timestamps: true});

const Employee = mongoose.model("Employee",employeeSchema);

export default Employee;