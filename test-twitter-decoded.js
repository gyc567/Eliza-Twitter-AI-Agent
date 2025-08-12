import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

function decodeBase64(encoded) {
  try {
    return Buffer.from(encoded, 'base64').toString('utf-8');
  } catch (error) {
    console.log('Not base64 encoded:', encoded.substring(0, 10) + '...');
    return encoded;
  }
}

async function testTwitterAPIDecoded() {
  console.log('🧪 Testing Twitter API with decoded credentials...');
  
  // 尝试解码凭据
  const apiKey = decodeBase64(process.env.NEXT_PUBLIC_TWITTER_API_KEY);
  const apiSecret = decodeBase64(process.env.NEXT_PUBLIC_TWITTER_API_SECRET);
  const accessToken = process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN; // 这个通常不是 base64
  const accessTokenSecret = decodeBase64(process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET);
  
  console.log('Decoded API Key:', apiKey.substring(0, 10) + '...');
  console.log('Decoded API Secret:', apiSecret.substring(0, 10) + '...');
  console.log('Access Token:', accessToken.substring(0, 10) + '...');
  console.log('Decoded Access Token Secret:', accessTokenSecret.substring(0, 10) + '...');
  
  try {
    const client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });

    const rwClient = client.readWrite;
    
    // 测试获取用户信息
    console.log('🔍 Testing user authentication...');
    const user = await rwClient.v2.me();
    console.log('✅ User authenticated:', user.data?.username);
    
    return true;
    
  } catch (error) {
    console.error('❌ Twitter API test failed:', error.message);
    console.error('Error details:', error);
    return false;
  }
}

testTwitterAPIDecoded().then(success => {
  if (success) {
    console.log('🎉 Twitter API is working with decoded credentials!');
  } else {
    console.log('💥 Twitter API still has issues.');
  }
});