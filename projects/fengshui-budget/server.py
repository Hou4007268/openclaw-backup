#!/usr/bin/env python3
"""
装修预算规划助手 - 基于Ollama本地模型
帮助用户规划装修预算，优化资金分配
"""

import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://localhost:11434")

def calculate_budget(area, room_type, style):
    """使用AI生成装修预算方案"""
    
    prompt = f"""你是一位资深装修预算顾问。用户信息：
- 房屋面积：{area}平米
- 户型：{room_type}
- 装修风格：{style}

请生成一个详细的预算分配方案，包括：
1. 各空间预算占比（客厅、卧室、厨房、卫生间等）
2. 主材预估（地板、瓷砖、涂料等）
3. 家具家电建议
4. 总体预算区间

请用JSON格式回复：
{{
    "total_budget": "总体预算范围，如10-15万",
    "living_room": {{"budget": "客厅预算", "items": ["项目1", "项目2"]}},
    "bedroom": {{"budget": "卧室预算", "items": ["项目1", "项目2"]}},
    "kitchen": {{"budget": "厨房预算", "items": ["项目1", "项目2"]}},
    "bathroom": {{"budget": "卫生间预算", "items": ["项目1", "项目2"]}},
    "main_materials": ["主材1", "主材2"],
    "furniture": ["家具1", "家具2"],
    "tips": ["建议1", "建议2"]
}}"""

    try:
        response = requests.post(
            f"{OLLAMA_HOST}/api/generate",
            json={
                "model": "qwen2.5:latest",
                "prompt": prompt,
                "stream": False
            },
            timeout=90
        )
        
        if response.status_code == 200:
            result = response.json()
            text = result.get("response", "")
            
            try:
                if "{" in text:
                    json_str = text[text.find("{"):text.rfind("}")+1]
                    return json.loads(json_str)
            except:
                pass
            
    except Exception as e:
        print(f"Error: {e}")
    
    return get_default_budget(area, room_type)

def get_default_budget(area, room_type):
    """默认预算方案"""
    base = area * 1000  # 基础预算：1000元/平米
    
    return {
        "total_budget": f"{int(base*0.8)}-{int(base*1.2)}元",
        "living_room": {
            "budget": f"{int(base*0.3)}元",
            "items": ["地板/地砖", "沙发", "电视墙", "窗帘"]
        },
        "bedroom": {
            "budget": f"{int(base*0.2)}元",
            "items": ["床+床垫", "衣柜", "床头柜", "窗帘"]
        },
        "kitchen": {
            "budget": f"{int(base*0.25)}元",
            "items": ["橱柜", "烟灶", "水槽", "吊顶"]
        },
        "bathroom": {
            "budget": f"{int(base*0.15)}元",
            "items": ["马桶", "花洒", "浴室柜", "吊顶"]
        },
        "main_materials": ["地板", "瓷砖", "乳胶漆", "吊顶"],
        "furniture": ["沙发", "床", "餐桌", "衣柜"],
        "tips": ["建议半包模式", "主材自己选购", "预留10%应急"]
    }

@app.route('/budget', methods=['GET'])
def budget():
    """获取装修预算方案"""
    area = request.args.get('area', '100')
    room_type = request.args.get('room', '三室两厅')
    style = request.args.get('style', '现代简约')
    
    result = calculate_budget(area, room_type, style)
    result["input"] = {
        "area": area,
        "room_type": room_type,
        "style": style
    }
    
    return jsonify(result)

@app.route('/health', methods=['GET'])
def health():
    """健康检查"""
    try:
        response = requests.get(f"{OLLAMA_HOST}/api/tags", timeout=5)
        return jsonify({"status": "ok", "ollama": "connected"})
    except:
        return jsonify({"status": "error", "ollama": "disconnected"})

if __name__ == '__main__':
    print("💰 装修预算规划助手启动中...")
    print(f"📡 Ollama: {OLLAMA_HOST}")
    app.run(host='0.0.0.0', port=5003, debug=True)
