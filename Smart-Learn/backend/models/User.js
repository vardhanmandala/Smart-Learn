const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name must be less than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  // NEW: Enhanced user statistics
  statistics: {
    totalVideosStarted: { type: Number, default: 0 },
    totalVideosCompleted: { type: Number, default: 0 },
    totalQuizzesTaken: { type: Number, default: 0 },
    totalQuizzesPassed: { type: Number, default: 0 },
    totalWatchTimeMinutes: { type: Number, default: 0 },
    averageQuizScore: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: Date.now }
  },
  // NEW: Learning preferences
  preferences: {
    segmentDuration: { type: Number, default: 10 }, // minutes
    quizDifficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    autoplayNext: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
