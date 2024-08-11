import express from "express"
import { createChat, getAllChats, getChatById } from "../controllers/chat.controller"
import { authMiddleware } from "../middlewares/auth.middleware"

const router = express.Router()

router.post("/create", authMiddleware, createChat)
router.get("/", authMiddleware, getAllChats)
router.get("/:id",authMiddleware,  getChatById)



export default router