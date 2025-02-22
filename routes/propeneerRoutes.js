const express = require('express');
const router = express.Router();
const propeneerController = require('../controllers/propeneerController');
const { authenticate } = require("../middleware/auth");

router.post('/register', propeneerController.registerPropeneer);
router.post("/check-email", propeneerController.checkEmail);
router.post("/check-username", propeneerController.checkUsername);
router.post('/login', propeneerController.loginPropeneer);

// Protected Routes (require authentication)
router.get("/", authenticate, propeneerController.getPropeneer);

module.exports = router;