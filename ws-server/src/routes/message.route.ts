import express from "express"
import { getChatMessages, sendMessage } from "../controllers/message.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router=express.Router();
// @ts-ignore
router.post("/send", authMiddleware, sendMessage)
router.get("/:chatId", authMiddleware, getChatMessages)

export default router