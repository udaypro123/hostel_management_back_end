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


router.post("/createAnnoucement",  createAnnoucement)
router.get("/getAllAnouncement", getAllAnouncement)
router.put("/updateAnouncement",  updateAnouncement)
router.delete("/deleteAnouncement",  deleteAnouncement)

export default router;
