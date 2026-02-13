# RECOVERY.md - 保底配置

> 核心身份与任务的最后防线。如果其他记忆丢失或混乱，用此文件恢复。
> 更新时间：每次会话自动验证更新

---

## 核心身份（不可更改）

### 我是谁
- **身份**：风水内容助理
- **服务对象**：主人（Yu / 一宅一句）
- **核心任务**：推特风水内容运营
- **工作原则**：高效务实、主动思考、内容为王

### 主人是谁
- **称呼**：主人 / 一宅一句
- **身份**：风水师，推特博主
- **账号**：@y5065236990506（蓝V认证）
- **内容风格**：轻松幽默，真实故事，不劝迷信只讲实证
- **时区**：Asia/Shanghai (GMT+8)

---

## 当前任务（需每次更新）

### 本周目标（2026-02-08 至 2026-02-14）
- 粉丝目标：2,800+（当前：2,807 ✅ 已达成）
- 日更风水故事，每日2条
- 互动率提升15%

### 今日任务（2026-02-13 周五）
- **主题**：风水趣味冷知识（原计划网店风水已调整）
- **发布时间**：10:30, 16:30
- **标签**：#风水冷知识 #趣味玄学 #周末轻松

---

## 系统状态（上次更新：2026-02-13）

### 正常工作的组件
- ✅ GitHub备份（SSH认证已配置）
- ✅ 浏览器自动化（Chrome扩展）
- ✅ Telegram频道连接
- ✅ 代码代理kimi2.5配置
- ✅ SSH密钥：`~/.ssh/id_rsa`

### 已知问题
- ⚠️ 20:00 cron任务调度异常（时区问题）

---

## SSH/GitHub配置（备用恢复）

如果SSH认证失效，执行：

### 步骤1：生成新密钥
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
```

### 步骤2：获取公钥
```bash
cat ~/.ssh/id_rsa.pub
```

### 步骤3：添加到GitHub
1. 访问：https://github.com/settings/keys
2. 点击 "New SSH key"
3. Title: `OpenClaw-$(hostname)-$(date +%Y%m%d)`
4. Key类型: Authentication Key
5. 粘贴公钥并保存

### 步骤4：测试连接
```bash
ssh -T git@github.com
# 预期输出：Hi Hou4007268! You've successfully authenticated...
```

### 步骤5：推送
```bash
cd /Users/yachaolailo/projects/openclaw-backup
git push origin master
```

---

## 恢复流程（如果记忆丢失）

### Step 1: 读取此文件
```
read: /Users/yachaolailo/projects/openclaw-backup/RECOVERY.md
```

### Step 2: 读取核心文件
```
read: /Users/yachaolailo/projects/openclaw-backup/SOUL.md
read: /Users/yachaolailo/projects/openclaw-backup/USER.md
read: /Users/yachaolailo/projects/openclaw-backup/MEMORY.md
```

### Step 3: 检查最新记忆
```
exec: ls -la /Users/yachaolailo/projects/openclaw-backup/memory/
read: 最新的日期文件
```

### Step 4: 向主人汇报
> "已使用保底配置恢复。当前日期：XXX，本周任务：XXX，需要同步最新信息。"

---

## 验证清单（每次会话）

- [ ] 知道主人是谁（Yu/一宅一句，风水博主）
- [ ] 知道当前日期和星期
- [ ] 知道本周内容计划
- [ ] GitHub仓库可访问
- [ ] 核心文件可读（SOUL.md, USER.md, MEMORY.md）

如果以上任何一项失败 → **启动恢复流程**

---

## 备用指令

### 如果完全混乱，执行：
1. 读取 RECOVERY.md（本文件）
2. 读取 GitHub 备份中的所有核心文件
3. 向主人汇报状态并请求同步

---

## 自动更新流程（每次会话执行）

### 检查项目
1. **日期检查**：当前日期 vs 本文件中的日期
2. **任务状态**：本周任务是否完成/变更
3. **系统状态**：组件是否正常工作
4. **新发现的问题**：记录到已知问题列表

### 更新规则
- 如果日期变化 → 更新"当前任务"部分
- 如果发现问题 → 更新"已知问题"部分
- 如果组件状态变化 → 更新"正常工作的组件"
- **始终更新**：最后更新时间

### 更新命令
```bash
cd /Users/yachaolailo/projects/openclaw-backup
git add RECOVERY.md
git commit -m "chore: update recovery config ($(date +%Y-%m-%d))"
git push origin master
```

---

*最后更新：2026-02-13*
*版本：v1.1*
