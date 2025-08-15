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


router.post("/createStudent",  createStudent)
router.get("/getStudents",getStudents)
router.put("/updateStudent",  updateStudent)
router.delete("/deleteStudent",  deleteStudent)
router.get("/getStudentById",getStudentById)

router.post("/addDegree", addGree)
router.get("/getDegree",getAllDegree)
router.put("/updateDegree", updateDegree)
router.delete("/deleteDegree", deleteDegree)

export default router;
