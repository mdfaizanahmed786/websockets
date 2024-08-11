import express from "express"
import { sendMessage } from "../controllers/message.controller";
const router=express.Router();
// @ts-ignore
router.post("/send", sendMessage)