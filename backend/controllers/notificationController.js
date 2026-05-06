const User = require("../models/User");
const { sendEmail } = require("../services/emailService");

exports.sendTestEmail = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user?.email) {
            return res.status(400).json("No email found for this user");
        }

        await sendEmail({
            to: user.email,
            subject: "Test Email - Personal Finance Tracker",
            text: "This is a test email from Personal Finance Tracker. SMTP is configured correctly.",
            html: "<h2>✅ SMTP Working</h2><p>This is a test email from <b>Personal Finance Tracker</b>.</p>"
        });

        res.json({ message: "Test email sent" });
    } catch (error) {
        res.status(500).json(error.message);
    }
};
