import express from "express";
import {
    getAllAnouncement,
    createAnnoucement,
    updateAnouncement,
    deleteAnouncement,
} from '../controllers/announcement.controllers.js'

import { authorize, protect } from "../middleware/auth.js";
const router = express.Router();
// Protected routes
router.use(protect);


router.post("/createAnnoucement", authorize('admin'), createAnnoucement)
router.get("/getAllAnouncement", authorize('admin', 'warden', 'student'), getAllAnouncement)
router.put("/updateAnouncement", authorize('admin'), updateAnouncement)
router.delete("/deleteAnouncement", authorize('admin'), deleteAnouncement)

export default router;
