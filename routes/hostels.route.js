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
router.post('/createHostel', authorize('admin','warden','student'), createHostel);
router.get('/getHostels', authorize('admin','warden','student'), getHostels);
router.put('/updateHostel', authorize('admin','warden','student'), updateHostel);
router.delete('/deleteHostel', authorize('admin','warden','student'), deleteHostel);

// Room routes
router.post('/addRoomToHostel', authorize('admin','warden','student'), addRoomToHostel);
router.get('/getAllRooms', authorize('admin','warden','student'), getAllRooms);
router.put('/updateRoomInHostel', authorize('admin','warden','student'), updateRoomInHostel);
router.delete('/deleteRoom', authorize('admin','warden','student'), deleteRoom);

export default router;
