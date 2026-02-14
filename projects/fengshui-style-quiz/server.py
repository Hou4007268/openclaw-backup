#!/usr/bin/env python3
"""
装修风格测试 - 基于Ollama本地模型
通过问答测试用户最适合的装修风格
"""

import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://localhost:11434")

STYLES = {
    "modern": {"name": "现代简约", "colors": ["白、黑、灰"], "feature": "简洁实用"},
    "nordic": {"name": "北欧风", "colors": ["白、木、米"], "feature": "自然舒适"},
    "chinese": {"name": "新中式", "colors": ["红、木、灰"], "feature": "传统与现代"},
    "japanese": {"name": "日式", "colors": ["白、木、竹"], "feature": "禅意简约"},
    "european": {"name": "欧式", "colors": ["金、白、深蓝"], "feature": "豪华典雅"},
    "mediterranean": {"name": "地中海", "colors": ["蓝、白、黄"], "feature": "浪漫海洋"}
}

QUESTIONS = [
    {"id": 1, "question": "你更喜欢什么样的空间氛围？", 
     "options": [{"text": "简洁明亮", "score": {"modern": 3, "nordic": 2}}, {"text": "温馨舒适", "score": {"nordic": 3, "japanese": 2}}, {"text": "大气豪华", "score": {"european": 3, "chinese": 2}}, {"text": "浪漫清新", "score": {"mediterranean": 3}}]},
    {"id": 2, "question": "你喜欢的颜色是？",
     "options": [{"text": "黑白灰", "score": {"modern": 3}}, {"text": "原木色", "score": {"nordic": 3, "japanese": 3}}, {"text": "深红色", "score": {"chinese": 3, "european": 2}}, {"text": "蓝色白色", "score": {"mediterranean": 3}}]},
    {"id": 3, "question": "你喜欢的家具风格？",
     "options": [{"text": "简洁线条", "score": {"modern": 3, "nordic": 2}}, {"text": "自然木质", "score": {"nordic": 3, "japanese": 3}}, {"text": "雕花装饰", "score": {"european": 3, "chinese": 2}}, {"text": "曲线造型", "score": {"european": 2, "mediterranean": 2}}]},
    {"id": 4, "question": "你家采光怎么样？",
     "options": [{"text": "很好", "score": {"modern": 2, "mediterranean": 3}}, {"text": "一般", "score": {"nordic": 2, "japanese": 2}}, {"text": "较差", "score": {"chinese": 2, "european": 2}}]},
    {"id": 5, "question": "装修预算更看重？",
     "options": [{"text": "性价比", "score": {"modern": 3, "nordic": 2}}, {"text": "品质感", "score": {"european": 3, "chinese": 2}}, {"text": "自然环保", "score": {"japanese": 3, "nordic": 2}}]}
]

def calculate_style(scores):
    """计算得分最高的风格"""
    if not scores:
        return "modern"
    total = {}
    for q_scores in scores:
        for style, score in q_scores.items():
            total[style] = total.get(style, 0) + score
    return max(total, key=total.get)

def get_style_detail(style_key):
    """用AI生成风格详细建议"""
    style = STYLES.get(style_key, STYLES["modern"])
    
    prompt = f"""简述{style['name']}风格的特点（20字以内）、适合人群（15字以内）、推荐配色方案（10字以内）。用JSON格式：
{{"feature": "特点", "suit": "适合人群", "colors": "配色"}}"""
    
    try:
        resp = requests.post(
            f"{OLLAMA_HOST}/api/generate",
            json={"model": "qwen2.5:latest", "prompt": prompt, "stream": False},
            timeout=30
        )
        if resp.status_code == 200:
            text = resp.json().get("response", "")
            try:
                if "{" in text:
                    return json.loads(text[text.find("{"):text.rfind("}")+1])
            except:
                pass
    except:
        pass
    
    return {
        "feature": style["feature"],
        "suit": "大多数家庭",
        "colors": "、".join(style["colors"])
    }

@app.route('/questions', methods=['GET'])
def questions():
    """获取测试问题"""
    return jsonify({"questions": [{"id": q["id"], "question": q["question"], "options": [o["text"] for o in q["options"]]} for q in QUESTIONS]})

@app.route('/submit', methods=['POST'])
def submit():
    """提交答案，获取结果"""
    data = request.json
    answers = data.get("answers", [])
    
    scores = []
    for i, ans_idx in enumerate(answers):
        if i < len(QUESTIONS) and ans_idx < len(QUESTIONS[i]["options"]):
            scores.append(QUESTIONS[i]["options"][ans_idx]["score"])
    
    style_key = calculate_style(scores)
    style = STYLES[style_key]
    detail = get_style_detail(style_key)
    
    return jsonify({
        "style_key": style_key,
        "style_name": style["name"],
        "feature": detail.get("feature", style["feature"]),
        "suit": detail.get("suit", ""),
        "colors": detail.get("colors", ""),
        "colors_list": style["colors"]
    })

@app.route('/health', methods=['GET'])
def health():
    try:
        requests.get(f"{OLLAMA_HOST}/api/tags", timeout=5)
        return jsonify({"status": "ok"})
    except:
        return jsonify({"status": "error"})

if __name__ == '__main__':
    print("🎨 装修风格测试启动中...")
    app.run(host='0.0.0.0', port=5005, debug=True)
