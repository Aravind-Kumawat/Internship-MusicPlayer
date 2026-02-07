import imagekit from "../config/imagekit.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendMail from "../utilities/sendEmail.js";

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
                email: user.email,
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
            console.log(isMatch);
            return res.status(400).json({ message: "Invalid credentials!" });
        }
        const user_token = createToken(user._id);
        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            user_token,
        });
    } catch (error) {
        console.error("Login not succesfull", error);
        return res.status(500).json({
            message: "Internal server Error"
        });
    }
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
        console.log("Reset token(10 mins) : ", resetToken);

        //hash before saving
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordToken = hashedToken;
        user.resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000; //10 min

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        //send mail
        await sendMail({
            to: user.email,
            subject: "Reset your Password",
            html: ` 
            <h1>Password Reset</h1>
            <p>Click on the link below to reset your password </p>
            <a href = "${resetUrl}">${resetUrl}</a>
            <p>This link expires in 10 minutes</p>
            `
        });
        return res.status(200).json({ message: "password reset email sent" });

    } catch (error) {
        console.log("Failed Changing Password", error);
        return res.status(500).json({ message: "Internal Server Error!" });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 length" })
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordTokenExpires: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ message: "Password Token is Invalid or Expired!" });
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password Updated Successfully!" })
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({ message: "Internal Server Error!" });
    }

};

const editProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Not Authenticated" });
        const { name, email, avatar, currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);
        if (name) user.name = name;
        if (email) user.email = email;

        if (!currentPassword || !newPassword) {
            return  res.status(400).json({ message: "Both current and new password are required!" });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "current Password is incorrect" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be atleast of length 6!" });
        }

        user.password = newPassword;

        if(avatar){
            const uploadResponse = await imageKit.upload({
                file : avatar,
                fileName : `avatar_${userId}_${Date.now()}.jpg`,
                folder:"/mern-music-player",
            });
            user.avatar = uploadResponse.url;
        }

        await user.save();

        return res.status(200).json({
            user : {
                id : user._id,
                name : user.name,
                email:user.email,
                avatar : user.avatar,
            },
            message : "Profile updated succesfully"
        });

    } catch (error) {
        console.log("Error Modifiying Profile",error.message);
        res.status(500).json({message : "Error in Updating Profile!"});
    }
}

export { signup, login, forgotpassword, resetPassword, editProfile };