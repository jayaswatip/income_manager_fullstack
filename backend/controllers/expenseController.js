const Expense = require("../models/Expense");

/* Add Expense */
exports.addExpense = async (req, res) => {
    const { title, amount, category, date } = req.body;

    try {
        const expense = await Expense.create({
            title,
            amount,
            category,
            date,
            user: req.user.id
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/* Get All Expenses */
exports.getExpense = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/* Update Expense */
exports.updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json("Expense not found");
        }

        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json("Not authorized");
        }

        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedExpense);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/* Delete Expense */
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json("Expense not found");
        }

        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json("Not authorized");
        }

        await expense.deleteOne();
        res.json({ message: "Expense removed" });
    } catch (error) {
        res.status(500).json(error.message);
    }
};
