# 代码安全审计报告

**审计日期**: 2026-02-18  
**审计范围**: `/Users/yachaolailo/projects/openclaw-backup`  
**主要审计文件**: server.py, task-tracker.js, chat.js, fengshui-website/server.py

---

## 1. 攻击者视角 🔴

### 安全问题（高优修复）

| 问题 | 严重程度 | 文件:行号 | 描述 |
|------|----------|-----------|------|
| 🔴 **Debug模式开启** | 高 | server.py:148, fengshui-website/server.py:157 | 生产环境开启 `debug=True`，可能导致敏感信息泄露和代码执行风险 |
| 🔴 **无输入验证** | 中 | server.py:95-102, fengshui-website/server.py:18-25 | `/analyze` 和 `/api/floorplan/analyze` 端点未验证文件类型和大小，可能遭受恶意文件上传攻击 |
| 🔴 **CORS配置过于宽松** | 中 | server.py:12, fengshui-website/server.py:11 | `CORS(app)` 允许所有来源跨域请求，应限制具体域名 |
| 🟡 **异常信息泄露** | 中 | fengshui-website/api/chat.js:73 | `error.message` 可能暴露内部路径和系统信息 |

### 已有的安全措施

- ✅ chat.js 使用环境变量 `process.env.SILICON_API_KEY` 存储 API 密钥，未硬编码
- ✅ task-tracker.js 配置文件隔离存储

### 建议改进

- [ ] 使用环境变量控制 debug 模式: `debug=os.environ.get('DEBUG', 'False') == 'True'`
- [ ] 添加文件类型白名单: `allowed_extensions = {'png', 'jpg', 'jpeg'}`
- [ ] 添加上传文件大小限制: `MAX_CONTENT_LENGTH = 10 * 1024 * 1024`
- [ ] 配置 CORS 白名单: `CORS(app, origins=['https://example.com'])`

---

## 2. 防御者视角 🛡️

### 安全问题

| 问题 | 文件:行号 | 描述 |
|------|-----------|------|
| **缺少请求超时全局配置** | server.py, fengshui-website/server.py | 每个 requests 调用有独立 timeout，但未设置全局默认值 |
| **异常被静默吞掉** | fengshui-website/server.py:34, 50, 66, 84, 107, 129 | 多处使用 `except: pass`，隐藏了真实错误，难以调试和发现安全问题 |
| **无请求速率限制** | 所有 API 端点 | 缺少速率限制，容易遭受 DoS 攻击 |

### 做得好的地方

- ✅ task-tracker.js 有完整的错误处理 (try-catch)
- ✅ task-tracker.js 有 stale 任务检测机制
- ✅ token-reporter.js 有异常捕获，不影响主流程
- ✅ server.py 有健康检查端点 `/health`
- ✅ chat.js 有请求方法验证 (POST) 和参数验证

### 建议改进

- [ ] 替换 `except: pass` 为具体异常处理和日志记录
- [ ] 添加请求速率限制 (如 Flask-Limiter)
- [ ] 添加结构化日志系统替代 print()

---

## 3. 隐私官视角 🔒

### 安全问题

| 问题 | 严重程度 | 文件:行号 | 描述 |
|------|----------|-----------|------|
| **用户图片临时处理** | 低 | server.py:95, fengshui-website/server.py:18 | 用户上传图片直接传入 Ollama 处理，无本地存储是好的，但需确认 Ollama 服务安全 |

### 做得好的地方

- ✅ 用户上传的图片不会持久化存储
- ✅ token-reporter.js 只读取统计信息，不涉及用户数据
- ✅ task-tracker.js 的任务数据为系统内部数据
- ✅ chat.js 不保存用户对话历史

### 建议改进

- [ ] 添加隐私政策说明文件
- [ ] 在 API 响应中添加隐私声明响应头
- [ ] 考虑添加用户数据删除机制

---

## 4. 运维视角 ⚙️

### 性能问题

| 问题 | 文件:行号 | 描述 |
|------|-----------|------|
| **Ollama 调用超时过长** | server.py:47, fengshui-website/server.py:33 | `timeout=120` 可能导致长时间占用连接 |
| **token-reporter.js 全量扫描** | token-reporter.js:87-107 | 每次报告都读取所有 sessions 文件，大规模数据时性能差 |
| **同步处理请求** | server.py, fengshui-website/server.py | Flask 默认同步模式，高并发时性能受限 |

### 做得好的地方

- ✅ task-tracker.js 有配额控制机制 (checkQuota)
- ✅ 有自动审批白名单机制
- ✅ token-reporter.js 支持 JSON 输出便于集成
- ✅ 任务系统有 stale 检测

### 建议改进

- [ ] 添加缓存机制减少重复计算 (Redis/Memcached)
- [ ] 使用异步处理队列 (Celery/RQ)
- [ ] 考虑分页读取 sessions 目录
- [ ] 监控告警: health check 失败时发送通知

---

## 总结

| 视角 | 🔴 高危 | 🟡 中危 | 低危 | 建议 |
|------|---------|---------|------|------|
| 攻击者 | 1 | 3 | 0 | 4 |
| 防御者 | 0 | 3 | 0 | 3 |
| 隐私官 | 0 | 0 | 1 | 2 |
| 运维 | 0 | 2 | 1 | 4 |

### 已有的优点

1. 代码结构清晰，职责分离良好
2. 错误处理较为完善 (task-tracker.js)
3. 任务追踪系统设计合理 (配额 + 自动审批 + stale 检测)
4. Token 统计功能完整
5. API 密钥使用环境变量管理，未硬编码
6. 用户上传图片不持久化存储

### 立即行动项 (按优先级)

1. **🔴 关闭 debug 模式** - 修改为: `debug=os.environ.get('DEBUG', 'False') == 'True'`
2. **🔴 添加文件上传验证** - 文件类型和大小限制
3. **🟡 替换裸 except** - `except: pass` 改为具体异常处理
4. **🟡 配置 CORS 白名单** - 限制允许的域名
