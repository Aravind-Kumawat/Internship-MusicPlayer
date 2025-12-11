import express from "express";
import { hrLogin, hrSignup } from "../controllers/hrAuthController.js";
import { hrLoginValidation, hrSignupValidation } from "../middlewares/hrAuthValidation.js";

const router = express.Router();

router.post("/login",hrLoginValidation,hrLogin);
router.post("/signup",hrSignupValidation,hrSignup);

export default router;