# Obsidian 本地 MCP 服务器

## 方法1：使用 obsidian-mcp-server（npm）

### 安装
```bash
npm install -g obsidian-mcp-server
```

### 配置
创建 `.env` 文件：
```bash
OBSIDIAN_VAULT_PATH=/Users/yachaolailo/projects/openclaw-backup
OBSIDIAN_API_KEY=你的Obsidian_API密钥
```

### 运行
```bash
npx obsidian-mcp-server
```

---

## 方法2：Obsidian 插件方案（推荐）

### 步骤1：安装插件
在 Obsidian 中：
1. 设置 → 社区插件 → 关闭安全模式
2. 浏览插件 → 搜索 **"Local REST API"**
3. 安装并启用

### 步骤2：获取 API Key
插件会提供本地 API 地址和密钥

### 步骤3：接入 Smithery
```bash
smithery mcp add "http://localhost:27123" --name "Local Obsidian"
```

---

## 当前状态
- ✅ obsidian-mcp-server 已安装
- ⏳ 需要配置 API Key
