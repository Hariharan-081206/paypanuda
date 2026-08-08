import Expense from "../../models/expense.js";
import Group from "../../models/group.js";

const ledger = async (groupId) => {

    // Verify group exists
    const group = await Group.findById(groupId)
        .populate("members", "name email");

    if (!group) {
        throw new Error("Group not found");
    }

    // Initialize ledger
    const ledger = {};

    group.members.forEach(member => {

        ledger[member._id] = {

            userId: member._id,

            name: member.name,

            email: member.email,

            paid: 0,

            share: 0,

            balance: 0

        };

    });

    // Read all expenses
    const expenses = await Expense.find({
        group: groupId
    });

    // Process expenses
    expenses.forEach(expense => {

        // Amount paid
        ledger[expense.paidBy].paid += expense.amount;

        // Individual shares
        expense.participants.forEach(participant => {

            ledger[participant.user].share += participant.share;

        });

    });

    // Calculate final balance
    Object.values(ledger).forEach(member => {

        member.balance = Number(
            (member.paid - member.share).toFixed(2)
        );

    });

    return Object.values(ledger);

};

export default ledger;