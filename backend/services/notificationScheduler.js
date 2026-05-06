const cron = require("node-cron");

const User = require("../models/User");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const SavingsGoal = require("../models/SavingsGoal");
const NotificationLog = require("../models/NotificationLog");

const { sendEmail } = require("./emailService");

const canSend = async ({ userId, type, dedupeKey, cooldownHours }) => {
    const existing = await NotificationLog.findOne({ user: userId, type, dedupeKey });

    if (!existing) return true;

    const now = new Date();
    const diffMs = now - new Date(existing.lastSentAt);
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours >= cooldownHours;
};

const markSent = async ({ userId, type, dedupeKey }) => {
    const now = new Date();

    await NotificationLog.findOneAndUpdate(
        { user: userId, type, dedupeKey },
        { $set: { lastSentAt: now } },
        { upsert: true, new: true }
    );
};

const getMonthKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
};

const getMonthRange = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    return { start, end };
};

const sendBudgetExceededAlerts = async () => {
    const now = new Date();
    const monthKey = getMonthKey(now);
    const { start, end } = getMonthRange(now);

    const budgets = await Budget.find({ monthlyBudget: { $gt: 0 } });

    for (const budget of budgets) {
        const user = await User.findById(budget.user);
        if (!user?.email) continue;

        const totalSpentAgg = await Expense.aggregate([
            {
                $match: {
                    user: budget.user,
                    date: { $gte: start, $lt: end }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const totalSpent = totalSpentAgg?.[0]?.total || 0;

        if (totalSpent <= budget.monthlyBudget) continue;

        const dedupeKey = monthKey;

        const ok = await canSend({
            userId: budget.user,
            type: "BUDGET_EXCEEDED",
            dedupeKey,
            cooldownHours: 24
        });

        if (!ok) continue;

        const overBy = totalSpent - budget.monthlyBudget;

        await sendEmail({
            to: user.email,
            subject: `Budget exceeded for ${monthKey}`,
            text: `You have exceeded your monthly budget. Budget: ₹${budget.monthlyBudget}, Spent: ₹${totalSpent}, Over by: ₹${overBy}.`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color:#dc2626;">Budget exceeded</h2>
                    <p>You have exceeded your monthly budget for <b>${monthKey}</b>.</p>
                    <ul>
                        <li><b>Budget</b>: ₹${Number(budget.monthlyBudget).toLocaleString()}</li>
                        <li><b>Spent</b>: ₹${Number(totalSpent).toLocaleString()}</li>
                        <li><b>Over by</b>: ₹${Number(overBy).toLocaleString()}</li>
                    </ul>
                    <p>Tip: Review expenses in your dashboard and adjust categories.</p>
                </div>
            `
        });

        await markSent({ userId: budget.user, type: "BUDGET_EXCEEDED", dedupeKey });
    }
};

const sendGoalReminders = async () => {
    const now = new Date();

    const goals = await SavingsGoal.find({});

    for (const goal of goals) {
        const user = await User.findById(goal.user);
        if (!user?.email) continue;

        const deadline = new Date(goal.deadline);
        const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

        const isCompleted = Number(goal.currentAmount) >= Number(goal.targetAmount);
        if (isCompleted) continue;

        // Due soon (7 days) or overdue
        let reminderType = null;
        if (daysLeft === 7) reminderType = "GOAL_DUE_SOON";
        if (daysLeft < 0) reminderType = "GOAL_OVERDUE";

        if (!reminderType) continue;

        const dedupeKey = `${goal._id}-${reminderType}-${getMonthKey(now)}`;

        const ok = await canSend({
            userId: goal.user,
            type: reminderType,
            dedupeKey,
            cooldownHours: 24
        });

        if (!ok) continue;

        const remaining = Math.max(Number(goal.targetAmount) - Number(goal.currentAmount), 0);

        await sendEmail({
            to: user.email,
            subject: reminderType === "GOAL_DUE_SOON" ? `Goal due in 7 days: ${goal.title}` : `Goal overdue: ${goal.title}`,
            text: `Goal: ${goal.title}. Target: ₹${goal.targetAmount}. Saved: ₹${goal.currentAmount}. Remaining: ₹${remaining}. Deadline: ${deadline.toDateString()}.`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color:#3b82f6;">Savings Goal Reminder</h2>
                    <p><b>${goal.title}</b> (${goal.category})</p>
                    <ul>
                        <li><b>Target</b>: ₹${Number(goal.targetAmount).toLocaleString()}</li>
                        <li><b>Saved</b>: ₹${Number(goal.currentAmount).toLocaleString()}</li>
                        <li><b>Remaining</b>: ₹${Number(remaining).toLocaleString()}</li>
                        <li><b>Deadline</b>: ${deadline.toLocaleDateString()}</li>
                    </ul>
                    <p>${reminderType === "GOAL_DUE_SOON" ? "Your goal deadline is coming soon. Add savings to stay on track." : "Your goal is overdue. Consider updating the deadline or adding savings."}</p>
                </div>
            `
        });

        await markSent({ userId: goal.user, type: reminderType, dedupeKey });
    }
};

const runDailyNotifications = async () => {
    await sendBudgetExceededAlerts();
    await sendGoalReminders();
};

// Daily at 9:00 AM server time
cron.schedule("0 9 * * *", async () => {
    try {
        await runDailyNotifications();
    } catch (err) {
        console.error("Notification scheduler error:", err);
    }
});

module.exports = {
    runDailyNotifications
};
