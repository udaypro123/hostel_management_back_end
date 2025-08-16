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
// router.use(protect);

// Admin routes
router.post('/createHostel', createHostel);
router.get('/getHostels', getHostels);
router.put('/updateHostel', updateHostel);
router.delete('/deleteHostel', deleteHostel);

// Room routes
router.post('/addRoomToHostel', addRoomToHostel);
router.get('/getAllRooms', getAllRooms);
router.put('/updateRoomInHostel', updateRoomInHostel);
router.delete('/deleteRoom', deleteRoom);

export default router;
