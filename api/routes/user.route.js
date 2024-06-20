import { Router } from "express";
import { signInUser, signUpUser, googleAuth } from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", signUpUser);
router.post("/signin", signInUser);
router.post("/google", googleAuth);

export default router;