const mongoose = require("mongoose");

const notificationLogSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    type: {
        type: String,
        required: true,
        index: true
    },

    dedupeKey: {
        type: String,
        required: true,
        index: true
    },

    lastSentAt: {
        type: Date,
        required: true
    }
},
{
    timestamps: true
}
);

notificationLogSchema.index({ user: 1, type: 1, dedupeKey: 1 }, { unique: true });

module.exports = mongoose.model("NotificationLog", notificationLogSchema);
