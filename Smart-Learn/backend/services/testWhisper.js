const { transcribeYouTubeVideo } = require('./whisperService');

// Test with a short video (first YouTube video ever - 18 seconds)
const testVideoId = 'jNQXAC9IVRw';

console.log('🧪 Testing Whisper transcription...\n');

transcribeYouTubeVideo(testVideoId, 'tiny')
  .then(transcript => {
    console.log('\n✅ TEST SUCCESSFUL!');
    console.log('\n📝 Transcript:');
    console.log(transcript);
  })
  .catch(error => {
    console.error('\n❌ TEST FAILED:', error.message);
  });
