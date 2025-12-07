const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getUserStats,
  getNotificationsCount,
  getUserReport  // NEW
} = require('../controllers/videoController');

// All routes require authentication
router.use(authMiddleware);

// Get user statistics
router.get('/stats', getUserStats);

// NEW: Get comprehensive user report
router.get('/report', getUserReport);

// Get notifications
router.get('/count', getNotificationsCount);

module.exports = router;
