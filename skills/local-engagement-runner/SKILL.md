---
name: local-engagement-runner
description: 本地互动运行技能 - 不依赖AI生成，基于规则快速响应
---

# 本地互动运行技能

> 基于规则和模板的快速响应系统，无需调用AI模型，0 token消耗

---

## 核心设计原则

**为什么不依赖AI？**
- 80%的评论回复可以用模板解决
- 简单规则匹配比AI生成快10倍
- 0 token消耗，成本极低
- 适合高频重复任务

---

## 评论分类规则（本地运行）

### 分类器（关键词匹配）

```javascript
// 分类逻辑 - 纯本地运行，0 token
function classifyComment(comment) {
  const patterns = {
    question: /问|请教|怎么|如何|为什么|吗\?|呢\?/,
    agreement: /对|确实|同意|没错|学习了|受教/,
    thanks: /谢谢|感谢|有用|收藏|码住/,
    story: /我家|我单位|我朋友|我亲戚|之前|上次/,
    challenge: /不信|迷信|假的|忽悠|骗/,
    emoji: /^[👍🙏😂🤣😊😉]+$/
  };
  
  for (const [type, regex] of Object.entries(patterns)) {
    if (regex.test(comment)) return type;
  }
  return 'other';
}
```

### 模板回复库

```javascript
const templates = {
  question: [
    "具体问题具体分析，私信发户型图看看？🏠",
    "之前帮客户处理过，私信详聊～",
    "这个要看具体朝向和布局，简单说就是避开直冲👆"
  ],
  
  agreement: [
    "确实！很多人都是这样调整后改善的👍",
    "学到了就对了，实践出真知✨",
    "认同！风水其实就是环境心理学"
  ],
  
  thanks: [
    "有用就好，收藏了记得实践😊",
    "不客气，有问题随时问",
    "感谢支持，持续分享干货💪"
  ],
  
  story: [
    "这种情况很常见，私信聊聊怎么化解",
    "看来你也有经验，可以互相交流",
    "风水这事儿，见过太多类似案例了"
  ],
  
  challenge: [
    "信则有不信则无，实践是检验真理的唯一标准😊",
    "可以理解，不强迫，只帮助需要的人",
    "科学解释不了的不代表不存在，保持开放心态"
  ],
  
  emoji: ["👍", "🙏", "✨"],
  
  other: [
    "感谢评论🙏",
    "有问题随时交流",
    "欢迎继续关注"
  ]
};

// 随机选择模板
function getReply(type) {
  const pool = templates[type] || templates.other;
  return pool[Math.floor(Math.random() * pool.length)];
}
```

---

## 主动外联策略（本地筛选）

### 目标账号筛选规则

```javascript
// 本地筛选，无需AI
const targetKeywords = [
  '装修', '卧室', '客厅', '搬家', '租房',
  '失眠', '睡眠', '焦虑', '压力',
  '办公室', '工位', '升职', '事业',
  '买房', '看房', '户型', '朝向'
];

const excludeKeywords = [
  '风水', '命理', '八字', '星座', '塔罗',
  '占卜', '算命', '大师', '道长'
];

function shouldEngage(tweet) {
  const hasTarget = targetKeywords.some(k => tweet.includes(k));
  const hasExclude = excludeKeywords.some(k => tweet.includes(k));
  return hasTarget && !hasExclude;
}
```

### 外联评论模板

```javascript
const outreachTemplates = {
  装修: ["卧室布局注意床头别对门，之前客户这样调整后睡眠好了很多", 
         "装修前看看朝向，有些布局后期很难改"],
  
  失眠: ["除了看医生，也看看卧室布局，镜子别对床", 
         "床头靠实墙，心理上更有安全感"],
  
  办公室: ["工位背靠墙比背靠走道好，这是有心理学依据的",
           "桌面别堆太多杂物，影响专注力"],
  
  买房: ["看房时注意采光和通风，比户型图更重要",
         "朝向影响挺大的，北向冬天确实冷"]
};

function getOutreachReply(topic) {
  const templates = outreachTemplates[topic] || ["有道理，学习了👍"];
  return templates[Math.floor(Math.random() * templates.length)];
}
```

---

## 运行方式

### 方案A：纯脚本（推荐）

```bash
# 每小时运行一次，纯本地
cd ~/projects/openclaw-backup
./scripts/local-engagement.sh
```

**脚本内容：**
```bash
#!/bin/bash
# local-engagement.sh - 本地互动，0 token

# 1. 获取最新推文
# 2. 本地规则分类评论
# 3. 模板匹配回复
# 4. 记录日志

# 使用本地JSON文件存储模板
# 使用简单grep/awk进行关键词匹配
# 使用curl直接调用Twitter API回复
```

### 方案B：低频率AI辅助

```bash
# 只在需要时调用AI
# 复杂问题 -> 调用AI生成
# 简单问题 -> 本地模板

if [complexity_score > 0.7]; then
  openclaw agent --model qwen-turbo  # 便宜模型
else
  local_template_reply  # 0成本
fi
```

---

## 成本对比

| 方案 | 日Token消耗 | 日成本 | 适用场景 |
|------|------------|--------|---------|
| 纯AI生成 | ~2M | ¥42 | 高质量要求 |
| **本地模板** | **~0** | **¥0** | **高频重复任务** |
| AI+本地混合 | ~200K | ¥4.2 | 平衡方案 |

**建议：**
- 80%简单回复 -> 本地模板（0成本）
- 20%复杂问题 -> 轻量AI（低成本）

---

## 实施步骤

1. **创建模板库**（一次性工作）
   - 分析历史评论，提炼常见类型
   - 为每类写10-20条模板
   - 存储为本地JSON

2. **编写分类器**
   - 关键词正则匹配
   - 简单规则引擎
   - 无需机器学习

3. **设置定时任务**
   - 每小时运行一次脚本
   - 纯本地执行
   - 记录运行日志

4. **人工审核（可选）**
   - 复杂问题标记待审
   - 你确认后再发送
   - 学习优化模板

---

## 预期效果

**成本节省：** 90%+（从¥45/天降至¥0-5/天）
**响应速度：** 提升10倍（本地毫秒级）
**覆盖能力：** 80%评论可自动处理

---

*Version: 1.0*
*Purpose: Minimize token consumption via local rule-based system*
