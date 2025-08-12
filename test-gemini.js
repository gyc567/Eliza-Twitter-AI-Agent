// 简单的 Gemini API 测试脚本
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testGeminiAPI() {
  console.log('Testing Gemini API connection...');
  console.log('API Key exists:', !!process.env.GOOGLE_API_KEY);
  console.log('API Key prefix:', process.env.GOOGLE_API_KEY?.substring(0, 10) + '...');

  const chat = new ChatGoogleGenerativeAI({
    model: 'gemini-2.0-flash-exp',
    apiKey: process.env.GOOGLE_API_KEY,
    maxOutputTokens: 50,
    temperature: 0.7,
    maxRetries: 2,
  });

  try {
    console.log('Sending test message...');
    const response = await chat.invoke([
      new HumanMessage('Say hello in one sentence')
    ]);
    
    console.log('✅ Success! Response:', response.content);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    return false;
  }
}

// 运行测试
testGeminiAPI().then(success => {
  process.exit(success ? 0 : 1);
});