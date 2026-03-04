#!/bin/bash

# 清理过期session的脚本
echo "清理过期session..."

# 获取当前session数量
SESSION_COUNT=$(openclaw sessions | wc -l)
echo "当前session数量: $SESSION_COUNT"

# 如果超过100个，清理最旧的
if [ $SESSION_COUNT -gt 100 ]; then
    echo "Session数量超过100，开始清理..."
    # 这里可以添加具体的清理逻辑
    # 暂时只显示警告
    echo "警告：需要手动清理session"
else
    echo "Session数量正常 (<100)"
fi

# 清理临时文件
echo "清理临时文件..."
find /tmp -name "openclaw-*" -type d -mtime +1 -exec rm -rf {} \; 2>/dev/null || true
find /tmp -name "*.openclaw" -type f -mtime +1 -delete 2>/dev/null || true

echo "清理完成"