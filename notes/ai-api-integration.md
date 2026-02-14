# 三大AI API接入配置

## 1. LocalAI（本地部署）

### 部署命令
```bash
# Docker部署（CPU版本）
docker run -p 8080:8080 -v $PWD/models:/models localai/localai:latest-cpu

# 或带GPU版本
docker run --gpus all -p 8080:8080 -v $PWD/models:/models localai/localai:latest-gpu-nvidia-cuda-12
```

### 配置参数
- **API地址**: `http://localhost:8080/v1`
- **API密钥**: 无需（本地部署）
- **模型路径**: `./models`

### 推荐模型
- 文本生成: `phi-4` 或 `qwen2.5-7b`
- 嵌入模型: `nomic-embed-text`

---

## 2. kimi-free-api（Moonshot AI）

### 部署命令
```bash
# Docker部署
docker run -p 8000:8000 vinlic/kimi-free-api:latest

# 或Node.js原生
git clone https://github.com/LLM-Red-Team/kimi-free-api.git
cd kimi-free-api
npm install
npm start
```

### 配置参数
- **API地址**: `http://localhost:8000/v1`
- **API密钥**: 从 https://kimi.moonshot.cn 获取refresh_token
- **支持的模型**: 
  - `kimi` - 默认模型
  - `kimi-k1` - 推理模型

### 获取Token步骤
1. 访问 https://kimi.moonshot.cn 并登录
2. 打开浏览器开发者工具(F12)
3. 找到Application/Storage → Cookies
4. 复制 `refresh_token` 的值

---

## 3. qwen-free-api（通义千问）

### 部署命令
```bash
# Docker部署
docker run -p 8001:8000 vinlic/qwen-free-api:latest

# 或Node.js原生
git clone https://github.com/LLM-Red-Team/qwen-free-api.git
cd qwen-free-api
npm install
npm start
```

### 配置参数
- **API地址**: `http://localhost:8001/v1`
- **API密钥**: 从 https://tongyi.aliyun.com 获取refresh_token
- **支持的模型**:
  - `qwen` - 默认模型
  - `qwen-max` - 最强模型

### 获取Token步骤
1. 访问 https://tongyi.aliyun.com 并登录
2. 打开浏览器开发者工具(F12)
3. 找到Application/Storage → Cookies
4. 复制 `refresh_token` 的值

---

## 子代理分配规则

### localai-core（本地核心）
```yaml
职责:
  - 敏感数据处理
  - 本地知识库查询
  - 隐私保护任务
  - QMD文档检索增强

触发条件:
  - 包含"本地"、"隐私"、"敏感"关键词
  - 需要访问本地文件
  - 用户明确要求离线处理

配置:
  api_base: http://localhost:8080/v1
  model: phi-4
  temperature: 0.7
```

### kimi-writer（内容创作）
```yaml
职责:
  - 推特文案撰写
  - 风水故事创作
  - 长文本生成
  - 联网搜索验证

触发条件:
  - 内容创作类任务
  - 需要联网搜索
  - 中文长文本生成

配置:
  api_base: http://localhost:8000/v1
  model: kimi
  temperature: 0.8
```

### qwen-analyst（分析绘图）
```yaml
职责:
  - AI图像生成
  - 长文档分析
  - 多模态任务
  - 综合数据分析

触发条件:
  - 需要配图生成
  - 长文档解读
  - 图像分析任务

配置:
  api_base: http://localhost:8001/v1
  model: qwen-max
  temperature: 0.6
```

---

## Docker Compose 一键部署

```yaml
version: '3.8'

services:
  localai:
    image: localai/localai:latest-cpu
    ports:
      - "8080:8080"
    volumes:
      - ./models:/models
    environment:
      - MODELS_PATH=/models
    restart: unless-stopped

  kimi-free-api:
    image: vinlic/kimi-free-api:latest
    ports:
      - "8000:8000"
    environment:
      - TZ=Asia/Shanghai
    restart: unless-stopped

  qwen-free-api:
    image: vinlic/qwen-free-api:latest
    ports:
      - "8001:8000"
    environment:
      - TZ=Asia/Shanghai
    restart: unless-stopped
```

---

## 下一步操作

1. 创建 `docker-compose.yml` 文件
2. 运行 `docker-compose up -d` 启动服务
3. 获取kimi和qwen的refresh_token
4. 配置子代理使用相应API
