const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { generateQuiz, submitQuiz } = require('../controllers/videoController');

router.use(authMiddleware);

// Generate quiz for a specific segment
router.get('/:videoId/quiz/:segmentIndex', generateQuiz);

// Submit quiz answers
router.post('/:videoId/quiz/:segmentIndex/submit', submitQuiz);

module.exports = router;
