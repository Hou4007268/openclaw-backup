# TOOLS.md - Tool Configuration & Notes

> Document tool-specific configurations, gotchas, and credentials here.

---

## Credentials Location

All credentials stored in `.credentials/` (gitignored):
- `ai-apis.env` — AI API tokens (kimi, qwen)
- `ai-apis.env.example` — Template for API credentials

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

## Browser Automation

**Status:** ✅ Working (Chrome extension connected)

**Configuration:**
- Profile: `chrome` (uses existing Chrome with extension)
- Extension relay: Toolbar icon must be ON/lit up
- Target: `host` (localhost)

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

*Last updated: 2026-02-08*
