# Obsidian + OpenClaw MCP 接入指南

## 方法1：使用 Smithery AI（推荐）

Smithery 提供现成的 MCP 服务器，可以连接多种 AI：

1. 访问 https://smithery.ai
2. 注册账号
3. 添加 MCP Server → 选择 Anthropic / OpenAI
4. 在 Obsidian 中安装 MCP 插件
5. 配置 Smithery 提供的 endpoint

## 方法2：本地 MCP 服务器

如果想自己托管：

```bash
# 安装 MCP SDK
npm install -g @modelcontextprotocol/server

# 创建一个简单的 MCP 服务器
# 参考: https://modelcontextprotocol.io
```

## 方法3：快捷方式（立即可用）

Obsidian 作为知识库，OpenClaw 作为 AI 引擎：

1. 用 Obsidian 写/管理笔记
2. 复制内容到 Discord 发给 OpenClaw
3. OpenClaw 处理后返回

---

## 当前状态

- ✅ Obsidian 已安装
- ✅ Smithery CLI 已登录
- ⚠️ MCP 连接需要进一步配置

### 已添加的 MCP 服务器

| 服务器 | 状态 | 说明 |
|--------|------|------|
| Obsidian Manager | ✅ 已连接 | 可用3个工具 |
| Obsidian Vault | ❌ 错误 | 404 |

### 可用工具

- `read_note` - 读取笔记
- `create_note_from_template` - 从模板创建笔记
- `list_templates` - 列出模板

### 问题

MCP 服务器需要配置 Obsidian vault 路径，但远程服务器可能不支持此配置。

---

## 替代方案：直接接入 OpenClaw

由于 MCP 配置复杂，建议使用快捷方式：

1. Obsidian 写笔记
2. 复制内容
3. 粘贴到 Discord 发给我
4. 我处理后返回
