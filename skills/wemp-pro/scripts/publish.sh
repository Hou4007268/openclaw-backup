#!/bin/bash
# WEMP-PRO 发布脚本
# 用法: bash scripts/publish.sh <action> [options]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

show_usage() {
    cat << EOF
用法: bash publish.sh <action> [options]

动作:
  draft            上传到草稿箱
  publish          直接发布
  convert          转换为微信HTML
  
选项:
  --file           Markdown文件
  --title          文章标题
  --cover          封面图片
  --digest         摘要 (默认取前120字)

示例:
  bash publish.sh draft article.md --cover cover.jpg
  bash publish.sh convert article.md --preview

EOF
}

# 转换为微信HTML
convert_html() {
    local file=""
    local preview=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --file)
                file="$2"
                shift 2
                ;;
            --preview)
                preview=true
                shift
                ;;
            *)
                shift
                ;;
        esac
    done
    
    if [[ -z "$file" ]]; then
        log_error "请提供 Markdown 文件 --file"
        exit 1
    fi
    
    log_info "转换 HTML: $file"
    
    # 调用 md2wechat-skill 的转换能力
    # TODO: 集成 md2wechat API
    log_warn "HTML 转换功能待集成 md2wechat"
    
    local output="${file%.md}.html"
    echo "{
      \"html_file\": \"$output\",
      \"images_count\": 5,
      \"preview_url\": \"http://example.com/preview\"
    }"
}

# 上传到草稿箱
upload_draft() {
    local file=""
    local title=""
    local cover=""
    local digest=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --file)
                file="$2"
                shift 2
                ;;
            --title)
                title="$2"
                shift 2
                ;;
            --cover)
                cover="$2"
                shift 2
                ;;
            --digest)
                digest="$2"
                shift 2
                ;;
            *)
                shift
                ;;
        esac
    done
    
    if [[ -z "$file" ]]; then
        log_error "请提供 Markdown 文件 --file"
        exit 1
    fi
    
    log_info "上传到草稿箱: $file"
    
    # TODO: 集成 wemp-operator 的发布能力 (微信API)
    # TODO: 先调用 convert_html
    
    log_warn "发布功能待集成 (需配置微信AppID)"
    
    echo "{
      \"media_id\": \"xxx\",
      \"url\": \"https://mp.weixin.qq.com/cgi-bin/draft?action=edit&draft_id=xxx\"
    }"
}

# 直接发布
publish_article() {
    local file=""
    local title=""
    local cover=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --file)
                file="$2"
                shift 2
                ;;
            --title)
                title="$2"
                shift 2
                ;;
            --cover)
                cover="$2"
                shift 2
                ;;
            *)
                shift
                ;;
        esac
    done
    
    if [[ -z "$file" ]]; then
        log_error "请提供 Markdown 文件 --file"
        exit 1
    fi
    
    log_info "发布文章: $file"
    
    # TODO: 集成 wemp-operator 的发布能力
    log_warn "发布功能待集成"
    
    echo "{
      \"msg_id\": \"xxx\",
      \"url\": \"https://mp.weixin.qq.com/s/xxx\"
    }"
}

# 主入口
main() {
    local action="${1:-}"
    
    case "$action" in
        draft)
            shift
            upload_draft "$@"
            ;;
        publish)
            shift
            publish_article "$@"
            ;;
        convert)
            shift
            convert_html "$@"
            ;;
        -h|--help|help)
            show_usage
            ;;
        *)
            log_error "未知动作: $action"
            show_usage
            exit 1
            ;;
    esac
}

main "$@"
