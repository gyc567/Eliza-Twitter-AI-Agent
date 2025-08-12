import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

function analyzeCredentials() {
  console.log('🔍 Analyzing Twitter API credentials...');
  
  const apiKey = process.env.NEXT_PUBLIC_TWITTER_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_TWITTER_API_SECRET;
  const accessToken = process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN;
  const accessTokenSecret = process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET;
  
  console.log('\n📊 Credential Analysis:');
  console.log('API Key length:', apiKey?.length);
  console.log('API Key format:', apiKey?.substring(0, 15) + '...');
  console.log('API Key looks like base64:', /^[A-Za-z0-9+/]*={0,2}$/.test(apiKey || ''));
  
  console.log('\nAPI Secret length:', apiSecret?.length);
  console.log('API Secret format:', apiSecret?.substring(0, 15) + '...');
  console.log('API Secret looks like base64:', /^[A-Za-z0-9+/]*={0,2}$/.test(apiSecret || ''));
  
  console.log('\nAccess Token length:', accessToken?.length);
  console.log('Access Token format:', accessToken?.substring(0, 15) + '...');
  console.log('Access Token looks like Twitter format:', /^\d+-/.test(accessToken || ''));
  
  console.log('\nAccess Token Secret length:', accessTokenSecret?.length);
  console.log('Access Token Secret format:', accessTokenSecret?.substring(0, 15) + '...');
  console.log('Access Token Secret looks like base64:', /^[A-Za-z0-9+/]*={0,2}$/.test(accessTokenSecret || ''));
  
  // 尝试解码 base64 格式的凭据
  console.log('\n🔓 Attempting to decode base64 credentials:');
  
  try {
    const decodedApiKey = Buffer.from(apiKey, 'base64').toString('utf-8');
    console.log('Decoded API Key:', decodedApiKey);
    
    // 检查解码后的格式是否符合 Twitter API Key 格式
    if (decodedApiKey.includes(':')) {
      const [key, secret] = decodedApiKey.split(':');
      console.log('💡 API Key appears to contain both key and secret separated by ":"');
      console.log('Extracted Key:', key);
      console.log('Extracted Secret:', secret);
    }
  } catch (error) {
    console.log('❌ API Key is not valid base64');
  }
  
  try {
    const decodedApiSecret = Buffer.from(apiSecret, 'base64').toString('utf-8');
    console.log('Decoded API Secret:', decodedApiSecret);
  } catch (error) {
    console.log('❌ API Secret is not valid base64');
  }
  
  try {
    const decodedAccessTokenSecret = Buffer.from(accessTokenSecret, 'base64').toString('utf-8');
    console.log('Decoded Access Token Secret:', decodedAccessTokenSecret);
  } catch (error) {
    console.log('❌ Access Token Secret is not valid base64');
  }
  
  console.log('\n💡 Recommendations:');
  console.log('1. Twitter API keys should typically be 25 characters long');
  console.log('2. Twitter API secrets should typically be 50 characters long');
  console.log('3. Access tokens should start with a user ID followed by a dash');
  console.log('4. Access token secrets should be 45 characters long');
  console.log('5. If your credentials are base64 encoded, you need to decode them first');
}

analyzeCredentials();