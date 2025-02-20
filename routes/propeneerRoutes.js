const express = require('express');
const router = express.Router();
const propeneerController = require('../controllers/propeneerController');

router.post('/register', propeneerController.registerPropeneer);
router.post('/login', propeneerController.loginPropeneer);

module.exports = router;