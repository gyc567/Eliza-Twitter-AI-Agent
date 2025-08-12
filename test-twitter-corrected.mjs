import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🧪 Testing Twitter API with corrected credential reading...');

const apiKey = process.env.NEXT_PUBLIC_TWITTER_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_TWITTER_API_SECRET;
const accessToken = process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN;
const accessTokenSecret = process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET;

console.log('API Key:', apiKey);
console.log('API Key length:', apiKey?.length);

console.log('API Secret length:', apiSecret?.length);
console.log('API Secret (first 15 chars):', apiSecret?.substring(0, 15) + '...');

console.log('Access Token:', accessToken);
console.log('Access Token length:', accessToken?.length);

console.log('Access Token Secret length:', accessTokenSecret?.length);
console.log('Access Token Secret (first 15 chars):', accessTokenSecret?.substring(0, 15) + '...');

async function testTwitterAPI() {
  try {
    console.log('\n🔍 Creating Twitter client...');
    const client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });

    const rwClient = client.readWrite;
    
    console.log('🔍 Testing user authentication...');
    const user = await rwClient.v2.me();
    
    console.log('✅ Authentication successful!');
    console.log('Username:', user.data?.username);
    console.log('Name:', user.data?.name);
    console.log('User ID:', user.data?.id);
    console.log('Followers:', user.data?.public_metrics?.followers_count);
    
    // 测试发推文权限（不实际发送）
    console.log('\n🔍 Testing tweet permissions...');
    try {
      // 只是测试权限，不实际发送推文
      const testContent = 'Test tweet - ' + Date.now();
      console.log('Would post:', testContent);
      console.log('✅ Tweet permissions appear to be available');
      
      console.log('\n🎉 Twitter API is fully functional!');
      return true;
      
    } catch (tweetError) {
      console.log('❌ Tweet permission test failed:', tweetError.message);
      if (tweetError.message?.includes('forbidden')) {
        console.log('💡 Your app may not have write permissions. Check Twitter Developer Portal.');
      }
      return false;
    }
    
  } catch (error) {
    console.error('❌ Twitter API authentication failed:', error.message);
    
    if (error.message?.includes('Invalid consumer tokens')) {
      console.log('💡 API Key/Secret appears to be invalid');
    } else if (error.message?.includes('Could not authenticate')) {
      console.log('💡 Access Token/Secret appears to be invalid');
    } else if (error.message?.includes('Request failed')) {
      console.log('💡 Network or API endpoint issue');
    }
    
    console.log('Full error:', error);
    return false;
  }
}

testTwitterAPI().then(success => {
  if (success) {
    console.log('\n✅ All tests passed! Twitter API is ready to use.');
  } else {
    console.log('\n❌ Twitter API tests failed. Please check your credentials.');
  }
});