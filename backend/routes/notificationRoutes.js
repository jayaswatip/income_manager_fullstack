const express = require("express");

const protect = require("../middleware/authMiddleware");
const { sendTestEmail } = require("../controllers/notificationController");

const router = express.Router();

router.post("/test", protect, sendTestEmail);

module.exports = router;
