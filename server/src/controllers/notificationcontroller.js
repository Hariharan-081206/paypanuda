import {
    getUserNotifications,
    getUnreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from "../services/notificationservice.js";


// ======================================================
// GET ALL NOTIFICATIONS
// ======================================================

export const getNotificationsController =
    async (req, res) => {

        try {

            const notifications =
                await getUserNotifications(
                    req.user._id
                );

            res.status(200).json({

                success: true,

                count: notifications.length,

                notifications

            });

        } catch (error) {

            res.status(500).json({

                success: false,

                message: error.message

            });
        }
    };


// ======================================================
// GET UNREAD NOTIFICATIONS
// ======================================================

export const getUnreadNotificationsController =
    async (req, res) => {

        try {

            const notifications =
                await getUnreadNotifications(
                    req.user._id
                );

            res.status(200).json({

                success: true,

                count: notifications.length,

                notifications

            });

        } catch (error) {

            res.status(500).json({

                success: false,

                message: error.message

            });
        }
    };


// ======================================================
// MARK ONE AS READ
// ======================================================

export const markNotificationAsReadController =
    async (req, res) => {

        try {

            const notification =
                await markNotificationAsRead({

                    notificationId:
                        req.params.notificationId,

                    userId:
                        req.user._id

                });

            res.status(200).json({

                success: true,

                message:
                    "Notification marked as read.",

                notification

            });

        } catch (error) {

            res.status(400).json({

                success: false,

                message: error.message

            });
        }
    };


// ======================================================
// MARK ALL AS READ
// ======================================================

export const markAllNotificationsAsReadController =
    async (req, res) => {

        try {

            await markAllNotificationsAsRead(
                req.user._id
            );

            res.status(200).json({

                success: true,

                message:
                    "All notifications marked as read."

            });

        } catch (error) {

            res.status(400).json({

                success: false,

                message: error.message

            });
        }
    };


// ======================================================
// DELETE NOTIFICATION
// ======================================================

export const deleteNotificationController =
    async (req, res) => {

        try {

            await deleteNotification({

                notificationId:
                    req.params.notificationId,

                userId:
                    req.user._id

            });

            res.status(200).json({

                success: true,

                message:
                    "Notification deleted."

            });

        } catch (error) {

            res.status(400).json({

                success: false,

                message: error.message

            });
        }
    };