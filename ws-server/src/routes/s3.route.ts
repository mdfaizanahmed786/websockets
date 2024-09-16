import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware";
import { signedURL } from "../controllers/signed_url.controller";
const router=express.Router();

router.post("/", authMiddleware, signedURL)

export default router;