import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const protect = async (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json( {message : "Not Authorized, missing Token"})
    }

    const user_token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(user_token, process.env.JWT_SECRET);
        console.log(decoded);

        //look for auth user and exclude password for security purpose
        const user = await User.findById(decoded.id).select("-password");

        if(!user)   return res.status(401).json({message : "Not Authorized!"});

        req.user = user;
        //pass on next middleware/route handler
        next();

    } catch (error) {
        console.error("Token verfication Failed",error.message);
        return res.status(401).json({ message : "Invalid or expired token"});
    }

}