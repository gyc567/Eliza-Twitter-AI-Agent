import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testTwitterAPI() {
  console.log('🧪 Testing Twitter API configuration...');
  
  // 检查环境变量
  console.log('API Key exists:', !!process.env.NEXT_PUBLIC_TWITTER_API_KEY);
  console.log('API Secret exists:', !!process.env.NEXT_PUBLIC_TWITTER_API_SECRET);
  console.log('Access Token exists:', !!process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN);
  console.log('Access Token Secret exists:', !!process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET);
  
  // 检查 API Key 格式
  console.log('API Key format:', process.env.NEXT_PUBLIC_TWITTER_API_KEY?.substring(0, 10) + '...');
  
  try {
    const client = new TwitterApi({
      appKey: process.env.NEXT_PUBLIC_TWITTER_API_KEY,
      appSecret: process.env.NEXT_PUBLIC_TWITTER_API_SECRET,
      accessToken: process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET,
    });

    const rwClient = client.readWrite;
    
    // 测试获取用户信息
    console.log('🔍 Testing user authentication...');
    const user = await rwClient.v2.me();
    console.log('✅ User authenticated:', user.data?.username);
    
    // 测试发推文（使用测试内容）
    console.log('🔍 Testing tweet posting...');
    const testTweet = 'Test tweet from API - ' + new Date().toISOString();
    
    try {
      const tweet = await rwClient.v2.tweet(testTweet);
      console.log('✅ Tweet posted successfully:', tweet.data?.id);
      
      // 立即删除测试推文
      if (tweet.data?.id) {
        await rwClient.v2.deleteTweet(tweet.data.id);
        console.log('🗑️ Test tweet deleted');
      }
      
      return true;
    } catch (tweetError) {
      console.error('❌ Tweet posting failed:', tweetError.message);
      
      // 检查是否是权限问题
      if (tweetError.message?.includes('forbidden') || tweetError.message?.includes('unauthorized')) {
        console.log('💡 This looks like a permissions issue. Check your Twitter API app settings.');
      }
      
      return false;
    }
    
  } catch (error) {
    console.error('❌ Twitter API test failed:', error.message);
    
    // 检查常见错误
    if (error.message?.includes('Invalid consumer tokens')) {
      console.log('💡 API Key/Secret appears to be invalid or incorrectly formatted');
    } else if (error.message?.includes('Could not authenticate')) {
      console.log('💡 Authentication failed - check your access tokens');
    }
    
    return false;
  }
}

testTwitterAPI().then(success => {
  if (success) {
    console.log('🎉 Twitter API is working correctly!');
  } else {
    console.log('💥 Twitter API has issues that need to be resolved.');
  }
});