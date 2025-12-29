import express from "express";
import { test, test2 } from "../controllers/test.controller.js";

const router=express.Router();

router.route('/').get(test)
router.route('/add').get(test2)
export default router;