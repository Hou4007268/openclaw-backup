---
title: "Cron 调度纪律"
date: 2026-02-13
category: lessons
priority: 🔴
status: active
last_verified: 2026-02-26
tags: [cron, automation, reliability]
---

## 核心原则

1. **轻量优先**：Cron任务应该轻量，避免占用太多资源
2. **幂等性**：任务可以重复执行，不会产生副作用
3. **失败处理**：任务失败时要有明确的日志记录

## 优化记录

### 2026-02-19 Cron优化
- **问题**：Token消耗过高，~2.6M/天，费用~¥96/月
- **优化**：
  - 内容A/B测试：24次→4次/天
  - 内容发布：16次→2次/天
  - X提及扫描：24次→8次/天
- **结果**：Token消耗降至~950K/天，费用~¥34/月
