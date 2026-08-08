import Expense from "../models/expense.js";
import Group from "../models/group.js";

/*
====================================
Create Expense
====================================
*/

export const createExpense = async (expenseData, currentUserId) => {

    const {
        group,
        title,
        description,
        amount,
        paidBy,
        participants,
        splitType
    } = expenseData;

    if (amount <= 0) {
        throw new Error("Amount must be greater than zero");
    }

    const groupData = await Group.findById(group);

    if (!groupData) {
        throw new Error("Group not found");
    }

    const isMember = groupData.members.some(
        member => member.toString() === currentUserId.toString()
    );

    if (!isMember) {
        throw new Error("You are not a member of this group");
    }

    const payerExists = groupData.members.some(
        member => member.toString() === paidBy
    );

    if (!payerExists) {
        throw new Error("Payer must be a group member");
    }

    for (const participant of participants) {

        const exists = groupData.members.some(
            member => member.toString() === participant
        );

        if (!exists) {
            throw new Error("Invalid participant");
        }

    }

    const share = Number((amount / participants.length).toFixed(2));

    const participantData = participants.map(userId => ({
        user: userId,
        share,
        isPayer: userId === paidBy
    }));

    const expense = await Expense.create({

        group,
        title,
        description,
        amount,
        paidBy,
        splitType,
        participants: participantData

    });

    return await Expense.findById(expense._id)
        .populate("group", "name")
        .populate("paidBy", "name email")
        .populate("participants.user", "name email");
};

/*
====================================
Get All Expenses
====================================
*/

export const getExpenses = async () => {

    return await Expense.find()
        .populate("group", "name")
        .populate("paidBy", "name email")
        .populate("participants.user", "name email")
        .sort({ createdAt: -1 });

};

/*
====================================
Get Expense By Id
====================================
*/

export const getExpenseById = async (expenseId) => {

    const expense = await Expense.findById(expenseId)
        .populate("group", "name")
        .populate("paidBy", "name email")
        .populate("participants.user", "name email");

    if (!expense) {
        throw new Error("Expense not found");
    }

    return expense;

};

/*
====================================
Update Expense
====================================
*/

export const updateExpense = async (expenseId, body) => {

    const expense = await Expense.findById(expenseId);

    if (!expense) {
        throw new Error("Expense not found");
    }

    expense.title = body.title ?? expense.title;
    expense.description = body.description ?? expense.description;

    const amount = body.amount ?? expense.amount;

    const paidBy = body.paidBy ?? expense.paidBy.toString();

    const participants = body.participants ??
        expense.participants.map(p => p.user.toString());

    const share = Number((amount / participants.length).toFixed(2));

    expense.amount = amount;
    expense.paidBy = paidBy;

    expense.participants = participants.map(userId => ({
        user: userId,
        share,
        isPayer: userId === paidBy
    }));

    await expense.save();

    return await Expense.findById(expenseId)
        .populate("paidBy", "name email")
        .populate("participants.user", "name email");
};

/*
====================================
Delete Expense
====================================
*/

export const deleteExpense = async (expenseId) => {

    const expense = await Expense.findById(expenseId);

    if (!expense) {
        throw new Error("Expense not found");
    }

    await Expense.findByIdAndDelete(expenseId);

    return;

};