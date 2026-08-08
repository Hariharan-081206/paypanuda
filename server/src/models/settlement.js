import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true
        },

        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        toUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0.01
        },

        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending"
        },

        paidAt: {
            type: Date,
            default: null
        },

        note: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Settlement = mongoose.model(
    "Settlement",
    settlementSchema
);

export default Settlement;