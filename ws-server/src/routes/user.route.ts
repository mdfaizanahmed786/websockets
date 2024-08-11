import express from "express"
import { getUser, login, signUp } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";


const router=express.Router();


router.post("/login", login)
router.post("/signup", signUp)
router.get("/me", authMiddleware, getUser)
 

export default router;