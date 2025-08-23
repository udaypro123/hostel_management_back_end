import express from "express";

import {
    createRequests,
    getAllRequests,
    updateRequests,
    deleteRequest,
} from '../controllers/requests.controller.js'

import { authorize, protect } from "../middleware/auth.js";
const router = express.Router();
// Protected routes
router.use(protect);


router.post("/createRequest",authorize('admin', "warden", 'student'), createRequests)
router.get("/getAllRequests",authorize('admin', "warden", 'student'), getAllRequests)
router.put("/updateRequest",authorize('admin', "warden", 'student'), updateRequests)
router.delete("/deleteRequest",authorize('admin', "warden", 'student'), deleteRequest)

export default router;
