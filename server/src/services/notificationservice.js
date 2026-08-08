import Notification from "../models/notification.js";


// ======================================================
// CREATE NOTIFICATION
// ======================================================

export const createNotification = async ({
    recipient,
    group,
    type,
    title,
    message,
    relatedExpense = null,
    relatedSettlement = null
}) => {

    console.log("========== CREATING NOTIFICATION ==========");

    console.log("Recipient:", recipient);
    console.log("Group:", group);
    console.log("Type:", type);
    console.log("Title:", title);
    console.log("Message:", message);
    console.log("Related Settlement:", relatedSettlement);

    const notification =
        await Notification.create({

            recipient,

            group,

            type,

            title,

            message,

            relatedExpense,

            relatedSettlement

        });

    console.log(
        "NOTIFICATION CREATED:",
        notification._id.toString()
    );

    console.log("===========================================");

    return notification;
};


// ======================================================
// CREATE MULTIPLE NOTIFICATIONS
// ======================================================

export const createNotifications = async (
    notifications
) => {

    if (
        !notifications ||
        notifications.length === 0
    ) {
        return [];
    }

    return Notification.insertMany(
        notifications
    );
};


// ======================================================
// GET USER NOTIFICATIONS
// ======================================================

export const getUserNotifications =
    async (userId) => {

        return Notification.find({
            recipient: userId
        })
            .populate(
                "group",
                "name"
            )
            .populate(
                "relatedExpense",
                "title amount"
            )
            .populate(
                "relatedSettlement",
                "amount status"
            )
            .sort({
                createdAt: -1
            });
    };


// ======================================================
// GET UNREAD NOTIFICATIONS
// ======================================================

export const getUnreadNotifications =
    async (userId) => {

        return Notification.find({
            recipient: userId,
            isRead: false
        })
            .populate(
                "group",
                "name"
            )
            .sort({
                createdAt: -1
            });
    };


// ======================================================
// MARK ONE AS READ
// ======================================================

export const markNotificationAsRead =
    async ({
        notificationId,
        userId
    }) => {

        const notification =
            await Notification.findOne({
                _id: notificationId,
                recipient: userId
            });

        if (!notification) {
            throw new Error(
                "Notification not found."
            );
        }

        notification.isRead = true;
        notification.readAt = new Date();

        await notification.save();

        return notification;
    };


// ======================================================
// MARK ALL AS READ
// ======================================================

export const markAllNotificationsAsRead =
    async (userId) => {

        await Notification.updateMany(
            {
                recipient: userId,
                isRead: false
            },
            {
                $set: {
                    isRead: true,
                    readAt: new Date()
                }
            }
        );

        return true;
    };


// ======================================================
// DELETE NOTIFICATION
// ======================================================

export const deleteNotification =
    async ({
        notificationId,
        userId
    }) => {

        const notification =
            await Notification.findOneAndDelete({
                _id: notificationId,
                recipient: userId
            });

        if (!notification) {
            throw new Error(
                "Notification not found."
            );
        }

        return notification;
    };