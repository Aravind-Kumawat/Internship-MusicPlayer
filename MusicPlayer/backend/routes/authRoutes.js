import express from "express";
import { login, signup, forgotpassword, resetPassword } from "../controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/forgot-password',protect,forgotpassword);
router.post('/reset-password/:token',resetPassword);

export default router;