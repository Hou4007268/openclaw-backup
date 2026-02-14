# 🎨 风水配色助手

基于 Ollama 本地模型开发的家居风水配色工具。

## 功能

- 选择房间类型（客厅、卧室、厨房、卫生间）
- AI 根据风水原理推荐配色方案
- 显示主色调和辅助色
- 说明每个颜色的风水寓意
- 本地运行，不花 API 钱

## 技术栈

- **前端**: HTML + CSS + JavaScript
- **后端**: Python Flask
- **AI模型**: Ollama qwen2.5:latest

## 快速开始

### 1. 确保 Ollama 已启动

```bash
ollama serve
ollama list
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

打开浏览器：`http://localhost:5002`

## 项目结构

```
fengshui-color-picker/
├── index.html      # 前端页面
├── server.py       # Flask 后端
├── requirements.txt
└── README.md
```

## 使用示例

```
# 获取客厅风水配色
curl "http://localhost:5002/recommend?room=客厅"
```

返回 JSON：
```json
{
    "main_colors": ["米白色", "淡黄色", "浅灰色"],
    "secondary_colors": ["棕色", "金色"],
    "meanings": ["温馨", "活力", "稳重"],
    "effect": "温馨舒适的待客空间",
    "room": "客厅"
}
```

## 免费！

使用本地 Ollama 模型，无需 API Key，不花一分钱。
