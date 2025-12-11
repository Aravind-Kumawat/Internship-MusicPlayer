import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const employeeAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token is required!" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.employee = decoded;
    next();
  } catch (error) {
    console.log("Auth error:", error);
    return res.status(401).json({ message: "Invalid token!" });
  }
};
