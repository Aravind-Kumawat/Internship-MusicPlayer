import mongoose from "mongoose";

const hrSchema = new  mongoose.Schema({
    hrID : {
        type : String,
        required : true
    },
    hrName : {
        type : String,
        required : true
    },
    hrDOB : {
        type : Date, 
        required : true
    },
    hrDepartment: {
        type: String,
        required: true
    },
    hrEmail: {
        type: String,
        required: true,
        unique: true
    },
     hrPhone: {
        type: String,
        required: true
    },
    //experience
    hrAddress: {
        type: String,
        required:true
    },
    hrPassword: {
        type: String,
        required: true
    }
},{timestamps:true})

const HR = mongoose.model("HR",hrSchema);
export default HR;