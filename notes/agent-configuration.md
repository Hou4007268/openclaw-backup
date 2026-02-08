# AI子代理配置指南

## 子代理功能矩阵

```
┌─────────────────┬──────────────┬──────────────┬──────────────┐
│     功能        │ localai-core │ kimi-writer  │ qwen-analyst │
├─────────────────┼──────────────┼──────────────┼──────────────┤
│ 文本生成        │      ✅      │      ✅      │      ✅      │
│ 联网搜索        │      ❌      │      ✅      │      ✅      │
│ AI绘图          │      ⚠️      │      ❌      │      ✅      │
│ 文档分析        │      ✅      │      ✅      │      ✅      │
│ 隐私保护        │      ✅      │      ❌      │      ❌      │
│ 本地知识库      │      ✅      │      ❌      │      ❌      │
│ 中文理解        │      ⚠️      │      ✅      │      ✅      │
│ 长文本(>8K)     │      ⚠️      │      ✅      │      ✅      │
│ 代码能力        │      ⚠️      │      ✅      │      ⚠️      │
└─────────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 1️⃣ localai-core（本地核心代理）

### 主要职责
- **隐私敏感任务**: 处理敏感信息，不上传云端
- **本地知识库**: 通过QMD检索本地文档
- **离线任务**: 无需联网的处理
- **成本优化**: 高频简单任务本地处理

### 使用场景
```yaml
场景1: 本地文档检索
  触发: "搜索本地风水资料"
  流程: QMD检索 → LocalAI总结

场景2: 敏感内容处理
  触发: "分析我的个人笔记"
  流程: 本地处理，不上传

场景3: 模板填充
  触发: "根据模板生成内容"
  流程: 本地模型快速生成
```

### 配置
```json
{
  "agent_id": "localai-core",
  "api_base": "http://localhost:8080/v1",
  "api_key": "dummy-key",
  "model": "phi-4",
  "temperature": 0.7,
  "max_tokens": 4096,
  "system_prompt": "你是一个专业的风水内容助手，擅长处理本地文档和敏感信息。"
}
```

---

## 2️⃣ kimi-writer（内容创作代理）

### 主要职责
- **推特文案**: 撰写风水故事、推文内容
- **长文创作**: 文章、博客、故事创作
- **联网搜索**: 验证事实、查找资料
- **多轮对话**: 复杂的交互式创作

### 使用场景
```yaml
场景1: 撰写风水推文
  触发: "写一篇关于办公风水的推特"
  流程: kimi生成 → 主人审核 → 发布

场景2: 联网验证
  触发: "查证这个风水说法"
  流程: 联网搜索 → 分析结果 → 给出结论

场景3: 长文创作
  触发: "写一个关于玄关风水的故事"
  流程: 分段生成 → 整合润色 → 输出
```

### 配置
```json
{
  "agent_id": "kimi-writer",
  "api_base": "http://localhost:8000/v1",
  "api_key": "YOUR_KIMI_REFRESH_TOKEN",
  "model": "kimi",
  "temperature": 0.8,
  "max_tokens": 8192,
  "system_prompt": "你是一宅一句的风水内容创作助手，擅长撰写轻松幽默、故事性强的风水推文。风格：真实、不迷信、有案例。",
  "capabilities": ["streaming", "web_search", "multi_turn"]
}
```

---

## 3️⃣ qwen-analyst（分析绘图代理）

### 主要职责
- **AI绘图**: 生成配图、示意图
- **文档分析**: 长文档摘要、分析
- **多模态**: 图文结合的任务
- **综合研究**: 深度分析、报告生成

### 使用场景
```yaml
场景1: 生成配图
  触发: "给这篇推文配个图"
  流程: 分析内容 → AI绘图 → 输出图片链接

场景2: 文档解读
  触发: "分析这份风水资料"
  流程: 上传文档 → 分段分析 → 总结要点

场景3: 图文创作
  触发: "做一个图文版的阳宅指南"
  流程: 生成文字 → AI配图 → 整合输出
```

### 配置
```json
{
  "agent_id": "qwen-analyst",
  "api_base": "http://localhost:8001/v1",
  "api_key": "YOUR_QWEN_REFRESH_TOKEN",
  "model": "qwen-max",
  "temperature": 0.6,
  "max_tokens": 8192,
  "system_prompt": "你是通义千问分析助手，擅长AI绘图、文档分析和多模态任务。",
  "capabilities": ["streaming", "image_generation", "document_analysis", "multi_modal"]
}
```

---

## 任务路由规则

### 自动路由逻辑
```javascript
function routeTask(task) {
  // 1. 检查是否涉及敏感信息
  if (task.contains(['私人', '敏感', '本地文件', '笔记'])) {
    return 'localai-core';
  }
  
  // 2. 检查是否需要AI绘图
  if (task.contains(['配图', '画图', '生成图片', '示意图'])) {
    return 'qwen-analyst';
  }
  
  // 3. 检查是否需要联网搜索
  if (task.contains(['搜索', '查证', '联网', '最新'])) {
    return 'kimi-writer'; // kimi联网能力更强
  }
  
  // 4. 检查是否是风水内容创作
  if (task.contains(['推文', '推特', '风水故事', '写文案'])) {
    return 'kimi-writer';
  }
  
  // 5. 检查是否是长文档分析
  if (task.contains(['分析文档', '解读', '长文'])) {
    return 'qwen-analyst';
  }
  
  // 默认使用kimi-writer
  return 'kimi-writer';
}
```

### 手动指定
用户可以通过前缀指定代理：
- `@localai` 或 `@本地` → localai-core
- `@kimi` 或 `@写作` → kimi-writer  
- `@qwen` 或 `@分析` → qwen-analyst

---

## 使用示例

### 示例1：撰写推文（自动路由到kimi-writer）
```
用户：写一条关于镜子摆放的推特文案
系统：→ 路由到 kimi-writer
      → 生成内容
      → 返回结果
```

### 示例2：生成配图（自动路由到qwen-analyst）
```
用户：给这条推文配个图
系统：→ 路由到 qwen-analyst
      → AI绘图
      → 返回图片
```

### 示例3：本地检索（自动路由到localai-core）
```
用户：搜索本地的风水资料
系统：→ 路由到 localai-core
      → QMD检索
      → LocalAI总结
```

### 示例4：手动指定
```
用户：@qwen 分析这份文档
系统：→ 强制使用 qwen-analyst
      → 文档分析
      → 返回结果
```

---

## 监控与维护

### 健康检查
```bash
# 检查LocalAI
curl http://localhost:8080/readyz

# 检查kimi-free-api
curl http://localhost:8000/v1/models

# 检查qwen-free-api  
curl http://localhost:8001/v1/models
```

### 日志查看
```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务
docker-compose logs -f localai
docker-compose logs -f kimi-free-api
docker-compose logs -f qwen-free-api
```

---

## Token获取指南

### Kimi Token
1. 访问 https://kimi.moonshot.cn
2. 按F12打开开发者工具
3. 选择 Application/存储 → Cookies
4. 找到 `refresh_token` 并复制

### Qwen Token  
1. 访问 https://tongyi.aliyun.com
2. 按F12打开开发者工具
3. 选择 Application/存储 → Cookies
4. 找到 `refresh_token` 并复制

---

*配置更新时间: 2026-02-08*
