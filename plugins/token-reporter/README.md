# Token Reporter Plugin

每日Token消耗报告插件 - 自动统计OpenClaw的AI使用量

## 功能

- 统计所有Agent的Token消耗
- 按Agent分类显示使用量
- 计算API调用次数
- 支持定时任务自动生成报告

## 安装

```bash
# 克隆仓库
cd /path/to/openclaw-backup/plugins

# 测试运行
node token-reporter.js --report
```

## 使用方法

### 命令行

```bash
# 生成完整报告
node token-reporter.js --report

# 简洁状态
node token-reporter.js --status

# JSON格式输出
node token-reporter.js --json

# 帮助
node token-reporter.js --help
```

### 定时任务

编辑crontab添加定时任务:

```bash
crontab -e

# 每天 08:00 自动生成报告
0 8 * * * cd /path/to/openclaw-backup/plugins/token-reporter && node token-reporter.js --report >> /tmp/token-report.log 2>&1
```

## 输出示例

```
📊 Token消耗报告

🕒 生成时间: 2026/2/17 23:35:25

📁 Agent使用情况:

| Agent | Input | Output | Cache | Total |
|-------|-------|--------|-------|-------|
| main   | 204.08M | 1.30M   | 277.35M | 205.38M |

📈 总计:

  Input:     204.08M tokens
  Output:    1.30M tokens
  Cache R:   232.92M tokens
  Cache W:   44.43M tokens
  ─────────────────
  Total:     205.38M tokens
  Cost:      $0.0000

🔗 API调用统计:

  总调用次数: 115
  - minimax: 2 次
  - minimax-portal: 113 次
```

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| OPENCLAW_DIR | ~/.openclaw | OpenClaw状态目录 |

## 技术细节

- 解析 `~/.openclaw/agents/*/sessions/*.jsonl` 获取Token使用量
- 解析 `~/.openclaw/logs/gateway.log` 获取API调用统计
- 支持的AI提供商: MiniMax, Kimi, DeepSeek, Gemini

## License

MIT
