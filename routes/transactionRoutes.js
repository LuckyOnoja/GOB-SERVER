const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { authenticate } = require("../middleware/auth");

// Transfer funds
router.post("/transfer", authenticate, transactionController.transferFunds);

// get transactions for a user
router.get("/", authenticate, transactionController.getUserTransactions);

module.exports = router;
