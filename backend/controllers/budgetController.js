const Budget = require("../models/Budget");

/* Get Budget */
exports.getBudget = async (req, res) => {
    try {
        let budget = await Budget.findOne({ user: req.user.id });
        
        if (!budget) {
            budget = await Budget.create({
                monthlyBudget: 0,
                user: req.user.id
            });
        }
        
        res.json(budget);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/* Update Budget */
exports.updateBudget = async (req, res) => {
    const { monthlyBudget } = req.body;

    try {
        let budget = await Budget.findOne({ user: req.user.id });

        if (!budget) {
            budget = await Budget.create({
                monthlyBudget,
                user: req.user.id
            });
        } else {
            budget.monthlyBudget = monthlyBudget;
            await budget.save();
        }

        res.json(budget);
    } catch (error) {
        res.status(500).json(error.message);
    }
};
