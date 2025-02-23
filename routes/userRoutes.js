const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");

// Public Routes
router.post("/register", userController.registerUser);
router.post("/check-email", userController.checkEmail);
router.post("/login", userController.loginUser);
router.post("/update-fat", userController.updateFatStatus);

// Protected Routes (require authentication)
router.get("/", authenticate, userController.getUser);
router.get(
  "/search/:accountNumber",
  authenticate,
  userController.searchByAccountNumber
);

module.exports = router;
