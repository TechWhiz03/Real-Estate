import { Router } from "express";
import {
    signInUser,
    signOutUser,
    signUpUser,
    googleAuth,
    updateUser,
    deleteUser,
    getUserListings,
    getUser
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router();

router.post("/signup", signUpUser);
router.post("/signin", signInUser);
router.get("/signout", signOutUser);
router.post("/google", googleAuth);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get('/:id', verifyToken, getUser)

export default router;