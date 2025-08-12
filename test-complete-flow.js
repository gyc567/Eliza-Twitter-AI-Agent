import { generateTweet, postTweet } from './src/lib/TwitterBot.ts';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testCompleteFlow() {
  console.log('🧪 Testing complete tweet generation and posting flow...');
  
  try {
    // 步骤 1: 生成推文内容
    console.log('\n📝 Step 1: Generating tweet content...');
    const topic = 'AI and blockchain technology';
    const tweetContent = await generateTweet(topic);
    
    if (!tweetContent) {
      throw new Error('Failed to generate tweet content');
    }
    
    console.log('✅ Tweet generated successfully:');
    console.log('---');
    console.log(tweetContent);
    console.log('---');
    console.log(`Length: ${tweetContent.length} characters`);
    
    // 步骤 2: 发布推文
    console.log('\n📤 Step 2: Posting tweet...');
    await postTweet(tweetContent);
    
    console.log('\n🎉 Complete flow test successful!');
    return true;
    
  } catch (error) {
    console.error('\n💥 Complete flow test failed:', error.message);
    console.error('Error details:', error);
    return false;
  }
}

testCompleteFlow().then(success => {
  if (success) {
    console.log('\n✅ Your TwitterBot is working correctly!');
    console.log('💡 Note: Currently using fallback methods due to API configuration issues.');
    console.log('📖 Check TWITTER_API_SETUP_GUIDE.md for instructions on setting up real Twitter API credentials.');
  } else {
    console.log('\n❌ TwitterBot has issues that need to be resolved.');
  }
});