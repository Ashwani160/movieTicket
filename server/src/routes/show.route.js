import express from "express";
import { addMovieWithShow, getNowPlayingMovies, getShow, getShows } from "../controllers/show.controller.js";
import { protectAdmin } from "../middlewares/auth.js";

const router =express.Router();

router.route('/now-playing').get( getNowPlayingMovies);
router.route('/add-show').post( addMovieWithShow);
router.route('/all').get(getShows);
router.route('/get-show/:movieId').get(getShow);
export default router;