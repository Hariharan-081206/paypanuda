import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        share: {
            type: Number,
            required: true
        },

        isPayer: {
            type: Boolean,
            default: false
        }
    },
    {
        _id: false
    }
);

const expenseSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        amount: {
            type: Number,
            required: true
        },

        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        splitType: {
            type: String,
            enum: ["equal", "custom", "percentage"],
            default: "equal"
        },

        participants: [participantSchema]

    },
    {
        timestamps: true
    }
);

export default mongoose.model("Expense", expenseSchema);