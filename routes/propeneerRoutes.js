const express = require('express');
const router = express.Router();
const propeneerController = require('../controllers/propeneerController');

router.post('/register', propeneerController.registerPropeneer);
router.post("/check-email", propeneerController.checkEmail);
router.post("/check-username", propeneerController.checkUsername);
router.post('/login', propeneerController.loginPropeneer);

module.exports = router;