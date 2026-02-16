---
name: hierarchical-model-system
description: 分级模型系统 - Kimi大脑规划，Qwen子代理执行
---

# 分级模型系统 (Hierarchical Model System)

> Kimi K2.5 作为大脑负责规划决策
> Qwen 作为子代理负责执行落地
> 大幅降低token消耗，保持输出质量

---

## 架构设计

```
┌─────────────────────────────────────┐
│         大脑层 (Brain)               │
│     Kimi K2.5 - 战略规划             │
│  - 复杂决策                           │
│  - 内容规划                           │
│  - 质量审核                           │
│  - 异常处理                           │
└─────────────┬───────────────────────┘
              │ 下发任务
              ▼
┌─────────────────────────────────────┐
│        执行层 (Executor)             │
│      Qwen - 具体执行                 │
│  - 文案撰写                           │
│  - 信息搜集                           │
│  - 格式整理                           │
│  - 简单回复                           │
└─────────────────────────────────────┘
```

---

## 任务分级标准

### 大脑层任务 (Kimi K2.5)

| 任务类型 | 示例 | 原因 |
|---------|------|------|
| **战略规划** | 制定3个月增长计划 | 需要全局视野 |
| **复杂创作** | 创作系列内容大纲 | 需要创意和逻辑 |
| **质量审核** | 审核Qwen生成的内容 | 需要判断质量 |
| **异常决策** | 账号被封/负面舆情处理 | 需要经验判断 |
| **重要回复** | 大客户/复杂问题回复 | 需要专业度 |

### 执行层任务 (Qwen)

| 任务类型 | 示例 | 成本节省 |
|---------|------|---------|
| **文案撰写** | 根据大纲写具体推文 | 80% |
| **信息整理** | 整理搜索结果 | 90% |
| **模板填充** | 填充固定格式内容 | 95% |
| **简单回复** | 标准问题回复 | 90% |
| **数据收集** | 收集竞品信息 | 85% |
| **格式转换** | Markdown转其他格式 | 95% |

---

## 实施流程示例

### 场景：创作一篇推文

**传统方式（纯Kimi）：**
```
Kimi: 选题 → 构思 → 撰写 → 润色 → 输出
Token: 15K
成本: ¥0.315
```

**分级方式（Kimi+Qwen）：**
```
Kimi (大脑): 选题 + 给出大纲框架
Token: 3K → ¥0.063

Qwen (执行): 根据大纲撰写具体内容
Token: 5K → ¥0.015 (Qwen便宜70%)

Kimi (审核): 快速审核修改
Token: 1K → ¥0.021

总计: 9K → ¥0.099 (节省68%)
```

---

## OpenClaw配置

### 大脑代理配置

```json
{
  "name": "brain-agent",
  "model": "moonshot/kimi-k2.5",
  "role": "strategic",
  "tasks": [
    "planning",
    "decision",
    "review",
    "exception"
  ]
}
```

### 执行代理配置

```json
{
  "name": "executor-agent",
  "model": "qwen/qwen-turbo",
  "role": "execution",
  "tasks": [
    "writing",
    "research",
    "formatting",
    "simple_reply"
  ]
}
```

### 任务分配器

```javascript
function routeTask(task) {
  if (task.complexity > 0.7 || task.importance === 'high') {
    return 'brain-agent';  // Kimi
  } else {
    return 'executor-agent';  // Qwen
  }
}
```

---

## 成本对比

| 场景 | 纯Kimi | 分级系统 | 节省 |
|------|--------|---------|------|
| 单篇推文 | ¥0.32 | ¥0.10 | **69%** |
| 日常回复 | ¥0.08 | ¥0.02 | **75%** |
| 内容规划 | ¥0.50 | ¥0.18 | **64%** |
| 竞品分析 | ¥0.40 | ¥0.12 | **70%** |
| **月均** | **¥200** | **¥66** | **67%** |

---

## 实施步骤

### Step 1: 修改默认配置

```bash
# 默认执行代理改为Qwen
export DEFAULT_EXECUTOR="qwen/qwen-turbo"
export STRATEGIC_BRAIN="moonshot/kimi-k2.5"
```

### Step 2: 任务自动分级

```javascript
// 在每次任务前自动判断
if (task.requiresCreativity || task.isCritical) {
  useModel(STRATEGIC_BRAIN);
} else {
  useModel(DEFAULT_EXECUTOR);
}
```

### Step 3: 质量监控

```bash
# 随机抽查Qwen输出，用Kimi审核
# 比例：每10个Qwen任务，Kimi审核1个
```

---

## 注意事项

### ⚠️ 不要用Qwen的场景
- 首次给新客户回复
- 涉及金钱/法律的内容
- 账号安全相关操作
- 复杂风水问题解答

### ✅ 适合Qwen的场景
- 模板化内容填充
- 信息整理归类
- 标准FAQ回复
- 数据格式化

---

## 预期效果

**Token消耗：** 降低 60-70%  
**输出质量：** 保持 90%+  
**响应速度：** 提升 30%（Qwen更快）  
**系统稳定性：** 提升（分级容错）

---

*Version: 1.0*  
*Architecture: Brain-Executor Hierarchical System*  
*Goal: Minimize cost, maintain quality*
