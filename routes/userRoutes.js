const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// Public Routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected Routes (require authentication)
router.get('/dashboard', authenticate, userController.getDashboard);


module.exports = router;