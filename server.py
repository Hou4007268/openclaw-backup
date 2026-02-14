#!/usr/bin/env python3
"""
风水配色助手 - 基于Ollama本地模型
根据风水原理推荐家居颜色搭配
"""

import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://localhost:11434")

def get_color_recommendation(room_type, owner_birth_year=None):
    """使用本地Ollama模型获取风水配色建议"""
    
    prompt = f"""你是一位风水大师。请为{room_type}推荐风水颜色搭配。

要求：
1. 列出3种主色调（用颜色名称如"米白色"、"淡黄色"等）
2. 列出2种辅助色
3. 给出每个颜色的风水寓意（10字以内）
4. 说明颜色搭配的整体效果

请用JSON格式回复：
{{
    "main_colors": ["颜色1", "颜色2", "颜色3"],
    "secondary_colors": ["颜色1", "颜色2"],
    "meanings": ["寓意1", "寓意2", "寓意3"],
    "effect": "整体效果描述"
}}"""
    
    try:
        response = requests.post(
            f"{OLLAMA_HOST}/api/generate",
            json={
                "model": "qwen2.5:latest",
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            text = result.get("response", "")
            
            # 尝试解析JSON
            try:
                # 提取JSON部分
                if "{" in text:
                    json_str = text[text.find("{"):text.rfind("}")+1]
                    return json.loads(json_str)
            except:
                pass
            
            # 如果解析失败，返回默认结果
            return parse_fallback(text)
    except Exception as e:
        print(f"Error: {e}")
    
    return get_default_recommendation(room_type)

def parse_fallback(text):
    """解析非JSON格式的回复"""
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    
    return {
        "main_colors": ["米白色", "淡黄色", "浅灰色"],
        "secondary_colors": ["棕色", "金色"],
        "meanings": ["温馨", "活力", "稳重"],
        "effect": "和谐舒适的家居氛围"
    }

def get_default_recommendation(room_type):
    """默认配色方案"""
    defaults = {
        "客厅": {
            "main_colors": ["米白色", "淡黄色", "浅灰色"],
            "secondary_colors": ["棕色", "金色"],
            "meanings": ["温馨", "活力", "稳重"],
            "effect": "温馨舒适的待客空间"
        },
        "卧室": {
            "main_colors": ["浅蓝色", "淡粉色", "米白色"],
            "secondary_colors": ["浅紫色", "白色"],
            "meanings": ["宁静", "浪漫", "纯净"],
            "effect": "有助于睡眠的安静氛围"
        },
        "厨房": {
            "main_colors": ["白色", "浅灰色", "淡绿色"],
            "secondary_colors": ["银色", "蓝色"],
            "meanings": ["洁净", "清新", "清凉"],
            "effect": "干净清爽的烹饪环境"
        },
        "卫生间": {
            "main_colors": ["白色", "浅蓝色", "灰色"],
            "secondary_colors": ["银色", "透明色"],
            "meanings": ["洁净", "清爽", "现代"],
            "effect": "干净明亮的洗浴空间"
        }
    }
    
    return defaults.get(room_type, defaults["客厅"])

@app.route('/recommend', methods=['GET'])
def recommend():
    """获取风水配色建议"""
    room_type = request.args.get('room', '客厅')
    birth_year = request.args.get('birth', None)
    
    result = get_color_recommendation(room_type, birth_year)
    result["room"] = room_type
    
    return jsonify(result)

@app.route('/health', methods=['GET'])
def health():
    """健康检查"""
    try:
        response = requests.get(f"{OLLAMA_HOST}/api/tags", timeout=5)
        return jsonify({
            "status": "ok",
            "ollama": "connected"
        })
    except:
        return jsonify({
            "status": "error",
            "ollama": "disconnected"
        })

if __name__ == '__main__':
    print("🎨 风水配色助手启动中...")
    print(f"📡 Ollama: {OLLAMA_HOST}")
    app.run(host='0.0.0.0', port=5002, debug=True)
