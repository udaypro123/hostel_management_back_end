import express from "express";

import {
    addGree,
    getAllDegree,
    updateDegree,
    deleteDegree,
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    getStudentById
} from '../controllers/student.controller.js'

import { authorize, protect } from "../middleware/auth.js";
const router = express.Router();
// Protected routes
router.use(protect);


router.post("/createStudent", authorize('admin', "warden"), createStudent)
router.get("/getStudents", authorize('admin', "warden", 'student'), getStudents)
router.put("/updateStudent", authorize('admin', "warden"), updateStudent)
router.delete("/deleteStudent", authorize('admin', "warden"), deleteStudent)
router.get("/getStudentById",authorize('admin', "warden", 'student'), getStudentById)

router.post("/addDegree",authorize('admin', "warden"), addGree)
router.get("/getDegree",authorize('admin', "warden", 'student'), getAllDegree)
router.put("/updateDegree",authorize('admin', "warden"), updateDegree)
router.delete("/deleteDegree",authorize('admin', "warden"), deleteDegree)

export default router;
