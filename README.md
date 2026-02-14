# 🏠 户型风水分析助手

基于 Ollama 本地模型开发的户型风水分析工具。

## 功能

- 📤 上传户型图（支持 JPG、PNG）
- 🤖 AI 自动识别门窗、厨卫位置
- 🔮 分析风水问题（穿堂煞、对门煞等）
- 💡 给出调整建议
- 💰 推荐财位

## 技术栈

- **前端**: HTML + CSS + JavaScript
- **后端**: Python Flask
- **AI模型**: Ollama gemma3:4b（本地运行，无需API）

## 快速开始

### 1. 确保 Ollama 已启动

```bash
ollama serve
ollama list
```

确保已安装 gemma3:4b：
```bash
ollama pull gemma3:4b
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 启动服务

```bash
python server.py
```

### 4. 访问

打开浏览器访问：`http://localhost:5000`

## 项目结构

```
fengshui-floorplan/
├── index.html      # 前端页面
├── server.py      # Flask 后端
├── requirements.txt
└── README.md
```

## 使用说明

1. 打开网页，点击上传户型图
2. 点击"开始分析"
3. AI 会自动分析并给出风水建议

## 注意事项

- 首次分析可能需要10-30秒（取决于图片复杂度）
- 使用本地模型，无需联网，不消耗API额度
- 如果分析结果不理想，可以调整 server.py 中的 prompt
