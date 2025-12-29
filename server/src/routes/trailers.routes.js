import { Router } from "express";
import { addTrailer, allTrailers } from "../controllers/trailers.controller.js";

const router =Router();

router.route("/add").post(addTrailer);
router.route("/allTrailers").get(allTrailers);

export default router;