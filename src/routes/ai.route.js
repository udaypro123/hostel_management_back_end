import express from "express";
import {
   askFromAi,
   getAIChatbyUserId,
} from '../controllers/ai.controller.js'
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();
// Protected routes
router.use(protect);


router.post("/ask", authorize("admin","warden","student") , askFromAi)
router.get("/getAIchat", authorize("admin","warden","student") , getAIChatbyUserId)

export default router;


