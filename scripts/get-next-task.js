#!/usr/bin/env node
/**
 * 子代理任务拉取脚本
 * 用法: node scripts/get-next-task.js
 * 输出: 第一个open issue的内容
 */

const fs = require('fs');
const path = require('path');

const ISSUES_DIR = path.join(__dirname, '..', 'issues', 'open');

function getNextTask() {
  if (!fs.existsSync(ISSUES_DIR)) {
    return null;
  }
  
  const files = fs.readdirSync(ISSUES_DIR)
    .filter(f => f.endsWith('.md') && f !== 'TEMPLATE.md')
    .sort();
  
  if (files.length === 0) {
    return null;
  }
  
  const content = fs.readFileSync(
    path.join(ISSUES_DIR, files[0]), 
    'utf-8'
  );
  
  return {
    file: files[0],
    content
  };
}

const task = getNextTask();
if (task) {
  console.log(`📋 任务: ${task.file}`);
  console.log('---');
  console.log(task.content);
} else {
  console.log('✅ 暂无待办任务');
}
