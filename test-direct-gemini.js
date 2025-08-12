import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testDirectGemini() {
  console.log('🔍 Testing direct Google Generative AI SDK...');
  console.log('API Key exists:', !!process.env.GOOGLE_API_KEY);
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    
    // 尝试不同的模型
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'];
    
    for (const modelName of models) {
      console.log(`\n🧪 Testing model: ${modelName}`);
      
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent("Say hello in one word");
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ ${modelName} works! Response:`, text);
        return { success: true, model: modelName, response: text };
      } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.message);
      }
    }
    
    return { success: false };
  } catch (error) {
    console.error('❌ Direct SDK test failed:', error.message);
    return { success: false, error: error.message };
  }
}

testDirectGemini().then(result => {
  if (result.success) {
    console.log('\n🎉 Found working model:', result.model);
  } else {
    console.log('\n💥 All models failed');
  }
});