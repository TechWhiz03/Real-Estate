import { Router } from "express";
import { signInUser, signUpUser, googleAuth, updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router();

router.post("/signup", signUpUser);
router.post("/signin", signInUser);
router.post("/google", googleAuth);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);

export default router;