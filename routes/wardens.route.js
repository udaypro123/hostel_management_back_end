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
router.post('/warden', authorize('admin',), createWarden);
router.get('/warden', authorize('admin','warden','student'), getWarden);
router.get('/getWardenById', authorize('admin','warden','student'), getWardenById);
router.put('/updateWarden', authorize('admin',), updateWarden);
router.delete('/deleteWarden', authorize('admin',), deleteWarden);

export default router;
