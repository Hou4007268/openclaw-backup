#!/usr/bin/env node
/**
 * 子代理启动时自动拉取任务
 * 在调用子代理前运行此脚本，获取下一个待办任务
 */

const fs = require('fs');
const path = require('path');

const ISSUES_DIR = path.join(__dirname, '..', 'issues', 'open');

function getNextTaskPrompt() {
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
  
  return `📋 当前待办任务:\n\n${content}`;
}

const task = getNextTaskPrompt();
if (task) {
  console.log(task);
} else {
  console.log('✅ 暂无待办任务');
}
