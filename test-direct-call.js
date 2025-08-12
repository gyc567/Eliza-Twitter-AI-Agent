import { testGeminiDirect } from './src/lib/geminiDirect.ts';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🧪 Testing direct HTTPS call to Gemini...');
testGeminiDirect(process.env.GOOGLE_API_KEY).then(success => {
  if (success) {
    console.log('🎉 Direct call works! We can use this as fallback.');
  } else {
    console.log('💥 Direct call also failed. This is a network/firewall issue.');
  }
});