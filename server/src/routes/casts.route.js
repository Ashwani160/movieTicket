import { addCasts } from "../controllers/casts.controller.js";
import express from "express";

const router =express.Router();

router.route('/add').post(addCasts)

export default router;