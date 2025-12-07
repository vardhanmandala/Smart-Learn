const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  youtubeId: { type: String, required: true },
  title: { type: String, required: true },
  thumbnail: { type: String },
  duration: { type: Number, required: true },
  totalSegments: { type: Number, required: true },
  currentSegment: { type: Number, default: 0 },
  completedSegments: { type: [Number], default: [] },
  passedQuizzes: { type: [Number], default: [] },
  progress: { type: Number, default: 0 },
  segmentWatchTime: { type: [Number], default: [] },

  // ✅ FIXED: Segment-wise transcription storage with default empty array
  segmentTranscriptions: {
    type: [{
      segment: { type: Number, required: true },
      transcription: { type: String, default: '' },
      audioData: { type: String, default: '' },
      startTime: { type: Number, required: true },
      endTime: { type: Number, required: true },
      status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
      },
      transcribedAt: { type: Date }
    }],
    default: [] // ✅ CRITICAL: Initialize as empty array
  },

  // ✅ DEPRECATED: Full transcription (keep for backward compatibility)
  transcription: { type: String },
  audioData: { type: String },

  transcriptionStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  transcriptionProgress: { type: Number, default: 0 },

  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date },
  lastWatched: { type: Date, default: Date.now },
  isSaved: { type: Boolean, default: false },

  quizScores: [{
    segment: Number,
    score: Number,
    attempts: Number,
    passed: Boolean,
    attemptedAt: Date
  }]
}, {
  timestamps: true
});



module.exports = mongoose.model('Video', videoSchema);
