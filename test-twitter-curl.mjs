import { exec } from 'child_process';
import { promisify } from 'util';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const execAsync = promisify(exec);

// OAuth 1.0a 签名生成函数
function generateOAuthSignature(method, url, params, consumerSecret, tokenSecret = '') {
  // 创建参数字符串
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  // 创建签名基字符串
  const signatureBaseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
  
  // 创建签名密钥
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  
  // 生成签名
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');
  
  return signature;
}

async function testTwitterWithCurl() {
  console.log('🧪 Testing Twitter API with curl...');
  
  const apiKey = process.env.NEXT_PUBLIC_TWITTER_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_TWITTER_API_SECRET;
  const accessToken = process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN;
  const accessTokenSecret = process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET;
  
  console.log('Using API Key:', apiKey);
  
  // OAuth 1.0a 参数
  const oauthParams = {
    oauth_consumer_key: apiKey,
    oauth_token: accessToken,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_version: '1.0'
  };
  
  const url = 'https://api.twitter.com/2/users/me';
  const method = 'GET';
  
  // 生成签名
  const signature = generateOAuthSignature(method, url, oauthParams, apiSecret, accessTokenSecret);
  oauthParams.oauth_signature = signature;
  
  // 创建 Authorization header
  const authHeader = 'OAuth ' + Object.keys(oauthParams)
    .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ');
  
  console.log('Authorization header created');
  
  try {
    const curlCommand = `curl -s "${url}" \\
      -H "Authorization: ${authHeader}" \\
      -H "User-Agent: TwitterBot/1.0" \\
      --connect-timeout 30 \\
      --max-time 60`;
    
    console.log('🔄 Making curl request to Twitter API...');
    const { stdout, stderr } = await execAsync(curlCommand);
    
    if (stderr) {
      console.error('Curl stderr:', stderr);
    }
    
    if (!stdout) {
      throw new Error('Empty response from curl');
    }
    
    console.log('Raw response:', stdout);
    
    try {
      const response = JSON.parse(stdout);
      
      if (response.data) {
        console.log('✅ Twitter API authentication successful!');
        console.log('Username:', response.data.username);
        console.log('Name:', response.data.name);
        console.log('User ID:', response.data.id);
        return true;
      } else if (response.errors) {
        console.log('❌ Twitter API returned errors:', response.errors);
        return false;
      } else {
        console.log('❌ Unexpected response format:', response);
        return false;
      }
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', parseError.message);
      console.log('Raw response was:', stdout);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Curl request failed:', error.message);
    return false;
  }
}

testTwitterWithCurl().then(success => {
  if (success) {
    console.log('\n🎉 Twitter API works with curl! The credentials are valid.');
    console.log('💡 The issue is likely with Node.js network configuration, similar to the Google API issue.');
  } else {
    console.log('\n💥 Twitter API failed even with curl. Check your credentials.');
  }
});