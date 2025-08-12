import https from 'https';
import { URL } from 'url';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function callGeminiDirect(prompt: string, apiKey: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.8
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: '/v1beta/models/gemini-1.5-flash:generateContent',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 30000,
      // 添加这些选项来处理网络问题
      rejectUnauthorized: true, // 保持 SSL 验证
      keepAlive: false
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response: GeminiResponse = JSON.parse(data);
          if (response.candidates && response.candidates[0]) {
            const text = response.candidates[0].content.parts[0].text;
            resolve(text);
          } else {
            reject(new Error('Invalid response format'));
          }
        } catch (error) {
          console.error('Parse error:', error);
          console.error('Raw response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('Request timeout');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// 测试函数
export async function testGeminiDirect(apiKey: string): Promise<boolean> {
  try {
    const response = await callGeminiDirect('Say hello', apiKey);
    console.log('✅ Direct Gemini call successful:', response);
    return true;
  } catch (error) {
    console.error('❌ Direct Gemini call failed:', error);
    return false;
  }
}