// routes/hostel.routes.js

import express from 'express';
import {
  createHostel,
  getHostels,
  updateHostel,
  deleteHostel,
  addRoomToHostel,
  getAllRooms,
  updateRoomInHostel,
  deleteRoom
} from '../controllers/hostel.controller.js';

import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Admin routes
router.post('/createHostel', authorize('admin'), createHostel);
router.get('/getHostels', authorize('admin', "warden", 'student'), getHostels);
router.put('/updateHostel', authorize('admin'), updateHostel);
router.delete('/deleteHostel', authorize('admin'), deleteHostel);

// Room routes
router.post('/addRoomToHostel', authorize('admin'), addRoomToHostel);
router.get('/getAllRooms', authorize('admin', "warden", 'student'), getAllRooms);
router.put('/updateRoomInHostel', authorize('admin'), updateRoomInHostel);
router.delete('/deleteRoom', authorize('admin'), deleteRoom);

export default router;
