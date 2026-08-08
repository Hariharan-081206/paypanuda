import Expense from "../../models/expense.js";

/**
 * Calculate raw balances for a group
 * Returns:
 * [
 *   {
 *      fromUser,
 *      toUser,
 *      amount
 *   }
 * ]
 */

const calculateBalances = async (groupId) => {

    // Get all expenses of the group
    const expenses = await Expense.find({ group: groupId })
        .populate("paidBy", "name email")
        .populate("participants.user", "name email");

    const balances = [];

    for (const expense of expenses) {

        const payer = expense.paidBy;

        for (const participant of expense.participants) {

            // Skip payer's own share
            if (participant.user._id.toString() === payer._id.toString()) {
                continue;
            }

            balances.push({
                fromUser: {
                    id: participant.user._id,
                    name: participant.user.name,
                    email: participant.user.email
                },

                toUser: {
                    id: payer._id,
                    name: payer.name,
                    email: payer.email
                },

                amount: participant.share,

                expenseId: expense._id,

                expenseTitle: expense.title
            });

        }

    }

    return balances;

};

export default calculateBalances;