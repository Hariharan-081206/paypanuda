import Settlement from "../models/settlement.js";
import Group from "../models/group.js";

import ledger from "./balance/ledger.js";
import optimizeSettlements from "./balance/optimizeSettlements.js";


const getDashboard = async ({
    groupId,
    userId
}) => {

    // ==================================================
    // 1. CHECK GROUP
    // ==================================================

    const group = await Group.findById(groupId)
        .populate("members", "name email");

    if (!group) {
        throw new Error("Group not found.");
    }


    // ==================================================
    // 2. CHECK USER IS GROUP MEMBER
    // ==================================================

    const isMember = group.members.some(
        member =>
            member._id.toString() ===
            userId.toString()
    );

    if (!isMember) {
        throw new Error(
            "You are not a member of this group."
        );
    }


    // ==================================================
    // 3. GET LEDGER
    // ==================================================

    const ledgerData =
        await ledger(groupId);


    // ==================================================
    // 4. FIND CURRENT USER
    // ==================================================

    const currentUser =
        ledgerData.find(
            member =>
                member.userId.toString() ===
                userId.toString()
        );


    if (!currentUser) {
        throw new Error(
            "User not found in group ledger."
        );
    }


    // ==================================================
    // 5. TOTAL GROUP SPENDING
    // ==================================================

    const totalSpent =
        ledgerData.reduce(
            (total, member) =>
                total + Number(member.paid),
            0
        );


    // ==================================================
    // 6. GET OPTIMIZED BALANCES
    // ==================================================

    const optimizedBalances =
        optimizeSettlements(ledgerData);


    // ==================================================
    // 7. GET EXISTING SETTLEMENTS
    // ==================================================

    const settlements =
        await Settlement.find({
            group: groupId
        })
            .populate(
                "fromUser",
                "name email"
            )
            .populate(
                "toUser",
                "name email"
            )
            .sort({
                createdAt: -1
            });


    // ==================================================
    // 8. CALCULATE REMAINING DEBTS
    // ==================================================

    const remainingDebts =
        optimizedBalances.map(
            debt => {

                const totalDebt =
                    Number(debt.amount);


                // Find settlements for
                // this exact direction

                const relatedSettlements =
                    settlements.filter(
                        settlement =>
                            settlement.fromUser._id
                                .toString() ===
                                debt.fromUser.id
                                    .toString()
                            &&
                            settlement.toUser._id
                                .toString() ===
                                debt.toUser.id
                                    .toString()
                    );


                const alreadyAllocated =
                    relatedSettlements.reduce(
                        (total, settlement) =>
                            total +
                            Number(
                                settlement.amount
                            ),
                        0
                    );


                const remaining =
                    Math.max(
                        totalDebt -
                        alreadyAllocated,
                        0
                    );


                return {

                    fromUser:
                        debt.fromUser,

                    toUser:
                        debt.toUser,

                    originalAmount:
                        totalDebt,

                    settledAmount:
                        alreadyAllocated,

                    remainingAmount:
                        remaining

                };

            }
        )
        .filter(
            debt =>
                debt.remainingAmount > 0
        );


    // ==================================================
    // 9. WHAT CURRENT USER OWES
    // ==================================================

    const youOwe =
        remainingDebts
            .filter(
                debt =>
                    debt.fromUser.id.toString() ===
                    userId.toString()
            )
            .map(
                debt => ({

                    user:
                        debt.toUser,

                    amount:
                        debt.remainingAmount

                })
            );


    // ==================================================
    // 10. WHAT OTHERS OWE CURRENT USER
    // ==================================================

    const youReceive =
        remainingDebts
            .filter(
                debt =>
                    debt.toUser.id.toString() ===
                    userId.toString()
            )
            .map(
                debt => ({

                    user:
                        debt.fromUser,

                    amount:
                        debt.remainingAmount

                })
            );


    // ==================================================
    // 11. TOTAL YOU OWE
    // ==================================================

    const totalOwed =
        youOwe.reduce(
            (total, debt) =>
                total + Number(debt.amount),
            0
        );


    // ==================================================
    // 12. TOTAL YOU RECEIVE
    // ==================================================

    const totalToReceive =
        youReceive.reduce(
            (total, debt) =>
                total + Number(debt.amount),
            0
        );


    // ==================================================
    // 13. PENDING SETTLEMENTS
    // ==================================================

    const pendingSettlements =
        settlements.filter(
            settlement =>
                settlement.status === "pending"
        );


    // ==================================================
    // 14. COMPLETED SETTLEMENTS
    // ==================================================

    const completedSettlements =
        settlements.filter(
            settlement =>
                settlement.status === "completed"
        );


    // ==================================================
    // 15. RETURN DASHBOARD
    // ==================================================

    return {

        summary: {

            totalSpent:
                Number(
                    totalSpent.toFixed(2)
                ),

            yourPaid:
                Number(
                    Number(
                        currentUser.paid
                    ).toFixed(2)
                ),

            yourShare:
                Number(
                    Number(
                        currentUser.share
                    ).toFixed(2)
                ),

            yourBalance:
                Number(
                    Number(
                        currentUser.balance
                    ).toFixed(2)
                ),

            totalOwed:
                Number(
                    totalOwed.toFixed(2)
                ),

            totalToReceive:
                Number(
                    totalToReceive.toFixed(2)
                )

        },


        you: {

            userId:
                currentUser.userId,

            name:
                currentUser.name,

            email:
                currentUser.email,

            paid:
                currentUser.paid,

            share:
                currentUser.share,

            balance:
                currentUser.balance

        },


        youOwe,

        youReceive,


        remainingDebts,


        pendingSettlements,

        completedSettlements

    };
};


export default getDashboard;