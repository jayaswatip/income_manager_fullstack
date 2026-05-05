const SavingsGoal = require("../models/SavingsGoal");

/* Create Savings Goal */
exports.createGoal = async (req, res) => {
    const { title, targetAmount, currentAmount, deadline, category, description } = req.body;

    try {
        const goal = await SavingsGoal.create({
            title,
            targetAmount,
            currentAmount: currentAmount || 0,
            deadline,
            category,
            description,
            user: req.user.id
        });

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/* Get All Savings Goals */
exports.getGoals = async (req, res) => {
    try {
        const goals = await SavingsGoal.find({ user: req.user.id }).sort({ deadline: 1 });
        res.json(goals);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/* Update Savings Goal */
exports.updateGoal = async (req, res) => {
    try {
        const goal = await SavingsGoal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json("Goal not found");
        }

        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json("Not authorized");
        }

        const updatedGoal = await SavingsGoal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedGoal);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/* Update Current Amount (Add Savings) */
exports.addSavings = async (req, res) => {
    const { amount } = req.body;

    try {
        const goal = await SavingsGoal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json("Goal not found");
        }

        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json("Not authorized");
        }

        goal.currentAmount = Math.min(goal.currentAmount + Number(amount), goal.targetAmount);
        await goal.save();

        res.json(goal);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/* Delete Savings Goal */
exports.deleteGoal = async (req, res) => {
    try {
        const goal = await SavingsGoal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json("Goal not found");
        }

        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json("Not authorized");
        }

        await goal.deleteOne();
        res.json({ message: "Goal removed" });
    } catch (error) {
        res.status(500).json(error.message);
    }
};
