const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createGoal,
    getGoals,
    updateGoal,
    addSavings,
    deleteGoal
} = require("../controllers/savingsGoalController");

const router = express.Router();

router.post("/create", protect, createGoal);

router.get("/get", protect, getGoals);

router.put("/update/:id", protect, updateGoal);

router.put("/add-savings/:id", protect, addSavings);

router.delete("/delete/:id", protect, deleteGoal);

module.exports = router;
