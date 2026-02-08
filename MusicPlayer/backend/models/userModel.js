import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Required!"]
    },
    email: {
        type: String,
        required: [true, "Email is Required!"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is Required!"],
        minlength: 6,
    },
    avatar: {
        type: String,
        default: "",
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordTokenExpires: Date,
    favourites :{
        id : { type : String, default : ""},
        name : String, 
        artist_name : String,
        image : String,
        duration : String,
        audio : String,
    },
}, { timestamps: true });

// Pre-save hook for hashing password
userSchema.pre("save", async function () {
    
    // 1. If password is not modified, just return. 
    // (Mongoose automatically detects the function finished and moves on)
    if (!this.isModified("password")) return;

    // 2. Hash the password
    // (If this fails, the async function rejects and Mongoose catches the error automatically)
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
