const mongoose = require("mongoose");

const recurringTransactionSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },

    category: {
        type: String,
        required: true
    },

    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
        default: "monthly"
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date
    },

    isActive: {
        type: Boolean,
        default: true
    },

    lastProcessed: {
        type: Date
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

module.exports = mongoose.model("RecurringTransaction", recurringTransactionSchema);
