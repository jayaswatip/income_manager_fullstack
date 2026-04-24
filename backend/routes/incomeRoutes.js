const express = require("express");

const protect =
require("../middleware/authMiddleware");

const {
addIncome,
getIncome,
deleteIncome
}
= require("../controllers/incomeController");

const router = express.Router();

router.post("/add", protect, addIncome);

router.get("/get", protect, getIncome);

router.delete("/delete/:id", protect, deleteIncome);

module.exports = router;