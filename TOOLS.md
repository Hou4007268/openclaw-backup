# TOOLS.md - Tool Configuration & Notes

> Document tool-specific configurations, gotchas, and credentials here.

---

## Credentials Location

All credentials stored in `.credentials/` (gitignored):
- `ai-apis.env` — AI API tokens (kimi, qwen)
- `ai-apis.env.example` — Template for API credentials

---

## VPS 服务器 (12zn.com)

**⚠️ 重要：必须用 `ssh vps` 连接，不要用 root 或密码！**

| 项目 | 值 |
|------|------|
| 快捷命令 | `ssh vps` |
| IP | 124.156.176.155 |
| 用户 | `ubuntu`（有 sudo 权限） |
| 登录方式 | **SSH 密钥**（已配置在本地 ~/.ssh/config） |
| 磁盘 | 40G |

**正确用法：**
```bash
# 登录
ssh vps

# 远程执行命令
ssh vps "命令"

# 查看 nginx 日志
ssh vps "tail -100 /var/log/nginx/access.log"
```

**❌ 错误用法（会失败）：**
- `ssh root@124.156.176.155` — 用户名错误，不是 root
- 用密码登录 — 只支持密钥认证

---

## Cron Scheduler

**Status:** ✅ Working

**Configuration:**
- Jobs stored in: `C:\Users\Administrator\.openclaw\cron\jobs.json`
- Timezone: Asia/Shanghai (GMT+8)
- Current jobs: 8 active tasks

**Common Operations:**
```bash
# List all jobs
openclaw cron list

# Add/update/remove jobs via tool calls
```

**Gotchas:**
- `sessionTarget="main"` requires `payload.kind="systemEvent"`
- `sessionTarget="isolated"` requires `payload.kind="agentTurn"`

---

## 图片生成（统一入口）

**Status:** ✅ ComfyUI + SDXL

**统一脚本：** `/Users/yachaolailo/projects/openclaw-backup/skills/sdxl-generator/sdxl_gen.py`

**健康检查：**
```bash
curl -s http://127.0.0.1:8000/queue > /dev/null && echo "✅ ComfyUI OK" || echo "❌ 未运行"
```

**统一参数：** SDXL 模型 | dpmpp_2m + karras | 25步 | CFG 7.5

**风格预设路由：**
| 需求 | 预设 | 调用技能 |
|------|------|---------|
| 推特配图 | `--style twitter` | fengshui-illustrator |
| 小红书配图 | `--style xiaohongshu` | xiaohongshu-visual |
| 公众号封面 | `--style gzh-cover` | wechat-visual |
| 公众号正文 | `--style wechat` | wechat-visual |
| 头像/Logo | `--style avatar` | ai-avatar-generator |

**统一输出：** `~/projects/openclaw-backup/outputs/images/`

**已废弃：** `comfyui-generate.js`（用了 SD 1.5，已替换）、`gzh-cover-generator`（已并入 wechat-visual）

---
## Browser Automation

**Status:** ✅ Working (Chrome extension connected)

**Configuration:**
- Profile: `chrome` (uses existing Chrome with extension)
- Extension relay: Toolbar icon must be ON/lit up
- Target: `host` (localhost)

### Camofox 反检测浏览器（推荐用于X/Twitter）

**启动命令：**
```bash
cd ~/projects/camofox-browser && npm start
```
- 端口：9377 (HTTP) / 18800 (CDP)
- 状态检查：`curl http://127.0.0.1:9377/status`（注意：没有/status端日，直接看是否监听）

**Common Operations:**
```
# Open URL
browser action:open targetUrl:https://x.com/... profile:chrome

# Get page snapshot
browser action:snapshot targetId:<id> compact:true

# Click/type/fill
browser action:act targetId:<id> request:{"kind":"click","ref":"e1"}
```

**Gotchas:**
- Must attach tab by clicking OpenClaw toolbar icon first
- Extension icon lit up = connected and ready
- Use `refs:"aria"` for stable element references

---

## GitHub Backup

**Status:** ✅ Working

**Configuration:**
- Repository: `github.com:Hou4007268/openclaw-backup.git`
- Auth: SSH key (`~/.ssh/id_rsa`)
- Remote: `git@github.com:Hou4007268/openclaw-backup.git`

**Common Operations:**
```bash
# Test SSH connection
ssh -T git@github.com

# Push backup
git add .
git commit -m "backup: YYYY-MM-DD"
git push origin master
```

---

## Telegram Channel

**Status:** ✅ Working

**Configuration:**
- Connected to @yiyayiyayao
- Capabilities: inlineButtons, reactions (MINIMAL mode)

**Usage:**
- Reply automatically routes to source channel
- Cross-session: use `sessions_send`

---

## QMD Search (Local MCP Server)

**Status:** ✅ Running (MCP HTTP + CLI available)

**Configuration:**
- Port: 8181 (MCP HTTP)
- Index: ~/.cache/qmd/index.sqlite (3.4 MB)
- Documents: 30 files, 49 vectors
- Path: `~/.bun/install/global/node_modules/qmd/qmd`

**CLI Commands:**
```bash
# 混合搜索（推荐）
~/.bun/install/global/node_modules/qmd/qmd query "风水内容创作"

# 关键词搜索
~/.bun/install/global/node_modules/qmd/qmd search "关键词"

# 向量搜索
~/.bun/install/global/node_modules/qmd/qmd vsearch "如何写好风水故事"

# 指定集合
~/.bun/install/global/node_modules/qmd/qmd query "用户偏好" -c workspace

# 查看状态
~/.bun/install/global/node_modules/qmd/qmd status

# 更新索引
~/.bun/install/global/node_modules/qmd/qmd update
```

**Collections:**
- `workspace` - 30 files (工作区所有内容)
- `daily-logs` - 0 files (每日工作日志)

**Index Updates:**
- Manual: `qmd update` / `qmd embed`
- Models: embeddinggemma-300M, qwen3-reranker-0.6b

---

## Writing Preferences

**Twitter Content:**
- 风格：轻松幽默，真人感，非AI味
- 结构：故事开头 → 风水知识点 → 互动结尾
- 标签：#风水 #玄学 #道长 #一宅一句 等
- 长度：短/中/长文随机分布（20%/50%/30%）

---

## What Goes Here

- Tool configurations and settings
- Credential locations (not the credentials themselves!)
- Gotchas and workarounds discovered
- Common commands and patterns
- Integration notes

## Why Separate?

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

---

## Aqua P2P Messaging

**Status:** ✅ Working (LaunchAgent 后台运行)

**Configuration:**
- **Peer ID**: `12D3KooWCs3je3Jye7d4mH2bzpAqe5BEsfLcEawyZP6cJg8boaTC`
- **昵称**: `openclaw`
- **Binary**: `~/.local/bin/aqua` (v0.0.16)
- **身份目录**: `~/.aqua/`
- **后台服务**: `com.openclaw.aqua-serve` (LaunchAgent)
- **日志**: `/tmp/aqua-serve.log`

**中继地址（分享给其他 Agent）:**
```
/dns4/aqua-relay.mistermorph.com/tcp/6372/p2p/12D3KooWSYjt4v1exWDMeN7SA4m6tDxGVNmi3cCP3zzcW2c5pN4E/p2p-circuit/p2p/12D3KooWCs3je3Jye7d4mH2bzpAqe5BEsfLcEawyZP6cJg8boaTC
```

**联系人表:**
```bash
aqua contacts list --json
```

**常用命令:**
```bash
# 发送消息
aqua send <PEER_ID> "message content"

# 查看未读消息
aqua inbox list --unread --json

# 查看收件箱
aqua inbox list --limit 20 --json

# 添加联系人
aqua contacts add "<RELAY_CIRCUIT_ADDR>" --verify

# 检查身份
aqua id --json

# 检查后台服务
pgrep -f "aqua serve"
tail -50 /tmp/aqua-serve.log

# 重启服务
launchctl kickstart -k gui/$(id -u)/com.openclaw.aqua-serve
```

**Gotchas:**
- 所有子代理共享同一个 Aqua 身份，不需要单独启动 serve
- `aqua inbox list --unread` 会自动标记消息为已读
- 使用 `--json` 输出以便程序化处理
- 首次与新 Agent 通信需要先 `aqua contacts add`

---

*Last updated: 2026-02-23*

---
## 同步规则
每次修改以下文件后，必须同步到全局：
- AGENTS.md
- SOUL.md
- USER.md
- MEMORY.md
- TOOLS.md
- IDENTITY.md

命令：
~/.bun/install/global/node_modules/qmd/qmd sync 2>/dev/null ||
cp ~/projects/openclaw-backup/{AGENTS,SOUL,USER,MEMORY,TOOLS,IDENTITY}.md ~/.openclaw/agents/main/agent/
