// routes/warden.routes.js

import express from 'express';
import {
  // getWardens,
  getWarden,
  createWarden,
  updateWarden,
  deleteWarden,
  getWardenById,
} from '../controllers/warden.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Routes
router.post('/warden',  createWarden);
router.get('/warden', getWarden);
router.get('/getWardenById', getWardenById);
router.put('/updateWarden',  updateWarden);
router.delete('/deleteWarden',  deleteWarden);

export default router;
