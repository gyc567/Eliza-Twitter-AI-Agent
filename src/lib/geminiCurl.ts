import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function callGeminiWithCurl(prompt: string, apiKey: string): Promise<string> {
  const requestBody = JSON.stringify({
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

  // 使用 curl 命令，因为你的 curl 测试是成功的
  const curlCommand = `curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent" \
    -H 'Content-Type: application/json' \
    -H 'X-goog-api-key: ${apiKey}' \
    -X POST \
    -d '${requestBody.replace(/'/g, "'\\''")}' \
    --connect-timeout 30 \
    --max-time 60`;

  try {
    console.log('🔄 Using curl fallback for Gemini API...');
    const { stdout, stderr } = await execAsync(curlCommand);
    
    if (stderr) {
      console.error('Curl stderr:', stderr);
    }
    
    if (!stdout) {
      throw new Error('Empty response from curl');
    }

    const response = JSON.parse(stdout);
    
    if (response.candidates && response.candidates[0]) {
      const text = response.candidates[0].content.parts[0].text;
      console.log('✅ Curl fallback successful');
      return text;
    } else if (response.error) {
      throw new Error(`API Error: ${response.error.message}`);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    console.error('❌ Curl fallback failed:', error.message);
    throw error;
  }
}

// 测试函数
export async function testGeminiCurl(apiKey: string): Promise<boolean> {
  try {
    const response = await callGeminiWithCurl('Say hello in one word', apiKey);
    console.log('✅ Curl Gemini call successful:', response);
    return true;
  } catch (error) {
    console.error('❌ Curl Gemini call failed:', error);
    return false;
  }
}