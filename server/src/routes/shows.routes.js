import { Router } from "express";
import { addShows, allShows, getShow } from "../controllers/shows.controller.js"; // Corrected import file name

const router = Router();

// CRITICAL FIX: Changed .get to .post for data submission
router.route('/add').post(addShows);
router.route('/allShows').get(allShows)
router.route('/getShow/:id').get(getShow);
export default router;
