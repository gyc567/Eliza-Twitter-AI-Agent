import { verifyTwitterCredentialsWithCurl, testTwitterConnectionWithCurl } from './src/lib/twitterCurl.ts';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testTwitterCurlBackup() {
  console.log('🧪 Testing Twitter API curl backup solution...');
  
  const apiKey = process.env.NEXT_PUBLIC_TWITTER_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_TWITTER_API_SECRET;
  const accessToken = process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN;
  const accessTokenSecret = process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET;
  
  console.log('Using credentials:');
  console.log('API Key:', apiKey);
  console.log('Access Token:', accessToken);
  
  try {
    // 测试连接
    console.log('\n🔍 Step 1: Testing connection...');
    const connectionTest = await testTwitterConnectionWithCurl(apiKey, apiSecret, accessToken, accessTokenSecret);
    
    if (!connectionTest) {
      console.log('❌ Connection test failed');
      return false;
    }
    
    // 验证凭据
    console.log('\n🔍 Step 2: Verifying credentials...');
    const userInfo = await verifyTwitterCredentialsWithCurl(apiKey, apiSecret, accessToken, accessTokenSecret);
    
    console.log('✅ Twitter API curl backup working!');
    console.log('Username:', userInfo.screen_name);
    console.log('Name:', userInfo.name);
    console.log('Followers:', userInfo.followers_count);
    console.log('Following:', userInfo.friends_count);
    
    return true;
    
  } catch (error) {
    console.error('❌ Twitter curl backup failed:', error.message);
    
    if (error.message?.includes('Unauthorized')) {
      console.log('💡 Credentials appear to be invalid or expired');
      console.log('   - Check your Twitter Developer Portal');
      console.log('   - Regenerate your Access Token and Secret');
      console.log('   - Ensure your app has proper permissions');
    } else if (error.message?.includes('Forbidden')) {
      console.log('💡 App permissions issue');
      console.log('   - Your app may not have "Read and Write" permissions');
      console.log('   - Check Twitter Developer Portal app settings');
    }
    
    return false;
  }
}

testTwitterCurlBackup().then(success => {
  if (success) {
    console.log('\n🎉 Twitter API curl backup is working!');
    console.log('💡 This means your credentials are valid but Node.js has network issues.');
    console.log('📝 We can use this curl backup for posting tweets.');
  } else {
    console.log('\n💥 Twitter API curl backup also failed.');
    console.log('🔧 Please check your Twitter API credentials and app settings.');
  }
});