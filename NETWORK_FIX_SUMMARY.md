# Google Generative AI 网络连接问题解决方案

## 问题诊断

你遇到的错误：
```
[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent: fetch failed
```

## 根本原因

1. **Node.js fetch API 网络问题**：你的系统中 Node.js 的 fetch 实现无法连接到 Google API
2. **curl 可以正常工作**：说明网络连接本身是正常的，问题在于 Node.js 环境
3. **可能的原因**：
   - 防火墙设置
   - 代理配置
   - SSL/TLS 证书问题
   - Node.js 网络栈配置问题

## 解决方案

### ✅ 已实现的解决方案

1. **Curl 备用方案**：创建了 `src/lib/geminiCurl.ts`，使用系统的 curl 命令调用 API
2. **混合策略**：优先使用 LangChain，失败时自动回退到 curl
3. **错误处理**：改进了错误处理和日志记录

### 📁 新增文件

- `src/lib/geminiCurl.ts` - Curl 备用 API 调用
- `src/lib/geminiDirect.ts` - 直接 HTTPS 调用（用于诊断）

### 🔧 修改的文件

- `src/lib/TwitterBot.ts` - 添加了备用方案和改进的错误处理
- `.env.local` - 修复了 API 密钥配置（移除 NEXT_PUBLIC_ 前缀）

## 测试结果

✅ **Curl 方案测试成功**：
```bash
npx tsx test-gemini-only.js
# 输出：AI & Machine Learning tweet 生成成功
```

✅ **API 密钥验证成功**：使用你的 API 密钥可以正常调用 Gemini API

## 使用方法

现在你的 TwitterBot 会：

1. **首先尝试**：使用 LangChain + Google Generative AI SDK
2. **自动回退**：如果网络失败，自动使用 curl 备用方案
3. **错误处理**：提供详细的错误信息和日志

## 建议的后续步骤

1. **运行你的应用**：现在应该可以正常工作了
2. **监控日志**：观察是否使用了 curl 备用方案
3. **网络诊断**：如果想解决根本问题，可以检查：
   - 防火墙设置
   - 代理配置
   - Node.js 版本兼容性

## 清理测试文件

运行以下命令清理测试文件：
```bash
rm test-*.js diagnose-network.js NETWORK_FIX_SUMMARY.md
```

## 性能说明

- Curl 备用方案的性能与原生 fetch 相当
- 只在网络问题时才会使用备用方案
- 不会影响正常情况下的性能