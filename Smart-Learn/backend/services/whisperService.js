const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create temp directory for temporary processing only
const TEMP_DIR = path.join(__dirname, '../temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * Download audio from YouTube video to temp location
 */
const downloadYouTubeAudio = (videoId) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(TEMP_DIR, `${videoId}.mp3`);
    
    console.log(`📥 Downloading audio for video: ${videoId}`);
    
    const ytdlp = spawn('yt-dlp', [
      '-x',
      '--audio-format', 'mp3',
      '--audio-quality', '9',  // Lower quality = smaller files (0=best, 9=worst)
      '-o', outputPath,
      `https://www.youtube.com/watch?v=${videoId}`
    ]);

    let stdout = '';
    let stderr = '';

    ytdlp.stdout.on('data', (data) => {
      const output = data.toString().trim();
      stdout += output + '\n';
      if (output.includes('100%') || output.includes('Destination')) {
        console.log(`   ${output}`);
      }
    });

    ytdlp.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ytdlp.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`✅ Audio downloaded: ${fileSizeMB} MB`);
        resolve(outputPath);
      } else {
        console.error(`❌ yt-dlp failed with code ${code}`);
        if (stderr) console.error(`   Error: ${stderr}`);
        reject(new Error('Failed to download audio'));
      }
    });

    ytdlp.on('error', (error) => {
      console.error(`❌ yt-dlp spawn error:`, error.message);
      reject(error);
    });
  });
};

/**
 * Convert audio file to Base64 string
 */
const audioToBase64 = (audioPath) => {
  try {
    const audioBuffer = fs.readFileSync(audioPath);
    const base64Audio = audioBuffer.toString('base64');
    console.log(`📦 Converted audio to Base64: ${(base64Audio.length / 1024).toFixed(2)} KB`);
    return base64Audio;
  } catch (error) {
    console.error('❌ Audio to Base64 conversion failed:', error.message);
    throw error;
  }
};

/**
 * Convert Base64 string back to audio file (for transcription)
 */
const base64ToAudio = (base64Audio, outputPath) => {
  try {
    const audioBuffer = Buffer.from(base64Audio, 'base64');
    fs.writeFileSync(outputPath, audioBuffer);
    console.log(`📂 Restored audio from Base64: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('❌ Base64 to audio conversion failed:', error.message);
    throw error;
  }
};

/**
 * Transcribe audio file using Whisper
 */
const transcribeAudio = (audioPath, model = 'tiny') => {
  return new Promise((resolve, reject) => {
    console.log(`\n🎙️ Starting Whisper transcription...`);
    console.log(`   Model: ${model}`);
    
    const whisper = spawn('whisper', [
      audioPath,
      '--model', model,
      '--language', 'en',
      '--output_format', 'txt',
      '--output_dir', TEMP_DIR,
      '--verbose', 'False'
    ]);

    let stderr = '';

    whisper.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('%')) {
        process.stdout.write(`\r   Progress: ${output.trim()}`);
      }
    });

    whisper.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    whisper.on('close', (code) => {
      console.log(''); // New line after progress
      
      if (code === 0) {
        const baseName = path.basename(audioPath, path.extname(audioPath));
        const transcriptPath = path.join(TEMP_DIR, `${baseName}.txt`);
        
        if (fs.existsSync(transcriptPath)) {
          const transcription = fs.readFileSync(transcriptPath, 'utf-8');
          const wordCount = transcription.trim().split(/\s+/).length;
          console.log(`✅ Transcription complete!`);
          console.log(`   Characters: ${transcription.length}`);
          console.log(`   Words: ${wordCount}`);
          
          // Clean up transcript file
          fs.unlinkSync(transcriptPath);
          
          resolve(transcription.trim());
        } else {
          reject(new Error('Transcription file not found'));
        }
      } else {
        console.error(`❌ Whisper failed with code ${code}`);
        reject(new Error('Whisper transcription failed'));
      }
    });

    whisper.on('error', (error) => {
      console.error(`❌ Whisper spawn error:`, error.message);
      reject(error);
    });
  });
};

/**
 * Main function: Download, transcribe, and return Base64 audio
 */
const transcribeYouTubeVideo = async (videoId, model = 'tiny') => {
  let audioPath = null;

  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎬 WHISPER TRANSCRIPTION STARTED`);
    console.log(`   Video ID: ${videoId}`);
    console.log(`   Model: ${model}`);
    console.log(`${'='.repeat(60)}\n`);

    const startTime = Date.now();

    // Step 1: Download audio
    audioPath = await downloadYouTubeAudio(videoId);

    // Step 2: Convert to Base64 for storage
    const audioBase64 = audioToBase64(audioPath);

    // Step 3: Transcribe audio
    const transcription = await transcribeAudio(audioPath, model);

    // Step 4: Clean up temporary audio file
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
      console.log(`🗑️  Cleaned up temp audio file`);
    }

    // ✅ NEW: Clean up yt-dlp player cache files
    cleanupPlayerFiles();

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ WHISPER TRANSCRIPTION SUCCESSFUL!`);
    console.log(`   Total time: ${totalTime}s`);
    console.log(`${'='.repeat(60)}\n`);

    return {
      transcription,
      audioBase64
    };

  } catch (error) {
    // Clean up on error
    if (audioPath && fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }

    // Clean up player files even on error
    cleanupPlayerFiles();

    console.error(`\n${'='.repeat(60)}`);
    console.error(`❌ WHISPER TRANSCRIPTION FAILED`);
    console.error(`   Error: ${error.message}`);
    console.error(`${'='.repeat(60)}\n`);
    throw error;
  }
};


/**
 * Transcribe from existing Base64 audio (skip download)
 */
const transcribeFromBase64 = async (audioBase64, videoId, model = 'tiny') => {
  let audioPath = null;
  
  try {
    console.log(`\n🎙️ Transcribing from stored audio (Base64)...`);
    
    // Convert Base64 back to audio file temporarily
    audioPath = path.join(TEMP_DIR, `${videoId}_temp.mp3`);
    base64ToAudio(audioBase64, audioPath);
    
    // Transcribe
    const transcription = await transcribeAudio(audioPath, model);
    
    // Clean up
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
      console.log(`🗑️  Cleaned up temp audio file`);
    }
    
    return transcription;
    
  } catch (error) {
    if (audioPath && fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }
    throw error;
  }
};

/**
 * Clean up yt-dlp player cache files
 */
const cleanupPlayerFiles = () => {
  try {
    const backendDir = path.join(__dirname, '..');
    const files = fs.readdirSync(backendDir);
    
    let deletedCount = 0;
    files.forEach(file => {
      // Delete yt-dlp player cache files (pattern: timestamp-player-*.js)
      if (file.match(/^\d+-player-.+\.js$/)) {
        const filePath = path.join(backendDir, file);
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });
    
    if (deletedCount > 0) {
      console.log(`🗑️  Cleaned up ${deletedCount} yt-dlp player cache files`);
    }
  } catch (error) {
    console.error('Player file cleanup error:', error.message);
  }
};

/**
 * Clean up temp directory
 */
const cleanupTempFiles = () => {
  try {
    // Clean temp folder
    if (fs.existsSync(TEMP_DIR)) {
      const files = fs.readdirSync(TEMP_DIR);
      files.forEach(file => {
        const filePath = path.join(TEMP_DIR, file);
        fs.unlinkSync(filePath);
      });
      console.log(`🗑️  Cleaned ${files.length} temp files`);
    }
    
    // Also clean player cache files
    cleanupPlayerFiles();
    
  } catch (error) {
    console.error('Cleanup error:', error.message);
  }
};

module.exports = {
  transcribeYouTubeVideo,
  transcribeFromBase64,
  cleanupTempFiles
};
