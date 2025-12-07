// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/auth');
// const {
//   addVideo,
//   getRecentVideos,
//   getInProgressVideos,
//   getSavedVideos,
//   getVideoById,
//   getTranscription,
//   getSegmentTranscription,
//   handleChat,
//   deleteVideo,
//   generateQuiz,
//   submitQuiz
// } = require('../controllers/videoController');

// router.use(authMiddleware);

// // Video management
// router.post('/add', addVideo);
// router.get('/recent', getRecentVideos);
// router.get('/in-progress', getInProgressVideos);
// router.get('/saved', getSavedVideos);
// router.get('/:id/transcription', getTranscription);
// router.get('/:id/segment-transcription', getSegmentTranscription);
// router.get('/:id', getVideoById);
// router.delete('/:id', deleteVideo);

// // Chat
// router.post('/chat', handleChat);

// // Quiz - ✅ FIXED ROUTES
// router.get('/:videoId/quiz/:segmentIndex', generateQuiz);           // Generate quiz (GET)
// router.post('/:videoId/quiz/:segmentIndex/submit', submitQuiz);     // Submit quiz (POST)


// console.log('✅ Video routes registered:');
// console.log('   GET  /:videoId/quiz/:segmentIndex');
// console.log('   POST /:videoId/quiz/:segmentIndex/submit');
// module.exports = router;



const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  addVideo,
  getRecentVideos,
  getInProgressVideos,
  getSavedVideos,
  getVideoById,
  getTranscription,
  getSegmentTranscription,
  chatWithVideo,  // ✅ Changed from handleChat
  deleteVideo,
  generateQuiz,
  submitQuiz
} = require('../controllers/videoController');

router.use(authMiddleware);

// Video management
router.post('/add', addVideo);
router.get('/recent', getRecentVideos);
router.get('/in-progress', getInProgressVideos);
router.get('/saved', getSavedVideos);
router.get('/:id/transcription', getTranscription);
router.get('/:id/segment-transcription', getSegmentTranscription);
router.get('/:id', getVideoById);
router.delete('/:id', deleteVideo);

// Chat
router.post('/chat', chatWithVideo);  // ✅ Changed from handleChat

// Quiz
router.get('/:videoId/quiz/:segmentIndex', generateQuiz);
router.post('/:videoId/quiz/:segmentIndex/submit', submitQuiz);

console.log('✅ Video routes registered:');
console.log('   GET  /:videoId/quiz/:segmentIndex');
console.log('   POST /:videoId/quiz/:segmentIndex/submit');
console.log('   POST /chat');  // ✅ Added log

module.exports = router;
