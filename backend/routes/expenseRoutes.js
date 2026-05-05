const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    addExpense,
    getExpense,
    updateExpense,
    deleteExpense
} = require("../controllers/expenseController");

const router = express.Router();

router.post("/add", protect, addExpense);

router.get("/get", protect, getExpense);

router.put("/update/:id", protect, updateExpense);

router.delete("/delete/:id", protect, deleteExpense);

module.exports = router;
