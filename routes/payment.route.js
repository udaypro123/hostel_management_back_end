import express from "express";

import {
    paymentTransaction,
    createOrder,
    verifyOrder,
    getStdudentPaymenetById
} from '../controllers/payment.controller.js'

import { authorize, protect } from "../middleware/auth.js";
const router = express.Router();
// Protected routes
router.use(protect);


router.post("/paymentTransaction", authorize('student'), paymentTransaction)
router.post("/createOrder", authorize('student'), createOrder)
router.post("/verifyOrder", authorize('student'), verifyOrder)
router.get("/getStudentpaymentByID", authorize('admin','student','warden'), getStdudentPaymenetById)
// router.get("/getStudents", authorize('admin','warden','student'), getStudents)
// router.put("/updateStudent", authorize('admin'), updateStudent)
// router.delete("/deleteStudent", authorize('admin'), deleteStudent)
// router.get("/getStudentById", authorize('admin','warden','student'), getStudentById)


export default router;
