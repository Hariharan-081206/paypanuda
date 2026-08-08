import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true
        },

        type: {
            type: String,
            enum: [
                "expense_created",
                "settlement_created",
                "settlement_completed",
                "group_added"
            ],
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        relatedExpense: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expense",
            default: null
        },

        relatedSettlement: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Settlement",
            default: null
        },

        isRead: {
            type: Boolean,
            default: false
        },

        readAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

notificationSchema.index({
    recipient: 1,
    isRead: 1,
    createdAt: -1
});

notificationSchema.index({
    group: 1,
    createdAt: -1
});

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

export default Notification;