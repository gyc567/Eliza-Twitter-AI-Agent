import { callGeminiWithCurl } from './src/lib/geminiCurl.ts';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testGeminiGeneration() {
  console.log('🧪 Testing Gemini tweet generation...');
  
  const topic = 'AI and machine learning';
  const prompt = `Create a creative tweet about ${topic}. Add emojis to express sentiment. Keep it under 280 characters and engaging.`;
  
  try {
    const result = await callGeminiWithCurl(prompt, process.env.GOOGLE_API_KEY);
    console.log('🎉 Tweet generated successfully:');
    console.log('---');
    console.log(result);
    console.log('---');
    console.log(`Length: ${result.length} characters`);
    return true;
  } catch (error) {
    console.error('💥 Tweet generation failed:', error.message);
    return false;
  }
}

testGeminiGeneration();