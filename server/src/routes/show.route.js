import express from "express";
import { addMovieWithShow, getNowPlayingMovies, getShow, getShows, getUpcomingShows } from "../controllers/show.controller.js";
import { protectAdmin } from "../middlewares/auth.js";

const router =express.Router();

router.route('/now-playing').get(protectAdmin, getNowPlayingMovies);
router.route('/add-show').post(protectAdmin, addMovieWithShow);
router.route('/all').get(getShows);
router.route('/get-show/:movieId').get(getShow);
router.route('/upcoming').get(getUpcomingShows);

export default router;