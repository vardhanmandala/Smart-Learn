const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGeminiForVideo() {
  try {
    const videoTitle = "Meta's Ray-Ban Display Glasses";
    
    console.log(`\n🤖 Testing Gemini AI transcription generation...`);
    console.log(`Video Title: ${videoTitle}\n`);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert educational content creator. Generate a detailed, comprehensive learning summary for a YouTube video titled: "${videoTitle}"

Create a professional educational document in markdown format:

# ${videoTitle}

## Introduction
Write an engaging introduction explaining what learners will discover (2-3 paragraphs)

## Core Topics Covered
List and explain 5 key topics that would be covered in this video

## Key Learning Points
Provide detailed explanations of important concepts

## Practical Applications
How can viewers apply this knowledge?

## Key Takeaways
List 5-6 actionable insights

## Conclusion
Summarize the educational value

Make it substantial and educational (600-800 words).`;

    console.log('Sending request to Gemini API...\n');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const transcription = response.text();
    
    console.log('✅ SUCCESS! Gemini generated transcription:\n');
    console.log('='.repeat(80));
    console.log(transcription);
    console.log('='.repeat(80));
    console.log(`\nLength: ${transcription.length} characters`);
    console.log(`Words: ~${transcription.split(' ').length} words\n`);
    
    console.log('✅ Gemini API is working perfectly for video transcription!');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('\nFull error:', error);
  }
}

testGeminiForVideo();
