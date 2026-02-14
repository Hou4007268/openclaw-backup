#!/bin/bash
# auto-backup.sh - 智能自动备份系统
# 每30分钟检查一次，有重要变化时自动推送到GitHub

WORKSPACE="/Users/yachaolailo/projects/openclaw-backup"
LOG_FILE="$WORKSPACE/.backup.log"
BACKUP_MARKER="$WORKSPACE/.last-backup"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

cd "$WORKSPACE" || exit 1

# 检查git状态
if ! git status --short > /dev/null 2>&1; then
    log "${RED}Error: Not a git repository${NC}"
    exit 1
fi

# 获取变更文件列表
CHANGED_FILES=$(git status --short | awk '{print $2}')

if [ -z "$CHANGED_FILES" ]; then
    # 没有变化，静默退出
    exit 0
fi

# 重要文件列表（必须备份的）
CRITICAL_FILES=(
    "RECOVERY.md"
    "AGENTS.md"
    "SOUL.md"
    "USER.md"
    "MEMORY.md"
    "TOOLS.md"
    "HEARTBEAT.md"
)

# 重要目录（新增文件需要备份）
CRITICAL_DIRS=(
    "memory/"
    "notes/"
    "skills/"
)

# 判断是否需要备份
NEED_BACKUP=false
BACKUP_REASON=""

for file in $CHANGED_FILES; do
    # 检查是否是重要文件
    for critical in "${CRITICAL_FILES[@]}"; do
        if [[ "$file" == "$critical" ]]; then
            NEED_BACKUP=true
            BACKUP_REASON="重要文件变更: $file"
            break 2
        fi
    done
    
    # 检查是否在重要目录中
    for dir in "${CRITICAL_DIRS[@]}"; do
        if [[ "$file" == "$dir"* ]]; then
            NEED_BACKUP=true
            BACKUP_REASON="重要目录变更: $file"
            break 2
        fi
    done
    
    # 检查是否是新增的配置文件
    if [[ "$file" == *.md ]] || [[ "$file" == *.json ]] || [[ "$file" == *.env* ]]; then
        NEED_BACKUP=true
        BACKUP_REASON="配置文件变更: $file"
        break
    fi
done

if [ "$NEED_BACKUP" = false ]; then
    # 变化不重要，记录但不备份
    log "${YELLOW}忽略不重要变更: $CHANGED_FILES${NC}"
    exit 0
fi

# 执行备份
log "${GREEN}开始自动备份...${NC}"
log "备份原因: $BACKUP_REASON"

# 添加所有变更
git add -A

# 生成提交信息
COMMIT_MSG="auto-backup: $(date '+%Y-%m-%d %H:%M')

变更内容:
$(git status --short | head -20)

触发原因: $BACKUP_REASON"

# 提交
git commit -m "$COMMIT_MSG" >> "$LOG_FILE" 2>&1

if [ $? -ne 0 ]; then
    log "${RED}提交失败${NC}"
    exit 1
fi

# 推送
git push origin master >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
    log "${GREEN}✅ 备份成功: $(git rev-parse --short HEAD)${NC}"
    date '+%Y-%m-%d %H:%M:%S' > "$BACKUP_MARKER"
else
    log "${RED}❌ 推送失败${NC}"
    exit 1
fi

exit 0
