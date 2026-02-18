#!/usr/bin/env node
/**
 * 自动创建Issue脚本
 * 用法: node scripts/create-issue.js --title "标题" --desc "描述" --priority P1
 */

const fs = require('fs');
const path = require('path');

const ISSUES_DIR = path.join(__dirname, '..', 'issues');

// 解析参数
const args = process.argv.slice(2);
let title = '';
let desc = '';
let priority = 'P2';
let source = 'Cron';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--title' && args[i + 1]) title = args[i + 1];
  if (args[i] === '--desc' && args[i + 1]) desc = args[i + 1];
  if (args[i] === '--priority' && args[i + 1]) priority = args[i + 1];
  if (args[i] === '--source' && args[i + 1]) source = args[i + 1];
}

if (!title) {
  console.log('用法: node create-issue.js --title "标题" --desc "描述" --priority P1 --source Cron');
  process.exit(1);
}

const date = new Date().toISOString().slice(0, 10);
const filename = `${date}-${title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)}.md`;

const content = `# Issue: ${title}

**状态**: open

**优先级**: ${priority}

**来源**: ${source}

**描述**: 
${desc}

**行动项**:
- [ ] 行动1
- [ ] 行动2

---

**创建时间**: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}  
**更新时间**: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
`;

const filepath = path.join(ISSUES_DIR, 'open', filename);
fs.writeFileSync(filepath, content);

console.log(`✅ Issue已创建: issues/open/${filename}`);
