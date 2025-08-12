import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🧪 Testing Twitter API with new credentials...');

// 检查环境变量
console.log('API Key exists:', !!process.env.NEXT_PUBLIC_TWITTER_API_KEY);
console.log('API Key format:', process.env.NEXT_PUBLIC_TWITTER_API_KEY?.substring(0, 10) + '...');
console.log('API Key length:', process.env.NEXT_PUBLIC_TWITTER_API_KEY?.length);

console.log('API Secret exists:', !!process.env.NEXT_PUBLIC_TWITTER_API_SECRET);
console.log('API Secret length:', process.env.NEXT_PUBLIC_TWITTER_API_SECRET?.length);

console.log('Access Token exists:', !!process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN);
console.log('Access Token format:', process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN?.substring(0, 15) + '...');

console.log('Access Token Secret exists:', !!process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET);
console.log('Access Token Secret length:', process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET?.length);

try {
  const client = new TwitterApi({
    appKey: process.env.NEXT_PUBLIC_TWITTER_API_KEY,
    appSecret: process.env.NEXT_PUBLIC_TWITTER_API_SECRET,
    accessToken: process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET,
  });

  const rwClient = client.readWrite;
  
  console.log('🔍 Testing user authentication...');
  const user = await rwClient.v2.me();
  console.log('✅ User authenticated successfully!');
  console.log('Username:', user.data?.username);
  console.log('Name:', user.data?.name);
  console.log('User ID:', user.data?.id);
  
  console.log('🎉 Twitter API is working correctly with new credentials!');
  
} catch (error) {
  console.error('❌ Twitter API test failed:', error.message);
  console.error('Error code:', error.code);
  console.error('Error data:', error.data);
}