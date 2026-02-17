#!/usr/bin/env node

/**
 * Token Reporter Plugin
 * 每日Token消耗报告 - 自动统计AI使用量
 * 
 * 使用方式:
 *   node token-reporter.js [--report] [--status]
 * 
 * 配置:
 *   设置 cron job 定时执行: 每天 08:00
 */

const fs = require('fs');
const path = require('path');

const OPENCLAW_DIR = process.env.OPENCLAW_STATE_DIR || path.join(process.env.HOME || '/Users/yachaolailo', '.openclaw');
const AGENTS_DIR = path.join(OPENCLAW_DIR, 'agents');
const LOGS_DIR = path.join(OPENCLAW_DIR, 'logs');

// 模型单价 (单位: 每百万token $)
const MODEL_COSTS = {
  'minimax-portal': { input: 0, output: 0 },      // 免费
  'minimax': { input: 0.15, output: 0.60 },      // $0.15/M input, $0.60/M output
  'moonshot': { input: 0.03, output: 0.15 },     // $0.03/M input, $0.15/M output
  'deepseek': { input: 0.14, output: 0.28 },     // $0.14/M input, $0.28/M output
  'HodlAI': { input: 0.50, output: 1.50 }        // $0.50/M input, $1.50/M output
};

/**
 * 获取所有Agent目录
 */
function getAgentDirs() {
  if (!fs.existsSync(AGENTS_DIR)) return [];
  
  return fs.readdirSync(AGENTS_DIR)
    .filter(name => {
      const agentPath = path.join(AGENTS_DIR, name);
      return fs.statSync(agentPath).isDirectory() && fs.existsSync(path.join(agentPath, 'sessions'));
    })
    .map(name => ({
      name,
      dir: path.join(AGENTS_DIR, name),
      sessionsDir: path.join(AGENTS_DIR, name, 'sessions')
    }));
}

/**
 * 解析会话JSONL文件获取Token使用量
 */
function getSessionTokens(sessionsDir) {
  if (!fs.existsSync(sessionsDir)) return { input: 0, output: 0, total: 0, cacheRead: 0, cacheWrite: 0 };
  
  let totalInput = 0;
  let totalOutput = 0;
  let totalCacheRead = 0;
  let totalCacheWrite = 0;
  
  try {
    const files = fs.readdirSync(sessionsDir).filter(f => f.endsWith('.jsonl'));
    
    for (const file of files) {
      const filePath = path.join(sessionsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const data = JSON.parse(line);
          // usage can be at data.usage or data.message.usage
          const usage = data.usage || (data.message && data.message.usage);
          if (usage) {
            totalInput += usage.input || 0;
            totalOutput += usage.output || 0;
            totalCacheRead += usage.cacheRead || 0;
            totalCacheWrite += usage.cacheWrite || 0;
          }
        } catch (e) {
          // Skip invalid JSON lines
        }
      }
    }
  } catch (e) {
    // Ignore errors
  }
  
  return {
    input: totalInput,
    output: totalOutput,
    total: totalInput + totalOutput,
    cacheRead: totalCacheRead,
    cacheWrite: totalCacheWrite
  };
}

/**
 * 解析Gateway日志获取API调用统计
 */
function parseGatewayLogs() {
  const logFile = path.join(LOGS_DIR, 'gateway.log');
  if (!fs.existsSync(logFile)) return { calls: 0, providers: {} };
  
  const stats = { calls: 0, providers: {} };
  const content = fs.readFileSync(logFile, 'utf8');
  const lines = content.split('\n');
  
  for (const line of lines) {
    // 查找API调用日志
    if (line.includes('provider') && line.includes('model')) {
      stats.calls++;
      for (const provider of Object.keys(MODEL_COSTS)) {
        if (line.includes(provider)) {
          stats.providers[provider] = (stats.providers[provider] || 0) + 1;
          break;
        }
      }
    }
  }
  
  return stats;
}

/**
 * 格式化Token数量
 */
function formatTokens(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(2) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
}

/**
 * 计算费用 (假设主要使用免费服务)
 */
function calculateCost(provider, inputTokens, outputTokens) {
  const costs = MODEL_COSTS[provider] || { input: 0, output: 0 };
  
  const inputCost = (inputTokens / 1000000) * costs.input;
  const outputCost = (outputTokens / 1000000) * costs.output;
  
  return inputCost + outputCost;
}

/**
 * 生成报告
 */
function generateReport() {
  const report = [];
  
  report.push('📊 Token消耗报告\n');
  report.push(`🕒 生成时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n`);
  
  const agents = getAgentDirs();
  let totalInput = 0;
  let totalOutput = 0;
  let totalCacheRead = 0;
  let totalCacheWrite = 0;
  let totalCost = 0;
  
  report.push('📁 Agent使用情况:\n');
  report.push('| Agent | Input | Output | Cache | Total |');
  report.push('|-------|-------|--------|-------|-------|');
  
  for (const agent of agents) {
    const tokens = getSessionTokens(agent.sessionsDir);
    const input = tokens.input;
    const output = tokens.output;
    const cache = tokens.cacheRead + tokens.cacheWrite;
    const total = tokens.total;
    
    // 假设主要使用 minimax-portal (免费)
    const cost = calculateCost('minimax-portal', input, output);
    
    if (total > 0) {
      totalInput += input;
      totalOutput += output;
      totalCacheRead += tokens.cacheRead;
      totalCacheWrite += tokens.cacheWrite;
      totalCost += cost;
      
      report.push(`| ${agent.name.padEnd(6)} | ${formatTokens(input).padEnd(7)} | ${formatTokens(output).padEnd(7)} | ${formatTokens(cache).padEnd(6)} | ${formatTokens(total).padEnd(5)} |`);
    }
  }
  
  report.push('\n📈 总计:\n');
  report.push(`  Input:     ${formatTokens(totalInput)} tokens`);
  report.push(`  Output:    ${formatTokens(totalOutput)} tokens`);
  report.push(`  Cache R:   ${formatTokens(totalCacheRead)} tokens`);
  report.push(`  Cache W:   ${formatTokens(totalCacheWrite)} tokens`);
  report.push(`  ─────────────────`);
  report.push(`  Total:     ${formatTokens(totalInput + totalOutput)} tokens`);
  report.push(`  Cost:      $${totalCost.toFixed(4)}\n`);
  
  // API调用统计
  const logStats = parseGatewayLogs();
  report.push('🔗 API调用统计:\n');
  report.push(`  总调用次数: ${logStats.calls}`);
  for (const [provider, count] of Object.entries(logStats.providers)) {
    report.push(`  - ${provider}: ${count} 次`);
  }
  
  // 今日统计 (当天文件)
  const today = new Date().toISOString().split('T')[0];
  report.push(`\n📅 今日消耗估算 (基于 ${today}):`);
  const todayEstimate = Math.max(1, Math.floor(logStats.calls / 3));
  report.push(`  约 ${todayEstimate} 次 API 调用`);
  
  const output = report.join('\n');
  console.log(output);
  
  return {
    input: totalInput,
    output: totalOutput,
    total: totalInput + totalOutput,
    cost: totalCost,
    agents: agents.length,
    apiCalls: logStats.calls,
    output
  };
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.length === 0) {
    console.log(`
🔧 Token Reporter - 每日Token消耗报告

用法:
  node token-reporter.js --report     生成完整报告
  node token-reporter.js --status     简洁状态
  node token-reporter.js --json       JSON格式输出 (适合程序处理)
  node token-reporter.js --help       显示帮助

定时任务:
  # 每天 08:00 执行
  0 8 * * * cd /path/to/plugins/token-reporter && node token-reporter.js --report

环境变量:
  OPENCLAW_DIR    OpenClaw状态目录 (默认: ~/.openclaw)
`);
    return;
  }
  
  if (args.includes('--report')) {
    generateReport();
  } else if (args.includes('--status')) {
    const result = generateReport();
    console.log(`\n✅ 状态: ${result.total} tokens, $${result.cost.toFixed(4)}`);
  } else if (args.includes('--json')) {
    const result = generateReport();
    console.log('\n' + JSON.stringify(result, null, 2));
  }
}

main();
