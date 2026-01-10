import express from 'express';
import { protectAdmin } from '../middlewares/auth.js';
import { getAllBookings, getAllShows, getDashboardData, isAdmin } from '../controllers/admin.controller.js';

const router= express.Router();

router.route('/is-admin').get(protectAdmin, isAdmin);
router.route('/dashboard').get(protectAdmin, getDashboardData);
router.route('/all-shows').get(protectAdmin, getAllShows);
router.route('/all-bookings').get(protectAdmin, getAllBookings);

export default router;