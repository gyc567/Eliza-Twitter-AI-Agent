import { callGeminiWithCurl } from './src/lib/geminiCurl.ts';
import { postTweetFallback } from './src/lib/twitterFallback.ts';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testSimpleFlow() {
  console.log('🧪 Testing simplified tweet generation and posting flow...');
  
  try {
    // 步骤 1: 使用 Gemini 生成推文内容
    console.log('\n📝 Step 1: Generating tweet with Gemini...');
    const topic = 'AI and blockchain technology';
    const prompt = `Create a creative tweet about ${topic}. Add emojis to express sentiment. Keep it under 280 characters and engaging.`;
    
    const tweetContent = await callGeminiWithCurl(prompt, process.env.GOOGLE_API_KEY);
    
    console.log('✅ Tweet generated successfully:');
    console.log('---');
    console.log(tweetContent);
    console.log('---');
    console.log(`Length: ${tweetContent.length} characters`);
    
    // 步骤 2: 使用备用方案"发布"推文
    console.log('\n📤 Step 2: Posting tweet (fallback mode)...');
    await postTweetFallback(tweetContent);
    
    console.log('\n🎉 Simplified flow test successful!');
    return true;
    
  } catch (error) {
    console.error('\n💥 Simplified flow test failed:', error.message);
    return false;
  }
}

testSimpleFlow();