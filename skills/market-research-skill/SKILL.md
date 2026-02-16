# 市场调研 Skill - 痛点发现系统

## 目标
自动扫描 Reddit + X，发现装修/买房/失眠用户的真实痛点，生成内容选题。

## 数据源策略

### 方案A：RSS + API（当前可用）
- Reddit：r/HomeImprovement, r/FengShui RSS
- X：受限，需浏览器
- 知乎/小红书：搜索热点话题

### 方案B：浏览器自动化（待修复后启用）
- Reddit 网页抓取
- X 话题搜索
- 竞品账号监控

## 当前实施方案（方案A）

### 1. Reddit RSS 监控

**家居/风水类：**
- r/HomeImprovement：https://www.reddit.com/r/HomeImprovement/top/.rss?t=week
- r/FengShui：https://www.reddit.com/r/fengshui/top/.rss?t=week
- r/InteriorDesign：https://www.reddit.com/r/InteriorDesign/top/.rss?t=week
- r/organization：https://www.reddit.com/r/organization/top/.rss?t=week
- r/minimalism：https://www.reddit.com/r/minimalism/top/.rss?t=week

**AI/工具类：**
- r/LocalLLaMA：https://www.reddit.com/r/LocalLLaMA/top/.rss?t=week
- r/ChatGPT：https://www.reddit.com/r/ChatGPT/top/.rss?t=week
- r/selfhosted：https://www.reddit.com/r/selfhosted/top/.rss?t=week
- r/Automate：https://www.reddit.com/r/Automate/top/.rss?t=week
- r/productivity：https://www.reddit.com/r/productivity/top/.rss?t=week

### 2. 痛点识别框架（可解决导向）

不仅限于装修失眠，所有可通过知识或工具解决的痛点：

**【风水知识可解决】**
- 空间类：户型缺陷、朝向选择、楼层讲究、门窗位置、缺角问题
- 布局类：家具摆放、床头朝向、镜子位置、通道设计、动线规划
- 环境类：采光不足、通风问题、色彩搭配、植物选择、水景布置

**【代码工具可解决】**
- 计算类：八字计算、方位测算、吉日查询、五行分析、命盘生成
- 工具类：户型评估、罗盘指南、风水自测、布局模拟、3D可视化
- 数据类：趋势分析、案例库、知识图谱、智能推荐、效果追踪

**【AI工具可解决】**
- 使用门槛：Prompt不会写、模型不会选、API太复杂
- 工作流：多工具切换、数据孤岛、重复操作
- 成本焦虑：Token消耗不可控、不知道哪家便宜
- 效果不稳定：输出质量波动、幻觉问题、难以复现
- 隐私安全：数据上传顾虑、本地部署困难

**【通用痛点】**
- 决策困难：买房纠结、装修迷茫、改造 unsure、选择困难
- 效果验证：改了布局有没有用、如何量化效果、科学依据
- 知识获取：找不到靠谱信息、迷信内容太多、真假难辨

### 3. 自动化流程
```
每日运行：
1. 抓取 RSS 数据
2. 关键词匹配 + AI 相关性评分
3. 提取 Top 5 痛点话题
4. 生成内容选题建议
5. 发送到 Telegram
```

## 实施步骤

### Step 1：基础 RSS 抓取任务
创建定时任务，每日抓取 Reddit RSS，提取标题和摘要。

### Step 2：关键词匹配 + AI 分析
使用 DeepSeek 分析内容相关性，筛选高价值话题。

### Step 3：生成选题报告
整合热点话题，生成3-5个内容选题建议。

## 任务配置

```json
{
  "name": "市场调研 - Reddit痛点扫描",
  "schedule": "0 7 * * *",
  "model": "deepseek/deepseek-chat",
  "task": "抓取Reddit RSS，分析痛点话题"
}
```

## 输出格式

```
📊 市场调研报告（2026-02-15）

🔥 发现痛点（Top 5）：
1. 【镜子对床睡眠问题】- 风水知识类（12个帖子提及）
   用户反馈：睡不好、噩梦、醒来看到镜子里的自己很吓人
   可解决：写一篇科学+风水的解释文章

2. 【买房楼层选择困难】- 决策工具类（8个帖子）
   用户反馈：不知道选几楼，听人说这不好那不好
   可解决：开发楼层选择指南/计算器

3. 【户型缺角焦虑】- 风水知识类（6个帖子）
   用户反馈：听说缺角影响运势，很担心
   可解决：科普文章+化解方案

💡 选题建议：
1. 镜子对床：是风水迷信还是科学原理？（深度解析类）
2. 楼层选择：理性分析+风水参考（决策指南类）
3. 户型缺角：别被中介忽悠了（辟谣+实用类）

🛠️ 工具机会：
- 楼层选择计算器（简单工具，潜在变现）
- 户型风水自测工具（引流工具）

📌 竞品动态：
- @XXX 发布卧室布局内容，获XX赞
- 建议跟进话题：儿童房风水
```

## 待优化项

- [ ] 浏览器修复后，增加 X 话题监控
- [ ] 竞品账号追踪系统
- [ ] 自动化外联互动

## 成本估算

- RSS抓取：0 token（纯HTTP请求）
- AI分析：~500 token/天
- 月度成本：~¥1-2

---

*状态：待实施*
