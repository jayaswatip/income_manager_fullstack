const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    getBudget,
    updateBudget
} = require("../controllers/budgetController");

const router = express.Router();

router.get("/get", protect, getBudget);

router.put("/update", protect, updateBudget);

module.exports = router;
