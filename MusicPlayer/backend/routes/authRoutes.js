import express from "express";
import { login, signup, getme } from "../controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/getme',protect, getme);

export default router;