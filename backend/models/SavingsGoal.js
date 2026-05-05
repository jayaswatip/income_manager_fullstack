const mongoose = require("mongoose");

const savingsGoalSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    targetAmount: {
        type: Number,
        required: true
    },

    currentAmount: {
        type: Number,
        default: 0
    },

    deadline: {
        type: Date,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("SavingsGoal", savingsGoalSchema);
