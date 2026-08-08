import express from "express";

import protect
    from "../middleware/authmiddleware.js";

import {
    getNotificationsController,
    getUnreadNotificationsController,
    markNotificationAsReadController,
    markAllNotificationsAsReadController,
    deleteNotificationController
} from "../controllers/notificationcontroller.js";


const router = express.Router();


// All notifications

router.get(
    "/",
    protect,
    getNotificationsController
);


// Unread notifications

router.get(
    "/unread",
    protect,
    getUnreadNotificationsController
);


// Mark all as read

router.patch(
    "/read-all",
    protect,
    markAllNotificationsAsReadController
);


// Mark one as read

router.patch(
    "/:notificationId/read",
    protect,
    markNotificationAsReadController
);


// Delete notification

router.delete(
    "/:notificationId",
    protect,
    deleteNotificationController
);


export default router;