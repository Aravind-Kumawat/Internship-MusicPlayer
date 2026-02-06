import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { type } from "os";
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
    },
    resetPasswordToken : {
        type : String,
    },
    resetPasswordTokenExpires : Date,
}, {timestamps : true});


//pre save call back function

userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

//compare password

userSchema.methods.comparePassword = async function (enteredPassword) 
{ return await bcrypt.compare(enteredPassword, this.password); }


const User = mongoose.model('User',userSchema);
export default User;
