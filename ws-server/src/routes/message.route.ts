import express from "express"
import { sendMessage } from "../controllers/message.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router=express.Router();
// @ts-ignore
router.post("/send", authMiddleware, sendMessage)

export default router