import express from "express";
import { employeeLogin, employeeSignup } from "../controllers/employeeAuthController.js";
import { employeeLoginValidation, employeeSignupValidation } from "../middlewares/employeeAuthValidation.js";

const router = express.Router();

router.post("/login",employeeLoginValidation,employeeLogin);
router.post("/signup",employeeSignupValidation,employeeSignup);

export default router;