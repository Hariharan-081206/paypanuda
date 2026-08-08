import Settlement from "../models/settlement.js";
import Group from "../models/group.js";
//import User from "../models/user.js";
//import calculateBalances from "./balance/calculateDebts.js";
//import simplifyBalances from "./balance/simplifyBalances.js";
import ledger from "./balance/ledger.js";
import optimizeSettlements from "./balance/optimizeSettlements.js";
import {
    createNotification
} from "./notificationservice.js";

const createSettlement = async ({
    groupId,
    fromUserId,
    toUserId,
    amount,
    note = ""
}) => {

    // Same user validation
    if (
        fromUserId.toString() ===
        toUserId.toString()
    ) {
        throw new Error(
            "You cannot create a settlement with yourself."
        );
    }


    // Convert amount to number
    const settlementAmount = Number(amount);


    // Amount validation
    if (
        !Number.isFinite(settlementAmount) ||
        settlementAmount <= 0
    ) {
        throw new Error(
            "Settlement amount must be greater than zero."
        );
    }


    // Find group
    const group = await Group.findById(groupId);

    if (!group) {
        throw new Error("Group not found.");
    }


    // Check sender membership
    const isFromUserMember = group.members.some(
        member =>
            member.toString() ===
            fromUserId.toString()
    );


    // Check receiver membership
    const isToUserMember = group.members.some(
        member =>
            member.toString() ===
            toUserId.toString()
    );


    if (
        !isFromUserMember ||
        !isToUserMember
    ) {
        throw new Error(
            "Both users must be members of the group."
        );
    }


    // ==================================================
    // CHECK REMAINING DEBT
    // ==================================================

    const remainingDebt =
        await getRemainingDebt({
            groupId,
            fromUserId,
            toUserId
        });


    // No debt remaining
    if (remainingDebt <= 0) {
        throw new Error(
            "No outstanding debt exists between these users."
        );
    }


    // Prevent over-settlement
    if (settlementAmount > remainingDebt) {
        throw new Error(
            `Settlement amount exceeds remaining debt of ₹${remainingDebt}.`
        );
    }


    // ==================================================
    // CREATE SETTLEMENT
    // ==================================================

    const settlement =
        await Settlement.create({
            group: groupId,
            fromUser: fromUserId,
            toUser: toUserId,
            amount: settlementAmount,
            note,
            status: "pending"
        });
        await createNotification({

            recipient: toUserId,

            group: groupId,

            type: "settlement_created",

            title: "New Settlement",

            message:
                `A settlement of ₹${settlementAmount} was created for you.`,

            relatedSettlement:
                settlement._id

        });


    // Return populated settlement
    return Settlement.findById(
        settlement._id
    )
        .populate(
            "fromUser",
            "name email"
        )
        .populate(
            "toUser",
            "name email"
        );
};
export const completeSettlement = async ({
    settlementId,
    userId
}) => {

    // Find settlement
    const settlement = await Settlement.findById(
        settlementId
    );

    if (!settlement) {
        throw new Error("Settlement not found.");
    }

    // Only the sender can complete the settlement
    const isSender =
        settlement.fromUser.toString() === userId;

    if (!isSender) {
        throw new Error(
            "Only the sender can complete this settlement."
        );
    }

    // Prevent completing twice
    if (settlement.status === "completed") {
        throw new Error(
            "Settlement is already completed."
        );
    }

    // Mark as completed
    settlement.status = "completed";

    settlement.paidAt = new Date();

    await settlement.save();
    await createNotification({

        recipient:
            settlement.toUser,

        group:
            settlement.group,

        type:
            "settlement_completed",

        title:
            "Settlement Completed",

        message:
            `Payment of ₹${settlement.amount} has been completed.`,

        relatedSettlement:
            settlement._id

    });

    // Return updated settlement
    return Settlement.findById(settlement._id)
        .populate("fromUser", "name email")
        .populate("toUser", "name email");
};



export const getSettlementHistory = async (groupId) => {

    const settlements = await Settlement.find({
        group: groupId
    })
        .populate("fromUser", "name email")
        .populate("toUser", "name email")
        .sort({ createdAt: -1 });

    return settlements;
};


const getRemainingDebt = async ({
    groupId,
    fromUserId,
    toUserId
}) => {

    // -----------------------------------------
    // 1. Get the same optimized balances
    //    used by /api/balance/:groupId
    // -----------------------------------------

    const ledgerData =
        await ledger(groupId);

    const settlements =
        optimizeSettlements(ledgerData);


    // -----------------------------------------
    // 2. Find debt from fromUser → toUser
    // -----------------------------------------

    const debt = settlements.find(
        settlement =>
            settlement.fromUser.id.toString() ===
                fromUserId.toString() &&
            settlement.toUser.id.toString() ===
                toUserId.toString()
    );


    // No debt exists
    if (!debt) {
        return 0;
    }


    const totalDebt =
        Number(debt.amount);


    // -----------------------------------------
    // 3. Find previous settlements
    // -----------------------------------------

    const previousSettlements =
        await Settlement.find({
            group: groupId,
            fromUser: fromUserId,
            toUser: toUserId,
            status: {
                $in: ["pending", "completed"]
            }
        });


    // -----------------------------------------
    // 4. Calculate already allocated amount
    // -----------------------------------------

    const alreadySettled =
        previousSettlements.reduce(
            (total, settlement) => {

                return total +
                    Number(settlement.amount);

            },
            0
        );


    // -----------------------------------------
    // 5. Calculate remaining debt
    // -----------------------------------------

    const remainingDebt =
        totalDebt - alreadySettled;


    // -----------------------------------------
    // DEBUG
    // -----------------------------------------

    console.log(
        "========== SETTLEMENT DEBUG =========="
    );

    console.log(
        "Group:",
        groupId
    );

    console.log(
        "From:",
        fromUserId
    );

    console.log(
        "To:",
        toUserId
    );

    console.log(
        "Total debt:",
        totalDebt
    );

    console.log(
        "Already settled:",
        alreadySettled
    );

    console.log(
        "Remaining debt:",
        remainingDebt
    );

    console.log(
        "Existing settlements:",
        previousSettlements.map(
            settlement => ({
                id: settlement._id.toString(),
                amount: Number(
                    settlement.amount
                ),
                status:
                    settlement.status
            })
        )
    );

    console.log(
        "======================================="
    );


    return Math.max(
        remainingDebt,
        0
    );
};


// ======================================================
// DEFAULT EXPORT
// ======================================================

export default createSettlement;