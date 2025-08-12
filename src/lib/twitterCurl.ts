import { exec } from 'child_process';
import { promisify } from 'util';
import crypto from 'crypto';

const execAsync = promisify(exec);

// OAuth 1.0a 签名生成函数
function generateOAuthSignature(method: string, url: string, params: Record<string, string>, consumerSecret: string, tokenSecret: string = ''): string {
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

// 创建 OAuth Authorization header
function createOAuthHeader(method: string, url: string, apiKey: string, apiSecret: string, accessToken: string, accessTokenSecret: string, additionalParams: Record<string, string> = {}): string {
  const oauthParams = {
    oauth_consumer_key: apiKey,
    oauth_token: accessToken,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_version: '1.0',
    ...additionalParams
  };
  
  // 生成签名
  const signature = generateOAuthSignature(method, url, oauthParams, apiSecret, accessTokenSecret);
  oauthParams.oauth_signature = signature;
  
  // 创建 Authorization header
  const authHeader = 'OAuth ' + Object.keys(oauthParams)
    .filter(key => key.startsWith('oauth_'))
    .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ');
  
  return authHeader;
}

// 使用 curl 验证 Twitter 凭据
export async function verifyTwitterCredentialsWithCurl(apiKey: string, apiSecret: string, accessToken: string, accessTokenSecret: string): Promise<any> {
  const url = 'https://api.twitter.com/1.1/account/verify_credentials.json';
  const method = 'GET';
  
  const authHeader = createOAuthHeader(method, url, apiKey, apiSecret, accessToken, accessTokenSecret);
  
  try {
    console.log('🔄 Verifying Twitter credentials with curl...');
    
    const curlCommand = `curl -s "${url}" \\
      -H "Authorization: ${authHeader}" \\
      -H "User-Agent: TwitterBot/1.0" \\
      --connect-timeout 30 \\
      --max-time 60`;
    
    const { stdout, stderr } = await execAsync(curlCommand);
    
    if (stderr) {
      console.error('Curl stderr:', stderr);
    }
    
    if (!stdout) {
      throw new Error('Empty response from curl');
    }
    
    const response = JSON.parse(stdout);
    
    if (response.errors) {
      throw new Error(`Twitter API Error: ${response.errors[0].message}`);
    }
    
    if (response.screen_name) {
      console.log('✅ Twitter credentials verified successfully');
      return response;
    } else {
      throw new Error('Invalid response format');
    }
    
  } catch (error: any) {
    console.error('❌ Twitter credential verification failed:', error.message);
    throw error;
  }
}

// 使用 curl 发送推文
export async function postTweetWithCurl(content: string, apiKey: string, apiSecret: string, accessToken: string, accessTokenSecret: string): Promise<any> {
  const url = 'https://api.twitter.com/1.1/statuses/update.json';
  const method = 'POST';
  
  // 推文参数
  const tweetParams = {
    status: content
  };
  
  const authHeader = createOAuthHeader(method, url, apiKey, apiSecret, accessToken, accessTokenSecret, tweetParams);
  
  try {
    console.log('🔄 Posting tweet with curl...');
    console.log('Tweet content:', content);
    
    const curlCommand = `curl -s "${url}" \\
      -H "Authorization: ${authHeader}" \\
      -H "Content-Type: application/x-www-form-urlencoded" \\
      -H "User-Agent: TwitterBot/1.0" \\
      -d "status=${encodeURIComponent(content)}" \\
      --connect-timeout 30 \\
      --max-time 60 \\
      -X POST`;
    
    const { stdout, stderr } = await execAsync(curlCommand);
    
    if (stderr) {
      console.error('Curl stderr:', stderr);
    }
    
    if (!stdout) {
      throw new Error('Empty response from curl');
    }
    
    const response = JSON.parse(stdout);
    
    if (response.errors) {
      throw new Error(`Twitter API Error: ${response.errors[0].message}`);
    }
    
    if (response.id_str) {
      console.log('✅ Tweet posted successfully');
      console.log('Tweet ID:', response.id_str);
      console.log('Tweet URL:', `https://twitter.com/${response.user.screen_name}/status/${response.id_str}`);
      return response;
    } else {
      throw new Error('Invalid response format');
    }
    
  } catch (error: any) {
    console.error('❌ Tweet posting failed:', error.message);
    throw error;
  }
}

// 测试 Twitter API 连接
export async function testTwitterConnectionWithCurl(apiKey: string, apiSecret: string, accessToken: string, accessTokenSecret: string): Promise<boolean> {
  try {
    await verifyTwitterCredentialsWithCurl(apiKey, apiSecret, accessToken, accessTokenSecret);
    return true;
  } catch (error) {
    return false;
  }
}