import express from 'express';
import { protectAdmin } from '../middlewares/auth.js';
import { getAllBookings, getAllShows, getDashboardData, isAdmin } from '../controllers/admin.controller.js';

const router= express.Router();

router.route('/is-admin').get( isAdmin);
router.route('/dashboard').get( getDashboardData);
router.route('/all-shows').get( getAllShows);
router.route('/all-bookings').get( getAllBookings);

export default router;