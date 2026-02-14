#!/usr/bin/env python3
"""
户型风水分析后端 - 使用 Ollama 本地模型
"""

import base64
import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Ollama 配置
OLLAMA_HOST = "http://localhost:11434"

def encode_image(image_data):
    """将图片转为 base64"""
    return base64.b64encode(image_data).decode('utf-8')

def analyze_with_ollama(image_base64):
    """使用 Ollama 分析户型图"""
    
    # 构造 prompt
    prompt = """你是一个专业的风水大师。请分析这张户型图：

1. 识别户型结构（几室几厅、门窗位置）
2. 找出可能的风水问题（如穿堂煞、对门煞等）
3. 给出具体的调整建议
4. 推荐财位位置

请用简洁、专业的语言回答。"""
    
    # 调用 gemma3 分析图片
    payload = {
        "model": "gemma3:4b",
        "prompt": prompt,
        "images": [image_base64],
        "stream": False
    }
    
    try:
        response = requests.post(
            f"{OLLAMA_HOST}/api/generate",
            json=payload,
            timeout=120
        )
        
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "")
        else:
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def parse_ollama_response(response_text):
    """解析 Ollama 响应，提取风水分析结果"""
    
    # 简单的解析逻辑，实际可以根据响应格式调整
    lines = response_text.split('\n')
    
    overview = ""
    issues = ""
    suggestions = ""
    wealth = ""
    
    current_section = None
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        if any(x in line for x in ["户型", "结构", "概述"]):
            current_section = "overview"
        elif any(x in line for x in ["问题", "煞", "禁忌"]):
            current_section = "issues"
        elif any(x in line for x in ["建议", "调整", "化解"]):
            current_section = "suggestions"
        elif any(x in line for x in ["财位", "财运"]):
            current_section = "wealth"
        
        if current_section:
            if current_section == "overview":
                overview += line + " "
            elif current_section == "issues":
                issues += line + " "
            elif current_section == "suggestions":
                suggestions += line + " "
            elif current_section == "wealth":
                wealth += line + " "
    
    return {
        "overview": overview.strip() or "未能识别户型结构",
        "issues": issues.strip() or "未发现明显问题",
        "suggestions": suggestions.strip() or "暂无建议",
        "wealth": wealth.strip() or "根据户型确定"
    }

@app.route('/analyze', methods=['POST'])
def analyze():
    """分析户型图"""
    
    if 'image' not in request.files:
        return jsonify({"error": "请上传图片"}), 400
    
    file = request.files['image']
    image_data = file.read()
    image_base64 = encode_image(image_data)
    
    # 使用 Ollama 分析
    response_text = analyze_with_ollama(image_base64)
    
    if response_text:
        result = parse_ollama_response(response_text)
    else:
        # 如果 Ollama 调用失败，返回示例
        result = {
            "overview": "三室两厅户型",
            "issues": "1. 入户门正对窗户（穿堂煞）\n2. 厨房门对卫生间门",
            "suggestions": "1. 设置玄关屏风\n2. 厨卫间放阔叶植物",
            "wealth": "客厅东南角"
        }
    
    return jsonify(result)

@app.route('/health', methods=['GET'])
def health():
    """健康检查"""
    try:
        response = requests.get(f"{OLLAMA_HOST}/api/tags", timeout=5)
        models = response.json().get("models", [])
        model_names = [m["name"] for m in models]
        return jsonify({
            "status": "ok",
            "ollama": "connected",
            "models": model_names
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "ollama": "disconnected",
            "error": str(e)
        })

if __name__ == '__main__':
    print("🚀 户型风水分析服务启动中...")
    print(f"📡 Ollama 地址: {OLLAMA_HOST}")
    print("🌐 服务地址: http://localhost:5000")
    app.run(host='0.0.0.0', port=5001, debug=True)
