# 代码审计报告

> 日期: 2026-02-27
> 审计范围: /Users/yachaolailo/projects/openclaw-backup

---

## 一、攻击者视角 🔴

### 高危问题

| 问题 | 文件 | 建议 |
|------|------|------|
| CORS 允许所有来源 (`'*'`) | `projects/fengshui-website/api/chat.js:5` | 改为具体域名 |
| CORS 允许所有来源 (`'*'`) | `server.py:18` | 改为具体域名 |
| 缺少速率限制 | `server.py` | 添加 request limiter 防止 DoS |

### 中危问题

| 问题 | 文件 | 建议 |
|------|------|------|
| 错误消息可能泄露信息 | `server.py:89` | 生产环境隐藏 error.message |
| 缺少 CSRF 保护 | API endpoints | 添加 CSRF token 验证 |

---

## 二、防御者视角 🛡️

### 做得好 ✅

- `sensitive-check.js` - 输入长度校验 (MAX_INPUT_LENGTH = 50000)
- `server.py` - 文件类型白名单检查 (ALLOWED_EXTENSIONS)
- `server.py` - 文件大小限制 (MAX_FILE_SIZE = 10MB)
- `server.py` - 有 try-catch 错误处理

### 需改进

- `publish-verifier.js` - 缺少输入校验，应复用 sensitive-check.js 的校验逻辑
- 所有 API 缺少请求日志记录
- 缺少请求超时配置

---

## 三、隐私官视角 🔒

### 做得好的 ✅

- `.credentials/` 目录存在 (存储敏感信息)
- 敏感词库外置到 `.credentials/sensitive-words.json`
- API keys 使用环境变量 `process.env.SILICON_API_KEY`

### 需改进

- `projects/fengshui-website/api/stats.js` - 需检查是否有用户数据收集
- 添加隐私政策文档
- API 响应考虑添加数据脱敏

---

## 四、运维视角 ⚙️

### 做得好的 ✅

- `server.py` - `debug=False` 生产配置正确
- 有 `/health` 健康检查端点
- `sensitive-check.js` - 有内置备用词表作为降级方案

### 需改进

- 缺少请求限流 (rate limiting)
- 缺少 API 版本管理
- 没有请求超时配置 (server.py Ollama 调用 timeout=120)
- 没有进程监控 (PM2)

---

## 修复优先级

### P0 (立即修复)
1. 修改 CORS 白名单 - 防止未授权跨域请求
2. 添加速率限制 - 防止 API 滥用

### P1 (本周修复)
3. 错误消息脱敏
4. 添加请求日志
5. 添加 rate limiting

### P2 (后续迭代)
- 添加 PM2 进程管理
- 添加更多健康检查指标

---

*审计完成时间: 2026-02-27 02:45*
