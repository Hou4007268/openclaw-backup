# Smart PPT Generator 📊

智能演示文稿生成器 - 一键创建专业PPT！

[English](./README_en.md)

---

## ✨ 特性

- ✅ **无需API** - 本地运行，不依赖任何付费服务
- 智能风格识别（科技/商务/教育/营销/创意等10+种）
- 自动设计布局 - 调用专业设计技能
- 预览确认机制 - 生成前先看效果
- 动态配色方案 - 10种风格 × 5套配色
- 高级模式 - Canvas设计，艺术级效果
- 联网配色搜索 - 用户反馈后自动更新
- 一键下载 - 自动上传到文件托管服务

## 🛠️ 依赖

### 必需工具

| 工具 | 安装命令 | 用途 |
|------|----------|------|
| Node.js | 系统预装 | 运行环境 |
| puppeteer | `npm install puppeteer` | 浏览器截图 |
| pptxgenjs | `npm install pptxgenjs` | 生成PPTX |

### 必需Skills

| Skill | 用途 |
|-------|------|
| frontend-design | 普通模式布局设计 |
| canvas-design | 高级模式艺术设计 |

### 必需服务

| 服务 | 用途 | 部署方式 |
|------|------|----------|
| FileBrowser | 文件托管 | Docker :8080 |

## 🚀 快速开始

```bash
# 安装依赖
cd /tmp && npm install puppeteer pptxgenjs

# 部署FileBrowser
docker run -d --name filebrowser \
  -v /path/to/share:/srv \
  -p 127.0.0.1:8080:80 \
  filebrowser/filebrowser:latest
```

## 📖 使用方法

```bash
bash scripts/generate-ppt.sh --topic "AI技术" --pages 5
```

---

**由 🦞 小龙虾 编写**
