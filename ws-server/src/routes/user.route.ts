import express from "express"
import { getAllUsers, getUser, login, logout, signUp } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";


const router=express.Router();

router.post("/login", login)
router.post("/signup", signUp)
router.get("/me", authMiddleware, getUser)
router.get("/all", authMiddleware, getAllUsers)
router.get("/logout", authMiddleware, logout)
 

export default router;