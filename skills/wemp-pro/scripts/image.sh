#!/bin/bash
# WEMP-PRO 配图生成脚本
# 用法: bash scripts/image.sh <action> [options]

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
用法: bash image.sh <action> [options]

动作:
  cover            生成封面图片
  generate         生成正文配图
  
选项 (cover):
  --title          文章标题
  --style          风格 (简约/复古/赛博朋克/水墨/摄影)
  --output         输出文件
  
选项 (generate):
  --prompt         图片描述
  --output         输出文件

示例:
  bash image.sh cover "如何提升工作效率" --style 简约
  bash image.sh generate "一只可爱的小猫" --output cat.png

EOF
}

# 生成封面
generate_cover() {
    local title=""
    local style="简约"
    local output="cover.jpg"
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --title)
                title="$2"
                shift 2
                ;;
            --style)
                style="$2"
                shift 2
                ;;
            --output)
                output="$2"
                shift 2
                ;;
            *)
                shift
                ;;
        esac
    done
    
    if [[ -z "$title" ]]; then
        log_error "请提供文章标题 --title"
        exit 1
    fi
    
    log_info "生成封面: title=$title, style=$style"
    
    # 集成 sdxl-generator 生成封面
    # 风格映射到英文提示词
    local style_prompt=""
    case "$style" in
        简约)
            style_prompt="minimalist style, clean design, white background"
            ;;
        复古)
            style_prompt="vintage style, retro colors, classic feel"
            ;;
        赛博朋克)
            style_prompt="cyberpunk style, neon lights, futuristic"
            ;;
        水墨)
            style_prompt="Chinese ink painting style, traditional art"
            ;;
        摄影)
            style_prompt="professional photography, high quality, realistic"
            ;;
        *)
            style_prompt="modern style, clean and professional"
            ;;
    esac
    
    local full_prompt="$title, $style_prompt"
    
    # 调用 sdxl-generator
    SDXL_SCRIPT="/Users/yachaolailo/projects/openclaw-backup/skills/sdxl-generator/sdxl_gen.py"
    
    if [[ -f "$SDXL_SCRIPT" ]]; then
        log_info "调用 SDXL 生成封面..."
        python3 "$SDXL_SCRIPT" "$full_prompt" --style gzh-cover --output "$output" 2>/dev/null || {
            log_warn "SDXL 生成失败，使用占位符"
            echo "{
              \"image_url\": \"\",
              \"local_path\": \"$output\",
              \"status\": \"placeholder\"
            }"
        }
    else
        log_warn "SDXL 脚本未找到: $SDXL_SCRIPT"
        echo "{
          \"image_url\": \"\",
          \"local_path\": \"$output\",
          \"status\": \"skipped\"
        }"
    fi
}

# 生成配图
generate_image() {
    local prompt=""
    local output="image.jpg"
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --prompt)
                prompt="$2"
                shift 2
                ;;
            --output)
                output="$2"
                shift 2
                ;;
            *)
                shift
                ;;
        esac
    done
    
    if [[ -z "$prompt" ]]; then
        log_error "请提供图片描述 --prompt"
        exit 1
    fi
    
    log_info "生成配图: prompt=$prompt"
    
    # 调用 sdxl-generator
    SDXL_SCRIPT="/Users/yachaolailo/projects/openclaw-backup/skills/sdxl-generator/sdxl_gen.py"
    
    if [[ -f "$SDXL_SCRIPT" ]]; then
        log_info "调用 SDXL 生成配图..."
        python3 "$SDXL_SCRIPT" "$prompt" --style wechat --output "$output" 2>/dev/null || {
            log_warn "SDXL 生成失败，使用占位符"
            echo "{
              \"image_url\": \"\",
              \"local_path\": \"$output\",
              \"status\": \"placeholder\"
            }"
        }
    else
        log_warn "SDXL 脚本未找到"
        echo "{
          \"image_url\": \"\",
          \"local_path\": \"$output\",
          \"status\": \"skipped\"
        }"
    fi
}

# 主入口
main() {
    local action="${1:-}"
    
    case "$action" in
        cover)
            shift
            generate_cover "$@"
            ;;
        generate)
            shift
            generate_image "$@"
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
