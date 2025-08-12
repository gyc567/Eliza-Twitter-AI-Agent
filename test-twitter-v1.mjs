import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testTwitterV1() {
  console.log('🧪 Testing Twitter API v1.1 endpoints...');

  const apiKey = process.env.NEXT_PUBLIC_TWITTER_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_TWITTER_API_SECRET;
  const accessToken = process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN;
  const accessTokenSecret = process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET;

  console.log('API Key:', apiKey);
  console.log('Access Token:', accessToken);

  try {
    const client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });

    // 尝试 v1.1 端点
    console.log('\n🔍 Testing v1.1 verify_credentials...');
    const v1Client = client.readWrite.v1;

    try {
      const user = await v1Client.verifyCredentials();
      console.log('✅ v1.1 Authentication successful!');
      console.log('Username:', user.screen_name);
      console.log('Name:', user.name);
      console.log('User ID:', user.id_str);
      console.log('Followers:', user.followers_count);

      // 测试发推文功能
      console.log('\n🔍 Testing tweet posting with v1.1...');
      const testTweet = `Test tweet from API - ${new Date().toISOString()}`;

      try {
        const tweet = await v1Client.tweet(testTweet);
        console.log('✅ Tweet posted successfully!');
        console.log('Tweet ID:', tweet.id_str);
        console.log('Tweet text:', tweet.text);

        // 立即删除测试推文
        await v1Client.deleteTweet(tweet.id_str);
        console.log('🗑️ Test tweet deleted');

        return true;
      } catch (tweetError) {
        console.log('❌ Tweet posting failed:', tweetError.message);
        if (tweetError.message?.includes('Read-only')) {
          console.log('💡 Your app appears to be in read-only mode. Check Twitter Developer Portal permissions.');
        }
        return false;
      }

    } catch (v1Error) {
      console.log('❌ v1.1 authentication failed:', v1Error.message);

      // 尝试 v2 端点
      console.log('\n🔍 Trying v2 endpoint as fallback...');
      try {
        const v2User = await client.readWrite.v2.me();
        console.log('✅ v2 Authentication successful!');
        console.log('Username:', v2User.data?.username);
        return true;
      } catch (v2Error) {
        console.log('❌ v2 authentication also failed:', v2Error.message);
        return false;
      }
    }

  } catch (error) {
    console.error('❌ Twitter client creation failed:', error.message);

    // 详细错误分析
    if (error.message?.includes('Invalid consumer tokens')) {
      console.log('💡 API Key/Secret appears to be invalid');
      console.log('   - Check that API Key is exactly 25 characters');
      console.log('   - Check that API Secret is exactly 50 characters');
    } else if (error.message?.includes('Could not authenticate')) {
      console.log('💡 Access Token/Secret appears to be invalid');
      console.log('   - Check that Access Token follows format: userID-40characters');
      console.log('   - Check that Access Token Secret is exactly 45 characters');
    }

    return false;
  }
}

testTwitterV1().then(success => {
  if (success) {
    console.log('\n🎉 Twitter API is working! You can now use it for posting tweets.');
  } else {
    console.log('\n💥 Twitter API authentication failed. Please verify your credentials in Twitter Developer Portal.');
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Go to https://developer.twitter.com/');
    console.log('2. Check your app permissions (should be "Read and Write")');
    console.log('3. Regenerate your Access Token and Secret if needed');
    console.log('4. Make sure your app is not suspended');
  }
});