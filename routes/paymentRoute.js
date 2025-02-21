const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Initialize Payment
router.post('/initialize', paymentController.initializePayment);

// Verify Payment
router.post('/verify', paymentController.verifyPayment);


module.exports = router;