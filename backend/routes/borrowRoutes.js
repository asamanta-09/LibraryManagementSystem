import express from 'express';
import {
  borrowBook,
  returnBook,
  getUserBorrows,
  getAllBorrows,
  getDashboardStats
} from '../controllers/borrowController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, borrowBook);
router.put('/:id/return', protect, returnBook);
router.get('/my-borrows', protect, getUserBorrows);
router.get('/all', protect, admin, getAllBorrows);
router.get('/stats', protect, getDashboardStats);

export default router;
