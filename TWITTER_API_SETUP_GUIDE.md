# Twitter API 设置指南

## 问题诊断

你当前的 Twitter API 凭据格式不正确，无法用于发送推文。

## 获取有效的 Twitter API 凭据

### 1. 访问 Twitter Developer Portal
- 前往：https://developer.twitter.com/
- 使用你的 Twitter 账号登录

### 2. 创建应用
- 点击 "Create App" 或 "New App"
- 填写应用信息：
  - App name: 你的应用名称
  - Description: 应用描述
  - Website URL: 可以使用 `https://example.com`
  - Use case: 选择适合的用例

### 3. 获取 API 密钥
创建应用后，你会获得：
- **API Key** (Consumer Key): 25个字符，类似 `abcdefghijklmnopqrstuvwxy`
- **API Secret** (Consumer Secret): 50个字符，类似 `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`

### 4. 生成访问令牌
- 在应用设置中找到 "Keys and tokens"
- 点击 "Generate" 生成访问令牌：
  - **Access Token**: 格式为 `用户ID-随机字符串`，如 `1234567890-abcdefghijklmnopqrstuvwxyzABCDEFGHIJ`
  - **Access Token Secret**: 45个字符，类似 `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS`

### 5. 设置权限
确保你的应用有 "Read and Write" 权限才能发送推文。

## 更新环境变量

获得有效凭据后，更新你的 `.env.local` 文件：

```bash
# 移除 NEXT_PUBLIC_ 前缀以提高安全性
TWITTER_API_KEY=你的真实API_Key
TWITTER_API_SECRET=你的真实API_Secret  
TWITTER_ACCESS_TOKEN=你的真实Access_Token
TWITTER_ACCESS_TOKEN_SECRET=你的真实Access_Token_Secret
```

## 更新代码

同时需要更新 `src/lib/twitterApi.ts` 中的环境变量引用：

```typescript
const twitterApiKey = process.env.TWITTER_API_KEY;
const twitterApiSecret = process.env.TWITTER_API_SECRET;
const twitterAccessToken = process.env.TWITTER_ACCESS_TOKEN;
const twitterAccessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
```

## 测试连接

使用我们创建的测试脚本验证连接：
```bash
npx tsx test-twitter-api.js
```

## 注意事项

1. **不要在客户端暴露凭据**：移除 `NEXT_PUBLIC_` 前缀
2. **保护你的密钥**：不要将真实凭据提交到版本控制
3. **检查权限**：确保应用有发推文的权限
4. **遵守限制**：Twitter API 有速率限制，不要过于频繁地发送请求

## 常见错误

- `Invalid consumer tokens`: API Key/Secret 错误
- `Could not authenticate`: Access Token 问题
- `Forbidden`: 权限不足或应用被暂停
- `Rate limit exceeded`: 请求过于频繁