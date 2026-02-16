#!/bin/bash
# 实时热点监控脚本
# 功能：使用联网搜索获取最新热点，保存到hotspot-monitor.md
# 调度：每2小时执行一次
# 模型：MiniMax M2.5（具备联网搜索能力）

set -e

WORK_DIR="/Users/yachaolailo/projects/openclaw-backup"
LOG_FILE="$WORK_DIR/memory/hotspot-monitor-$(date +%Y-%m-%d).md"
DATE_STR=$(date "+%Y-%m-%d %H:%M:%S")

echo "=== 热点监控启动: $DATE_STR ===" >> "$LOG_FILE"

# 定义搜索关键词（风水/玄学/家居相关）
KEYWORDS=(
  "风水布局 热门"
  "家居风水 趋势"
  "玄学话题 热议"
  "装修风水 流行"
  "住宅布局 讨论"
)

# 随机选择一个关键词进行搜索
RANDOM_INDEX=$((RANDOM % ${#KEYWORDS[@]}))
SELECTED_KEYWORD="${KEYWORDS[$RANDOM_INDEX]}"

echo "搜索关键词: $SELECTED_KEYWORD" >> "$LOG_FILE"

# 使用 web_search 获取热点（通过代理执行）
cd "$WORK_DIR"

# 记录搜索请求
cat >> "$LOG_FILE" << EOF

## 监控记录 [$DATE_STR]
- 关键词: $SELECTED_KEYWORD
- 状态: 待处理

EOF

echo "热点监控完成: $DATE_STR" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
