const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

/* Connect Database */
connectDB();

/* Middleware */
app.use(express.json());
app.use(cors());

/* Routes */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/income", require("./routes/incomeRoutes"));

/* Test Route */
app.get("/", (req, res) => {
    res.send("Income Management API Running...");
});

/* Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});