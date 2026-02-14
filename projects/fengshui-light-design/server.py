#!/usr/bin/env python3
"""
光照设计助手 - 基于Ollama本地模型
根据房间信息推荐光照方案
"""

import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://localhost:11434")

def get_light_plan(room_type, area, orientation):
    """AI生成光照方案"""
    
    prompt = f"""你是一位室内光照设计师。房间信息：
- 房间类型：{room_type}
- 面积：{area}平米
- 朝向：{orientation}

请给出光照设计方案，包括：
1. 主光源建议（灯类型、瓦数）
2. 辅助光源（台灯、壁灯等）
3. 色温建议（暖白光/冷白光）
4. 亮度建议
5. 省钱建议

请用JSON格式：
{{"main": "主光", "aux": ["辅光1", "辅光2"], "color_temp": "色温", "brightness": "亮度", "tips": ["建议1", "建议2"]}}"""

    try:
        resp = requests.post(
            f"{OLLAMA_HOST}/api/generate",
            json={"model": "qwen2.5:latest", "prompt": prompt, "stream": False},
            timeout=60
        )
        if resp.status_code == 200:
            text = resp.json().get("response", "")
            try:
                if "{" in text:
                    return json.loads(text[text.find("{"):text.rfind("}")+1])
            except:
                pass
    except Exception as e:
        print(f"Error: {e}")
    return get_default_plan(room_type)

def get_default_plan(room_type):
    defaults = {
        "客厅": {"main": "吸顶灯 40-60W", "aux": ["筒灯", "落地灯"], "color_temp": "4000K中性光", "brightness": "300-500lux", "tips": ["配可调光灯具", "沙发旁加阅读灯"]},
        "卧室": {"main": "吸顶灯 20-30W", "aux": ["床头灯", "小夜灯"], "color_temp": "3000K暖白光", "brightness": "150-300lux", "tips": ["床头灯可调光", "避免直射床头"]},
        "厨房": {"main": "平板灯 30-40W", "aux": ["柜底灯", "操作台灯"], "color_temp": "5000K白光", "brightness": "500lux", "tips": ["操作台要亮", "选防水灯具"]},
        "卫生间": {"main": "平板灯 20-30W", "aux": ["镜前灯"], "color_temp": "4000K中性光", "brightness": "300lux", "tips": ["镜前灯要亮", "防潮很重要"]}
    }
    return defaults.get(room_type, defaults["客厅"])

@app.route('/light', methods=['GET'])
def light():
    room = request.args.get('room', '客厅')
    area = request.args.get('area', '20')
    orientation = request.args.get('orientation', '南')
    result = get_light_plan(room, area, orientation)
    result["input"] = {"room": room, "area": area, "orientation": orientation}
    return jsonify(result)

@app.route('/health', methods=['GET'])
def health():
    try:
        requests.get(f"{OLLAMA_HOST}/api/tags", timeout=5)
        return jsonify({"status": "ok"})
    except:
        return jsonify({"status": "error"})

if __name__ == '__main__':
    print("💡 光照设计助手启动...")
    app.run(host='0.0.0.0', port=5006, debug=True)
