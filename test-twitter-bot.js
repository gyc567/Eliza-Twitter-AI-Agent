import { generateTweet } from './src/lib/TwitterBot.ts';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🧪 Testing TwitterBot with fallback...');

generateTweet('AI and machine learning').then(result => {
  console.log('🎉 Tweet generated successfully:');
  console.log(result);
}).catch(error => {
  console.error('💥 Tweet generation failed:', error.message);
});