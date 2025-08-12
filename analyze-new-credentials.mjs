import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🔍 Analyzing new Twitter API credentials...');

const apiKey = process.env.NEXT_PUBLIC_TWITTER_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_TWITTER_API_SECRET;
const accessToken = process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN;
const accessTokenSecret = process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET;

console.log('\n📊 Credential Analysis:');
console.log('API Key:', apiKey);
console.log('API Key length:', apiKey?.length);
console.log('API Key looks like Twitter format:', /^[A-Za-z0-9]{25}$/.test(apiKey || ''));

console.log('\nAPI Secret:', apiSecret);
console.log('API Secret length:', apiSecret?.length);
console.log('API Secret looks like Twitter format:', /^[A-Za-z0-9]{50}$/.test(apiSecret || ''));

console.log('\nAccess Token:', accessToken);
console.log('Access Token length:', accessToken?.length);
console.log('Access Token looks like Twitter format:', /^\d+-[A-Za-z0-9]{40}$/.test(accessToken || ''));

console.log('\nAccess Token Secret:', accessTokenSecret);
console.log('Access Token Secret length:', accessTokenSecret?.length);
console.log('Access Token Secret looks like Twitter format:', /^[A-Za-z0-9]{45}$/.test(accessTokenSecret || ''));

console.log('\n💡 Twitter API credential format requirements:');
console.log('- API Key: 25 characters, alphanumeric');
console.log('- API Secret: 50 characters, alphanumeric');
console.log('- Access Token: format like "1234567890-abcdefghijklmnopqrstuvwxyzABCDEFGHIJ"');
console.log('- Access Token Secret: 45 characters, alphanumeric');

// 检查格式是否正确
const formatCheck = {
  apiKey: apiKey?.length === 25 && /^[A-Za-z0-9]{25}$/.test(apiKey),
  apiSecret: apiSecret?.length === 50 && /^[A-Za-z0-9]{50}$/.test(apiSecret),
  accessToken: /^\d+-[A-Za-z0-9]{40}$/.test(accessToken || ''),
  accessTokenSecret: accessTokenSecret?.length === 45 && /^[A-Za-z0-9]{45}$/.test(accessTokenSecret)
};

console.log('\n✅ Format validation:');
console.log('API Key format correct:', formatCheck.apiKey);
console.log('API Secret format correct:', formatCheck.apiSecret);
console.log('Access Token format correct:', formatCheck.accessToken);
console.log('Access Token Secret format correct:', formatCheck.accessTokenSecret);

const allValid = Object.values(formatCheck).every(valid => valid);
console.log('\n🎯 All credentials valid:', allValid);

if (!allValid) {
  console.log('\n⚠️ Some credentials have incorrect format. Please check:');
  if (!formatCheck.apiKey) console.log('- API Key should be exactly 25 alphanumeric characters');
  if (!formatCheck.apiSecret) console.log('- API Secret should be exactly 50 alphanumeric characters');
  if (!formatCheck.accessToken) console.log('- Access Token should be in format "userID-40characters"');
  if (!formatCheck.accessTokenSecret) console.log('- Access Token Secret should be exactly 45 alphanumeric characters');
}