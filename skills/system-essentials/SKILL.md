---
name: system-essentials
description: 系统核心配置与用户永久偏好 - 必须始终遵守的运作规则
---

# System Essentials - 核心系统配置

> 本文件包含系统运作的核心配置与用户永久偏好
> 每次会话启动时必须加载，不得遗忘

---

## 一、用户身份与偏好（永不变）

### 用户身份
- **称呼：** 主人 / 一宅一句
- **身份：** 风水博主，推特账号 @一宅一句
- **时区：** Asia/Shanghai (GMT+8)
- **语言：** 中文（优先使用中文回复，英文需翻译）

### 核心偏好
1. **备份方式：** 手动备份（已禁用自动备份cron）
   - 命令：`cd ~/projects/openclaw-backup && ./scripts/auto-backup.sh`
   - 用户自行决定何时备份

2. **记忆检索：** 强制使用qmd搜索
   - 禁止直接全文读取MEMORY.md或memory/*.md
   - 先用 `qmd query "关键词"` 搜索
   - 再用 `qmd get <file>:<line> -l 20` 获取片段
   - 仅当qmd无结果时才读取文件

3. **写入后必做：** 每次写入记忆文件后必须执行
   ```bash
   qmd update && qmd embed
   ```

4. **沟通方式：** 
   - 高效务实，直奔主题
   - 中文回复，避免英文（除非用户要求）
   - 重要操作后询问"还有什么需要处理的？"

---

## 二、三层记忆系统（已配置）

### Layer 1: Daily Memory Sync
- **时间：** 每天 23:00
- **任务ID：** `c4a011f6-92ad-4c64-8cae-2e95cc2e5c55`
- **功能：** 
  - 调用sessions_list获取当日所有会话
  - 用sessions_history读取完整对话
  - 蒸馏成结构化日志写入memory/YYYY-MM-DD.md
  - 运行 `qmd update && qmd embed`

### Layer 2: Weekly Memory Compound
- **时间：** 每周日 22:00
- **任务ID：** `b870eb4d-b6fe-4716-9fee-63bd70678c59`
- **功能：**
  - 读取本周全部7个日志文件
  - 更新MEMORY.md，提取新偏好、决策模式、项目状态
  - 剪枝删除过时信息
  - 运行 `qmd update && qmd embed`

### Layer 3: Hourly Micro-Sync
- **时间：** 每天 10/13/16/19/22点
- **任务ID：** `aa432514-e009-45fc-a61c-64cb69fbf8fd`
- **功能：**
  - 检查最近3小时是否有有意义活动
  - 如有，append简要摘要到当日日志
  - 运行 `qmd update && qmd embed`
  - 如无活动，静默退出

### Token Cost Report
- **时间：** 每天 23:00
- **任务ID：** `4bd4d09f-d1ca-4119-9065-7b1edec30468`
- **功能：** 生成并发送每日Token消耗报告

---

## 三、关键配置信息

### GitHub备份
- **仓库：** `github.com:Hou4007268/openclaw-backup`
- **认证：** SSH key (`~/.ssh/id_rsa`)
- **工作区：** `/Users/yachaolailo/projects/openclaw-backup`

### qmd搜索系统
- **端口：** 8181
- **索引：** `~/.cache/qmd/index.sqlite`
- **状态：** 30 files, 49 vectors
- **命令路径：** `~/.bun/install/global/node_modules/qmd/qmd`

### API状态
| API | 状态 | 用途 |
|-----|------|------|
| Moonshot/Kimi | ✅ | 主模型 |
| qmd (本地) | ✅ | 语义搜索 |
| NVIDIA API | ❌ | 不可用（只读权限） |

### Token定价（Kimi K2.5）
- 输入（缓存未命中）：¥0.0000042/token
- 输入（缓存命中）：¥0.0000007/token
- 输出：¥0.000021/token
- 1K输出 ≈ ¥0.02，1M输出 ≈ ¥21

---

## 四、已创建的技能

### 1. fengshui-content（风水内容创作）
- **位置：** `skills/fengshui-content/SKILL.md`
- **用途：** 推特文案生成
- **包含：** 4种模板、标签策略、8分钟创作流程

### 2. qmd（本地搜索）
- **位置：** `skills/qmd/SKILL.md`
- **用途：** 语义搜索与索引管理
- **包含：** 所有qmd命令与故障排除

### 3. system-essentials（本文件）
- **位置：** `skills/system-essentials/SKILL.md`
- **用途：** 系统核心配置
- **包含：** 用户偏好、定时任务、关键配置

---

## 五、文件结构标准

```
workspace/
├── MEMORY.md              # 主记忆（每次会话注入）
├── AGENTS.md              # 行为规则（强制qmd搜索）
├── RECOVERY.md            # 保底配置（记忆丢失时恢复）
├── SOUL.md                # 人格定义
├── USER.md                # 用户信息
├── TOOLS.md               # 工具配置
├── HEARTBEAT.md           # 心跳任务
├── skills/                # 技能目录
│   ├── fengshui-content/
│   ├── qmd/
│   └── system-essentials/
├── memory/                # 每日日志
│   └── YYYY-MM-DD.md
├── scripts/               # 工具脚本
│   ├── auto-backup.sh
│   └── generate-daily-report.sh
└── config/                # 配置
    └── token-pricing.md
```

---

## 六、重要规则（来自AGENTS.md）

### 记忆检索（强制）
```
Never read MEMORY.md or memory/*.md in full for lookups. Use qmd:
1. qmd query "<question>" — combined search with reranking
2. qmd get <file>:<line> -l 20 — pull only the snippet you need
3. Only if qmd returns nothing: fall back to reading files
```

### 写入后必做
```bash
qmd update && qmd embed
```

### 会话启动检查
1. 读取 RECOVERY.md
2. 验证核心身份（主人是谁、日期、本周任务）
3. 如有变化，更新RECOVERY.md

---

## 七、待办与提醒

### 当前暂停的任务
- ⏸️ SOUL.md人格升级（等待用户输入偏好细节）
- ⏸️ HEARTBEAT.md定制（等待决定）
- ⏸️ 今日推特内容（"风水趣味冷知识"已过原定时间16:30）

### 系统监控
- 首次Daily Memory Sync：今晚23:00
- 首次Hourly Micro-Sync：今天19:00
- 首次Weekly Compound：2月16日（周日）22:00

---

## 八、关键洞察（必须记住）

1. **记忆基础设施 > 模型智能** - 完善的记忆系统比强大的模型更有用
2. **手动控制优先** - 用户偏好手动备份，尊重其控制欲
3. **中文沟通** - 用户多次表示看不懂英文，必须中文回复
4. **搜索优先** - 强制qmd搜索，禁止全文盲读
5. **索引新鲜** - 每次写入后必须更新qmd索引

---

*Version: 1.0*  
*Created: 2026-02-13*  
*Critical: Yes - Must load on every session start*
