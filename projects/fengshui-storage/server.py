#!/usr/bin/env python3
"""
储物收纳规划助手 - 基于Ollama本地模型
根据房间类型和需求，AI推荐收纳方案
"""

import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://localhost:11434")

def get_storage_plan(room_type, area, family_size):
    """使用AI生成收纳方案"""
    
    prompt = f"""你是一位收纳专家。用户信息：
- 房间类型：{room_type}
- 房间面积：{area}平米
- 家庭人口：{family_size}人

请生成收纳方案，包括：
1. 推荐收纳工具（柜子、盒子、架子等）
2. 收纳位置建议
3. 收纳技巧（3-5条）
4. 断舍离建议

请用JSON格式回复：
{{
    "tools": ["工具1", "工具2"],
    "locations": ["位置1", "位置2"],
    "tips": ["技巧1", "技巧2", "技巧3"],
    "donate": ["可丢弃物品1", "可丢弃物品2"]
}}"""

    try:
        response = requests.post(
            f"{OLLAMA_HOST}/api/generate",
            json={"model": "qwen2.5:latest", "prompt": prompt, "stream": False},
            timeout=60
        )
        if response.status_code == 200:
            text = response.json().get("response", "")
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
        "客厅": {
            "tools": ["电视柜", "茶几抽屉", "沙发收纳", "墙面挂钩"],
            "locations": ["电视柜", "沙发底部", "墙角储物凳"],
            "tips": ["利用立体空间", "使用收纳盒", "定期断舍离"],
            "donate": ["旧杂志", "多余包装盒"]
        },
        "卧室": {
            "tools": ["衣柜", "床头柜", "床底收纳盒", "挂衣架"],
            "locations": ["衣柜", "床底", "门后挂钩"],
            "tips": ["季的衣服放中间", "裤子用衣架挂起", "内衣分类收纳"],
            "donate": ["不穿的衣服", "旧枕头"]
        },
        "厨房": {
            "tools": ["橱柜", "调味拉篮", "水槽沥水架", "冰箱收纳盒"],
            "locations": ["橱柜", "墙面挂架", "冰箱门"],
            "tips": ["调味品放顺手位置", "食材按类别放", "定期检查过期"],
            "donate": ["过期食品", "旧餐具"]
        }
    }
    return defaults.get(room_type, defaults["客厅"])

@app.route('/plan', methods=['GET'])
def plan():
    room = request.args.get('room', '客厅')
    area = request.args.get('area', '20')
    family = request.args.get('family', '3')
    result = get_storage_plan(room, area, family)
    result["input"] = {"room": room, "area": area, "family": family}
    return jsonify(result)

@app.route('/health', methods=['GET'])
def health():
    try:
        requests.get(f"{OLLAMA_HOST}/api/tags", timeout=5)
        return jsonify({"status": "ok"})
    except:
        return jsonify({"status": "error"})

if __name__ == '__main__':
    print("📦 储物收纳规划助手启动中...")
    app.run(host='0.0.0.0', port=5004, debug=True)
