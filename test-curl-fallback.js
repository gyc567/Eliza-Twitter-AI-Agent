import { testGeminiCurl } from './src/lib/geminiCurl.ts';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🧪 Testing curl fallback for Gemini...');
testGeminiCurl(process.env.GOOGLE_API_KEY).then(success => {
  if (success) {
    console.log('🎉 Curl fallback works! We can use this solution.');
  } else {
    console.log('💥 Even curl fallback failed.');
  }
});