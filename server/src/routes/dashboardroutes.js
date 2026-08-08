import express from "express";

import protect
    from "../middleware/authmiddleware.js";

import {
    getDashboardController
} from "../controllers/dashboardcontroller.js";


const router = express.Router();


router.get(
    "/:groupId",
    protect,
    getDashboardController
);


export default router;