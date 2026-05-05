const RecurringTransaction = require("../models/RecurringTransaction");
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const cron = require("node-cron");

/* Create Recurring Transaction */
exports.createRecurring = async (req, res) => {
    const { title, amount, type, category, frequency, startDate, endDate, description } = req.body;

    try {
        const recurring = await RecurringTransaction.create({
            title,
            amount,
            type,
            category,
            frequency,
            startDate,
            endDate,
            description,
            user: req.user.id,
            isActive: true,
            lastProcessed: null
        });

        res.status(201).json(recurring);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/* Get All Recurring Transactions */
exports.getRecurring = async (req, res) => {
    try {
        const recurring = await RecurringTransaction.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(recurring);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/* Update Recurring Transaction */
exports.updateRecurring = async (req, res) => {
    try {
        const recurring = await RecurringTransaction.findById(req.params.id);

        if (!recurring) {
            return res.status(404).json("Recurring transaction not found");
        }

        if (recurring.user.toString() !== req.user.id) {
            return res.status(401).json("Not authorized");
        }

        const updatedRecurring = await RecurringTransaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedRecurring);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/* Toggle Active Status */
exports.toggleActive = async (req, res) => {
    try {
        const recurring = await RecurringTransaction.findById(req.params.id);

        if (!recurring) {
            return res.status(404).json("Recurring transaction not found");
        }

        if (recurring.user.toString() !== req.user.id) {
            return res.status(401).json("Not authorized");
        }

        recurring.isActive = !recurring.isActive;
        await recurring.save();

        res.json(recurring);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/* Delete Recurring Transaction */
exports.deleteRecurring = async (req, res) => {
    try {
        const recurring = await RecurringTransaction.findById(req.params.id);

        if (!recurring) {
            return res.status(404).json("Recurring transaction not found");
        }

        if (recurring.user.toString() !== req.user.id) {
            return res.status(401).json("Not authorized");
        }

        await recurring.deleteOne();
        res.json({ message: "Recurring transaction removed" });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/* Process Recurring Transactions (Cron Job Logic) */
exports.processRecurringTransactions = async () => {
    try {
        const now = new Date();
        const recurringTransactions = await RecurringTransaction.find({ isActive: true });

        for (const transaction of recurringTransactions) {
            let shouldProcess = false;
            const lastProcessed = transaction.lastProcessed || new Date(transaction.startDate);

            // Check if end date reached
            if (transaction.endDate && now > new Date(transaction.endDate)) {
                transaction.isActive = false;
                await transaction.save();
                continue;
            }

            // Check if it's time to process based on frequency
            switch (transaction.frequency) {
                case "daily":
                    shouldProcess = (now - lastProcessed) >= 24 * 60 * 60 * 1000;
                    break;
                case "weekly":
                    shouldProcess = (now - lastProcessed) >= 7 * 24 * 60 * 60 * 1000;
                    break;
                case "monthly":
                    shouldProcess = now.getMonth() !== lastProcessed.getMonth() || 
                                   now.getFullYear() !== lastProcessed.getFullYear();
                    break;
                case "yearly":
                    shouldProcess = now.getFullYear() !== lastProcessed.getFullYear();
                    break;
            }

            if (shouldProcess) {
                // Create the actual transaction
                if (transaction.type === "income") {
                    await Income.create({
                        title: transaction.title,
                        amount: transaction.amount,
                        category: transaction.category,
                        date: now,
                        user: transaction.user
                    });
                } else {
                    await Expense.create({
                        title: transaction.title,
                        amount: transaction.amount,
                        category: transaction.category,
                        date: now,
                        user: transaction.user
                    });
                }

                // Update last processed date
                transaction.lastProcessed = now;
                await transaction.save();

                console.log(`Processed recurring ${transaction.type}: ${transaction.title} for user ${transaction.user}`);
            }
        }
    } catch (error) {
        console.error("Error processing recurring transactions:", error);
    }
};

/* Manual Process Single Transaction */
exports.processSingle = async (req, res) => {
    try {
        const recurring = await RecurringTransaction.findById(req.params.id);

        if (!recurring) {
            return res.status(404).json("Recurring transaction not found");
        }

        if (recurring.user.toString() !== req.user.id) {
            return res.status(401).json("Not authorized");
        }

        const now = new Date();

        // Create the actual transaction
        if (recurring.type === "income") {
            await Income.create({
                title: recurring.title,
                amount: recurring.amount,
                category: recurring.category,
                date: now,
                user: recurring.user
            });
        } else {
            await Expense.create({
                title: recurring.title,
                amount: recurring.amount,
                category: recurring.category,
                date: now,
                user: recurring.user
            });
        }

        recurring.lastProcessed = now;
        await recurring.save();

        res.json({ message: "Transaction processed successfully" });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

// Schedule cron job to run daily at midnight
cron.schedule("0 0 * * *", () => {
    console.log("Running recurring transactions check...");
    exports.processRecurringTransactions();
});
