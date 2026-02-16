#!/bin/bash
# generate-daily-report.sh - 生成每日Token消耗报告

REPORT_DATE=$(date '+%Y-%m-%d')
REPORT_TIME=$(date '+%H:%M')
REPORT_FILE="/Users/yachaolailo/projects/openclaw-backup/reports/daily-token-report-${REPORT_DATE}.md"

# 确保目录存在
mkdir -p /Users/yachaolailo/projects/openclaw-backup/reports

# 价格配置（人民币）
PRICE_INPUT_NO_CACHE=0.0000042
PRICE_INPUT_CACHE=0.0000007
PRICE_OUTPUT=0.000021

# 获取今日会话数据
# 注意：这里需要从OpenClaw获取实际数据，暂时使用示例
cat > "$REPORT_FILE" << EOF
# Token 消耗日报

**报告日期：** ${REPORT_DATE}  
**生成时间：** ${REPORT_TIME}  
**模型：** moonshot/kimi-k2.5

---

## 今日消耗

| 项目 | Token数 | 单价 (CNY) | 小计 (CNY) |
|------|---------|-----------|-----------|
| 输入 (缓存未命中) | [待获取] | ¥0.0000042 | [待计算] |
| 输入 (缓存命中) | [待获取] | ¥0.0000007 | [待计算] |
| 输出 | [待获取] | ¥0.000021 | [待计算] |
| **总计** | - | - | **[待计算]** |

## 价格参考

- 输入 Token（缓存未命中）：¥0.0000042 / token
- 输入 Token（缓存命中）：¥0.0000007 / token
- 输出 Token：¥0.000021 / token

## 成本对比

| 量级 | 输入成本（缓存未命中） | 输出成本 |
|------|---------------------|---------|
| 1K tokens | ¥0.0042 | ¥0.021 |
| 10K tokens | ¥0.042 | ¥0.21 |
| 100K tokens | ¥0.42 | ¥2.10 |
| 1M tokens | ¥4.20 | ¥21.00 |

---

*报告由 OpenClaw 自动生成*
*价格配置：config/token-pricing.md*
EOF

echo "报告已生成: $REPORT_FILE"
