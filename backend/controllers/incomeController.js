const Income = require("../models/Income");


/* Add Income */
exports.addIncome = async (req, res) => {

    try {

        const { title, amount, category, date } = req.body;

        if (!title || !amount || !category || !date)
        {
            return res.status(400).json("All fields required");
        }

        const income = await Income.create({
            title,
            amount,
            category,
            date,
            user: req.user
        });

        res.status(201).json(income);

    }
    catch (error)
    {
        res.status(500).json(error.message);
    }
};



/* Get Income */
exports.getIncome = async (req, res) => {

    try {

        const income = await Income.find({
            user: req.user
        }).sort({ date: -1 });

        res.status(200).json(income);

    }
    catch (error)
    {
        res.status(500).json(error.message);
    }
};



/* Delete Income */
exports.deleteIncome = async (req, res) => {

    try {

        const income = await Income.findById(req.params.id);

        if (!income)
        {
            return res.status(404).json("Income not found");
        }

        if (income.user.toString() !== req.user)
        {
            return res.status(401).json("Not authorized");
        }

        await income.deleteOne();

        res.status(200).json("Income deleted successfully");

    }
    catch (error)
    {
        res.status(500).json(error.message);
    }
};


/* Update Income */
exports.updateIncome = async (req, res) => {

    try {

        const income = await Income.findById(req.params.id);

        if (!income)
        {
            return res.status(404).json("Income not found");
        }

        /* Check ownership */
        if (income.user.toString() !== req.user)
        {
            return res.status(401).json("Not authorized");
        }

        const { title, amount, category, date } = req.body;

        income.title = title || income.title;
        income.amount = amount || income.amount;
        income.category = category || income.category;
        income.date = date || income.date;

        const updatedIncome = await income.save();

        res.status(200).json(updatedIncome);

    }
    catch (error)
    {
        res.status(500).json(error.message);
    }
};