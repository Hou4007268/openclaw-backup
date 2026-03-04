# Smart PPT Generator 📊

AI-powered PowerPoint generator - create professional presentations with one command!

[中文](./README.md)

---

## ✨ Features

- ✅ **No API needed** - runs locally, no paid services
- Smart style detection (Tech/Business/Education/Marketing+)
- Auto design layout using professional design skills
- Preview confirmation - see before download
- Dynamic color schemes - 10 styles × 5 palettes
- High-end mode - Canvas design for artistic results
- Online color search - auto-refresh after 5+ feedback
- One-click download via file hosting

## 🛠️ Dependencies

| Tool | Install | Purpose |
|------|---------|---------|
| Node.js | pre-installed | Runtime |
| puppeteer | `npm install puppeteer` | Screenshots |
| pptxgenjs | `npm install pptxgenjs` | PPTX generation |

## 🚀 Quick Start

```bash
cd /tmp && npm install puppeteer pptxgenjs
docker run -d --name filebrowser -v /path:/srv -p 8080:80 filebrowser/filebrowser:latest
```

## 📖 Usage

```bash
bash scripts/generate-ppt.sh --topic "AI Technology" --pages 5
```

---

**Written by 🦞 Little Crawfish**
