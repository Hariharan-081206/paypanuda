import {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
} from "../services/expenseservice.js";

/*
==================================
Create Expense
==================================
*/

export const create = async (req, res) => {
    try {

        const expense = await createExpense(
            req.body,
            req.user._id
        );

        res.status(201).json({
            success: true,
            message: "Expense created successfully",
            expense
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

/*
==================================
Get All Expenses
==================================
*/

export const getAll = async (req, res) => {

    try {

        const expenses = await getExpenses();

        res.status(200).json({
            success: true,
            count: expenses.length,
            expenses
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

/*
==================================
Get Single Expense
==================================
*/

export const getOne = async (req, res) => {

    try {

        const expense = await getExpenseById(req.params.id);

        res.status(200).json({
            success: true,
            expense
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }

};

/*
==================================
Update Expense
==================================
*/

export const update = async (req, res) => {

    try {

        const expense = await updateExpense(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            expense
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

/*
==================================
Delete Expense
==================================
*/

export const remove = async (req, res) => {

    try {

        await deleteExpense(req.params.id);

        res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};