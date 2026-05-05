const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createRecurring,
    getRecurring,
    updateRecurring,
    toggleActive,
    deleteRecurring,
    processSingle
} = require("../controllers/recurringTransactionController");

const router = express.Router();

router.post("/create", protect, createRecurring);

router.get("/get", protect, getRecurring);

router.put("/update/:id", protect, updateRecurring);

router.put("/toggle/:id", protect, toggleActive);

router.put("/process/:id", protect, processSingle);

router.delete("/delete/:id", protect, deleteRecurring);

module.exports = router;
