---
name: wemp-pro
description: |
  微信自媒体专业运营套件 (WeChat Media Pro)
  
  ## 用于
  - 微信公众号/视频号内容运营
  - AI辅助写作、配图、数据分析
  - 自动化采集、发布、互动管理
  
  ## 整合能力
  - AI写文章：文案生成 + 去AI味
  - 20+数据源采集：热点追踪、竞品监控
  - 配图生成：AI图片生成 + 封面设计
  - 数据分析：阅读量分析、竞品对比、日报生成
  - 互动管理：评论回复、粉丝互动
  - API发布：一键发布到微信公众号
  
  ## 工作流
  采集 → 写 → 配图 → 发布 → 互动 → 数据分析
  
  ## 不用于
  - 非微信平台的内容运营
  - 纯手动操作（可用其他工具）
---

# WEMP-PRO 微信自媒体专业运营套件

> 整合采集、写作、配图、发布、互动、数据分析的全链路运营工具

---

## 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                      WEMP-PRO                              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  数据采集 │  │  AI写作   │  │  配图生成 │  │  API发布 │  │
│  │ Collector│  │  Writer  │  │  Image   │  │ Publisher│  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │             │             │             │          │
│       └─────────────┴─────────────┴─────────────┘          │
│                          │                                  │
│                    ┌─────▼─────┐                           │
│                    │  编排层    │                           │
│                    │ Orchestrat│                           │
│                    └─────┬─────┘                           │
│       ┌──────────────────┼──────────────────┐              │
│  ┌────▼────┐       ┌─────▼─────┐       ┌────▼────┐       │
│  │ 互动管理 │       │ 数据分析   │       │ 定时任务 │       │
│  │Commentar│       │ Analytics │       │ Scheduler│       │
│  └─────────┘       └───────────┘       └─────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## 核心模块

### 1. 数据采集 (Collector)

支持的数据源：

| 类别 | 数据源 | 用途 |
|------|--------|------|
| 热点榜 | 微博热搜、知乎热榜、百度风云榜、抖音热榜 | 选题参考 |
| 竞品 | 行业头部公众号、10w+爆文 | 对标分析 |
| 资讯 | 36氪、虎嗅、钛媒体、创业邦 | 行业资讯 |
| 社交 | 小红书、豆瓣、贴吧 | 舆情监控 |

**采集命令**：

```bash
# 采集热点
bash scripts/collect.sh hot --source weibo,zhihu --limit 10

# 采集竞品文章
bash scripts/collect.sh competitor --account 混知 --limit 20

# 全量采集（20+源）
bash scripts/collect.sh all --days 7
```

**输出格式**：
```json
{
  "title": "文章标题",
  "content": "正文内容",
  "url": "原文链接",
  "source": "来源",
  "publish_time": "发布时间",
  "read_count": "阅读量",
  "tags": ["标签1", "标签2"]
}
```

---

### 2. AI写作 (Writer)

#### 文案生成

```bash
# 生成文章
bash scripts/write.sh generate --topic "如何提升工作效率" --style 干货 --length 1500

# 风格选项：
# - 干货型：专业、实用、有深度
# - 故事型：叙事生动、情感丰富
# - 观点型：犀利、有态度、敢说话
# - 清单型：结构清晰、易于阅读
```

#### 去AI味 (Humanizer)

```bash
# 去AI味处理
bash scripts/write.sh humanize article.md

# 强度选项：gentle / normal / strong
bash scripts/write.sh humanize article.md --intensity normal
```

**去AI味核心原则**（来自 md2wechat-skill）：

| AI写法 | 真人写法 |
|--------|----------|
| 我们应该 | 不如试试 |
| 首先要说的是 | 开门见山吧 |
| 综上所述 | 总之 |
| 值得注意的是 | 注意啦 |
| 不可否认的是 | 说真的 |

---

### 3. 配图生成 (Image)

#### 封面生成

```bash
# 生成封面
bash scripts/image.sh cover "文章标题" --style 简约

# 风格：简约、复古、赛博朋克、水墨、摄影
```

#### 正文配图

```markdown
在 Markdown 中使用：
![图片描述](__generate:一只可爱的小猫__)
```

#### 配图规范

| 位置 | 尺寸 | 格式 |
|------|------|------|
| 封面 | 900x500 px | JPG |
| 文中图 | 宽度600-800px | JPG/PNG |
| 二维码 | 200x200 px | PNG |

---

### 4. API发布 (Publisher)

#### 微信公众号发布

```bash
# 上传草稿
bash scripts/publish.sh draft article.md --cover cover.jpg --title "标题"

# 直接发布
bash scripts/publish.sh publish article.md
```

**发布流程**：

```
1. Markdown → HTML 转换 (md2wechat)
2. 图片上传到微信素材库
3. 替换图片URL
4. 调用草稿箱API上传
5. 返回草稿ID
```

---

### 5. 互动管理 (Commentator)

#### 评论抓取

```bash
# 抓取文章评论
bash scripts/comment.sh fetch --article_id xxx

# 自动回复
bash scripts/comment.sh reply --article_id xxx --mode auto
```

**回复策略**：

| 评论类型 | 回复策略 |
|----------|----------|
| 提问 | 提供价值信息，引导关注 |
| 夸赞 | 感谢支持，互动加深 |
| 质疑 | 客观回应，不争不吵 |
| 引流 | 友善提醒，不予置评 |

---

### 6. 数据分析 (Analytics)

#### 日报生成

```bash
# 生成日报
bash scripts/analytics.sh daily --date 2024-01-15

# 周报
bash scripts/analytics.sh weekly --week 2

# 竞品对比
bash scripts/analytics.sh compare --accounts 混知,六神磊磊
```

**日报内容**：

```markdown
# 运营日报 2024-01-15

## 数据概览
- 今日新增关注：+128
- 昨日阅读量：5,234
- 粉丝总数：12,456

## 今日热点
1. #话题1 - 相关度：高
2. #话题2 - 相关度：中

## 爆款分析
- 文章A：阅读量 10w+，原因分析...
- 文章B：阅读量 5w+，原因分析...

## 明日建议
- 建议选题：xxx
- 建议发布时间：20:00
```

---

## 编排工作流

### 自动写稿工作流

```bash
# 采集热点 → 写文章 → 配图 → 定时发布
bash scripts/workflow.sh auto-post --topic "AI发展" --publish_time "2024-01-20 20:00"
```

### 竞品监控工作流

```bash
# 监控竞品 → 分析爆款 → 生成报告
bash scripts/workflow.sh monitor --accounts 混知,六神磊磊
```

### 互动运营工作流

```bash
# 抓取评论 → AI回复 → 数据统计
bash scripts/workflow.sh engage --mode auto
```

---

## 集成说明

### 外部模块集成

| 模块 | 状态 | 集成方式 |
|------|------|----------|
| wechat-ai-publisher | 待开发 | 预留接口 |
| wemp-operator | 待开发 | 预留接口 |
| md2wechat | 待开发 | 预留接口 |

### 现有复用 Skills

| 能力 | 来源 | 复用方式 |
|------|------|----------|
| 图片生成 | [sdxl-generator](/Users/yachaolailo/projects/openclaw-backup/skills/sdxl-generator/SKILL.md) | 直接调用 sdxl_gen.py |
| 去AI味技巧 | [xiaohongshu-writer](/Users/yachaolailo/projects/openclaw-backup/skills/xiaohongshu-writer/SKILL.md) | 参考"去AI味核心原则" |
| 竞品监控 | [competitor-monitor](/Users/yachaolailo/projects/openclaw-backup/skills/competitor-monitor/SKILL.md) | 扩展数据源采集 |

---

## 实现步骤

### Phase 1: 框架搭建 (已完成 ✅)
- [x] SKILL.md 架构设计
- [x] collect.sh 数据采集框架
- [x] write.sh AI写作框架
- [x] image.sh 配图生成框架
- [x] publish.sh 发布框架

### Phase 2: 核心能力集成 (进行中 🔄)
- [ ] 集成 sdxl-generator 图片生成能力 → image.sh
  - 调用 `/Users/yachaolailo/projects/openclaw-backup/skills/sdxl-generator/sdxl_gen.py`
  - 使用 `gzh-cover` 预设生成封面
  - 使用 `wechat` 预设生成正文配图
- [ ] 集成 md2wechat Markdown转HTML → publish.sh
- [ ] 集成微信发布API → publish.sh

### Phase 3: 采集能力扩展 (待开发 📋)
- [ ] 集成 wemp-operator 爬虫能力 → collect.sh
- [ ] 支持 20+ 数据源采集
- [ ] 竞品文章自动抓取

### Phase 4: AI写作增强 (待开发 📋)
- [ ] 集成 wechat-ai-publisher 文案生成 → write.sh
- [ ] 去AI味自动化处理
- [ ] 多风格模板支持

### Phase 5: 数据分析与互动 (待开发 📋)
- [ ] 开发 analytics.sh 数据分析模块
- [ ] 开发 comment.sh 评论管理模块
- [ ] 开发 workflow.sh 编排工作流

---

## 技术依赖

### 必须安装
- ComfyUI (用于 SDXL 图片生成)
- Python 3.8+

### 可选服务
- 微信公众平台 API (需要 AppID)
- OpenAI API (用于文案生成)

---

## 配置说明

### 环境变量

```bash
# 微信配置
WECHAT_APP_ID=xxx
WECHAT_APP_SECRET=xxx

# AI配置
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx

# 图片API
IMAGE_API_KEY=xxx
```

### 配置文件

编辑 `references/config.yaml`：

```yaml
wechat:
  app_id: ${WECHAT_APP_ID}
  app_secret: ${WECHAT_APP_SECRET}
  
sources:
  hot:
    - weibo
    - zhihu
    - baidu
  competitor:
    - 混知
    - 六神磊磊
    
writing:
  default_style: 干货型
  humanize_intensity: normal
```

---

## 快速开始

### 1. 采集热点

```bash
bash scripts/collect.sh hot --source weibo --limit 5
```

### 2. 生成文章

```bash
bash scripts/write.sh generate --topic "你提供的选题" --style 干货
```

### 3. 配图

```bash
bash scripts/image.sh cover "你的文章标题"
```

### 4. 发布

```bash
bash scripts/publish.sh draft article.md
```

---

## 常见问题

### Q: 如何添加新的数据源？

在 `references/sources/` 目录添加采集脚本，遵循 `collector_xxx.sh` 命名规范。

### Q: 支持哪些发布平台？

当前支持微信公众号草稿箱，后续支持视频号、小程序。

### Q: 去AI味效果不好怎么办？

调整强度：`--intensity gentle/normal/strong`

---

*Version: 1.0.0*
*Last updated: 2026-03-03*
