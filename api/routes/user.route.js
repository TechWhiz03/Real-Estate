import { Router } from "express";
import { signInUser, signUpUser, googleAuth, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router();

router.post("/signup", signUpUser);
router.post("/signin", signInUser);
router.post("/google", googleAuth);
router.post("/update/:id", verifyToken, updateUser);

export default router;