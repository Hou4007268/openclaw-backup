# QMD Skill - 本地智能搜索

> qmd (Quick Markdown Search) - 基于全文和向量搜索的本地 Markdown 搜索引擎
> 端口: 8181 (MCP HTTP) | 索引: ~/.cache/qmd/index.sqlite

---

## 命令路径

**完整路径（推荐）：**
```bash
~/.bun/install/global/node_modules/qmd/qmd [command]
```

**如果已添加 PATH：**
```bash
qmd [command]
```

---

## 可用命令

### 搜索命令

```bash
# 混合搜索（查询扩展 + 重排序，最精准，推荐）
~/.bun/install/global/node_modules/qmd/qmd query "风水内容创作"

# 关键词搜索（BM25，速度快，无LLM）
~/.bun/install/global/node_modules/qmd/qmd search "关键词"

# 向量相似度搜索（无语义重排序）
~/.bun/install/global/node_modules/qmd/qmd vsearch "如何写好风水故事"

# 指定集合搜索
~/.bun/install/global/node_modules/qmd/qmd query "用户偏好" -c workspace
```

### 集合管理

```bash
# 查看状态
~/.bun/install/global/node_modules/qmd/qmd status

# 列出所有集合
~/.bun/install/global/node_modules/qmd/qmd collection list

# 列出集合中的文件
~/.bun/install/global/node_modules/qmd/qmd ls workspace

# 更新索引
~/.bun/install/global/node_modules/qmd/qmd update

# 创建向量嵌入
~/.bun/install/global/node_modules/qmd/qmd embed
```

### MCP 服务器

```bash
# 启动 HTTP MCP 服务器（前台）
~/.bun/install/global/node_modules/qmd/qmd mcp --http --port 8181

# 启动为后台守护进程
~/.bun/install/global/node_modules/qmd/qmd mcp --http --daemon

# 停止守护进程
~/.bun/install/global/node_modules/qmd/qmd mcp stop
```

---

## 搜索选项

| 选项 | 说明 |
|------|------|
| `-n <num>` | 结果数量（默认5） |
| `--all` | 返回所有匹配 |
| `--min-score <num>` | 最小相似度分数 |
| `--full` | 输出完整文档 |
| `--files` | 输出文件列表格式 |
| `--json` | JSON 格式输出 |
| `--md` | Markdown 格式输出 |
| `-c <name>` | 指定集合 |

---

## 集合 (Collections)

| 集合名 | 路径模式 | 当前文件数 |
|--------|----------|-----------|
| `workspace` | `**/*.md` | 30 |
| `daily-logs` | `**/*.md` | 0 |

**添加新集合：**
```bash
~/.bun/install/global/node_modules/qmd/qmd collection add /path/to/dir --name my-collection --mask "**/*.md"
```

---

## 使用示例

### 1. 搜索风水相关内容
```bash
~/.bun/install/global/node_modules/qmd/qmd query "风水故事写作技巧" -n 10
```

### 2. 查找用户偏好
```bash
~/.bun/install/global/node_modules/qmd/qmd query "主人偏好" -c workspace --json
```

### 3. 获取完整文档
```bash
~/.bun/install/global/node_modules/qmd/qmd get qmd://workspace/风水内容创作指南.md
```

### 4. 列出工作区所有文件
```bash
~/.bun/install/global/node_modules/qmd/qmd ls workspace
```

---

## 索引更新

### 手动更新
```bash
# 重新索引所有集合
~/.bun/install/global/node_modules/qmd/qmd update

# 先 git pull 再更新
~/.bun/install/global/node_modules/qmd/qmd update --pull

# 创建向量嵌入（用于语义搜索）
~/.bun/install/global/node_modules/qmd/qmd embed
```

### 自动更新建议
建议在以下情况更新索引：
1. 新增/修改了大量 markdown 文件后
2. 每天工作开始前（确保索引最新）
3. 搜索不到预期内容时

---

## 故障排除

### MCP 服务器无法连接
```bash
# 检查状态
~/.bun/install/global/node_modules/qmd/qmd status

# 重启 MCP 服务器
~/.bun/install/global/node_modules/qmd/qmd mcp stop
~/.bun/install/global/node_modules/qmd/qmd mcp --http --daemon
```

### 搜索结果为空
```bash
# 检查索引状态
~/.bun/install/global/node_modules/qmd/qmd status

# 重新索引
~/.bun/install/global/node_modules/qmd/qmd update

# 检查集合是否存在
~/.bun/install/global/node_modules/qmd/qmd collection list
```

### 清理缓存
```bash
~/.bun/install/global/node_modules/qmd/qmd cleanup
```

---

## 模型信息

qmd 使用以下 HuggingFace 模型（自动下载）：
- **Embedding:** embeddinggemma-300M-Q8_0
- **Reranking:** qwen3-reranker-0.6b-q8_0
- **Generation:** Qwen3-0.6B-Q8_0

---

*Last updated: 2026-02-13*
*QMD Version: 1.0.0*
