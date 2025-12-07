const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  verifyToken,
  logoutUser 
} = require('../controllers/authController');

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Verify token route
router.get('/verify', verifyToken);

// Logout route
router.post('/logout', logoutUser);

module.exports = router;
