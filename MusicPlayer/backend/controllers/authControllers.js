import imagekit from "../config/imagekit.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
//creating token

const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

const signup = async (req, res) => {
    try {

        //get the data
        const { name, email, password, avatar } = req.body;

        //Check the data is correct or not?
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, password and email are required" });
        }
        //Existing User?
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(400).json({ message: "Email already Exists!!" });
        }
        //setting up avatar
        let avatarUrl = "";
        if (avatar) {
            const uploadResponse = await imagekit.upload({
                file: avatar,
                fileName: `avatar_${Date.now()}.jpg`,
                folder: '/mern-music-player',
            });
            avatarUrl = uploadResponse.url;
        }
        //Create User if doesn't exists
        const user = await User.create({ name, email, password, avatar: avatarUrl });

        //creating Token
        const user_token = createToken(user._id);

        return res.status(201).json({
            message: "User Created Succesfully",
            user: {
                id: user._id,
                name: user.name,
                eamil: user.email,
                avatar: user.avatar,
            },
            user_token,
        });

    } catch (error) {
        console.error("SignUp Error", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password required!" });
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "Email Id doesn't exist" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials!" });
        }
        const user_token = createToken(user._id);
        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                eamil: user.email,
            },
            user_token,
        });
    } catch (error) {
        console.error("Login not succesfull", error);
        res.status(500).json({
            message: "Login Error"
        });
    }
}

//Testing protected Route

const getme = (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized user" });
    res.status(200).json(req.user);
}

//forgot password

const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is Required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "No User Found " });

        //Generate a token
        const resetToken = crypto.randomBytes(32).toString("hex");

        //hash before saving
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordToken = hashedToken;
        user.resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000; //10 min

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    } catch (error) {
        console.log("Failed Changing Password");
        res.status(500).json({message : "Failed Resetting Password"});
    }
}

export { signup, login, getme };