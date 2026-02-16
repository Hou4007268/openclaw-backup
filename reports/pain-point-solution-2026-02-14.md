# 痛点解决方案 - 2026-02-14

## 问题1: Ollama Tool Call报错
**报错**: `json: cannot unmarshal string into Go struct field ToolFunctionParameters`
**原因**: 参数格式不对，字段类型不匹配
**解决**: 检查输入JSON格式，确保字段类型正确

## 问题2: Ollama list panic
**报错**: `panic: runtime error: slice bounds out of range [:12] with length 3`
**原因**: 代码尝试截取超出字符串长度的字符
**解决**: 检查模型ID长度，避免过短的digest

---

## HarmonyChainSpace 分析

这是个很好的参考项目！用多Agent系统解决"科学vs风水"的冲突。

### 核心技术栈
- LangChain + Streamlit
- ChromaDB向量数据库
- RAG知识库（建筑法规+风水古籍）
- 多LLM切换（Groq/GPT-4o/Gemini）

### 我们的机会
可以做一个简化版：
1. **单Agent替代三Agent** - 降低成本
2. **专注室内设计风水** - 不需要法规库
3. **用本地Ollama** - 不用付费API

---

## 今晚可做的MVP

做一个"户型风水分析助手"：
1. 上传户型图
2. AI识别门、窗、厨、卫位置
3. 给出风水建议（穿堂煞、财位、灶位等）
4. 用Ollama qwen2.5本地运行

技术方案：
- 图像理解：gemma3 或本地多模态模型
- 对话：qwen2.5本地
- UI：简单HTML页面

是否开始做？
