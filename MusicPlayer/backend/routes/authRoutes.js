import express from "express";
import { login, signup, forgotpassword, resetPassword, editProfile,getMe } from "../controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/get-me',protect,getMe);
router.post('/forgot-password',forgotpassword);
router.post('/reset-password/:token',resetPassword);
router.patch('/profile',protect,editProfile);
export default router;