import express from 'express';
import { getFavorites, getUserBookings, updateFavorite } from '../controllers/user.controller.js';

const router= express.Router();

router.route('/bookings').get(getUserBookings);
router.route('/update-favorite').post(updateFavorite);
router.route('/favorites').get(getFavorites);

export default router;