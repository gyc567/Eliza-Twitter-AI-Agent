import https from 'https';
import { URL } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// 测试基本的 HTTPS 连接
async function testHttpsConnection() {
  console.log('🔍 Testing HTTPS connection to Google API...');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: '/v1beta/models',
      method: 'GET',
      headers: {
        'X-goog-api-key': process.env.GOOGLE_API_KEY
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      console.log(`✅ HTTPS Status: ${res.statusCode}`);
      console.log(`✅ Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('✅ HTTPS connection successful');
        resolve(data);
      });
    });

    req.on('error', (error) => {
      console.error('❌ HTTPS connection failed:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('❌ HTTPS connection timeout');
      req.destroy();
      reject(new Error('Connection timeout'));
    });

    req.end();
  });
}

// 测试使用 fetch API
async function testFetchAPI() {
  console.log('\n🔍 Testing fetch API...');
  
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': process.env.GOOGLE_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Hello"
          }]
        }]
      })
    });

    console.log(`✅ Fetch Status: ${response.status}`);
    const data = await response.text();
    console.log('✅ Fetch response:', data.substring(0, 200) + '...');
    return true;
  } catch (error) {
    console.error('❌ Fetch failed:', error.message);
    console.error('❌ Error details:', error);
    return false;
  }
}

// 检查环境变量
function checkEnvironment() {
  console.log('\n🔍 Checking environment...');
  console.log('Node.js version:', process.version);
  console.log('Platform:', process.platform);
  console.log('API Key exists:', !!process.env.GOOGLE_API_KEY);
  console.log('API Key length:', process.env.GOOGLE_API_KEY?.length);
  console.log('API Key prefix:', process.env.GOOGLE_API_KEY?.substring(0, 15) + '...');
  
  // 检查代理设置
  console.log('HTTP_PROXY:', process.env.HTTP_PROXY || 'not set');
  console.log('HTTPS_PROXY:', process.env.HTTPS_PROXY || 'not set');
  console.log('NO_PROXY:', process.env.NO_PROXY || 'not set');
}

async function runDiagnostics() {
  console.log('🚀 Starting network diagnostics...\n');
  
  checkEnvironment();
  
  try {
    await testHttpsConnection();
  } catch (error) {
    console.error('HTTPS test failed, continuing...');
  }
  
  await testFetchAPI();
  
  console.log('\n✅ Diagnostics complete');
}

runDiagnostics().catch(console.error);