const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  segmentIndex: {
    type: Number,
    required: true
  },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String
  }],
  attempts: [{
    answers: [Number],
    score: Number,
    passed: Boolean,
    correctAnswers: Number,
    totalQuestions: Number,
    attemptedAt: {
      type: Date,
      default: Date.now
    },
    timeTaken: Number // seconds taken to complete quiz
  }],
  // NEW: Best attempt tracking
  bestScore: {
    type: Number,
    default: 0
  },
  isPassed: {
    type: Boolean,
    default: false
  },
  passedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
