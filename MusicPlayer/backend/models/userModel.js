import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Name is Required!"]
    },
    email : {
        type : String,
        required : [true, "Email is Required!"],
        unique : true,
        lowercase : true,
    },
    password : {
        type : String,
        required : [true, "password is Required!"],
        minLength : 6,
    },
    avatar : {
        type : String,
        default : "",
    }
}, {timestamps : true});

const User = mongoose.model('User',userSchema);
export default User;
