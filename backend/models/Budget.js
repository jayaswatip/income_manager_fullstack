const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
{
    monthlyBudget: {
        type: Number,
        required: true,
        default: 0
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Budget", budgetSchema);
