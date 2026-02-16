#!/usr/bin/env node

/**
 * B站弹幕监控技能
 * 监控B站直播弹幕，支持多房间、关键词告警
 */

const http = require('http');
const https = require('https');

// B站API
const API = {
  getLiveInfo: (roomId) => `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}`,
  getDanmaku: (roomId) => `https://api.live.bilibili.com/xlive/web-room/v1/dm/get历史弹幕?room_id=${roomId}&ps=50`
};

class BilibiliDanmaku {
  constructor() {
    this.rooms = new Map();
    this.keywordAlerts = new Map();
  }

  // 获取直播间信息
  async getLiveInfo(roomId) {
    return this.request(API.getLiveInfo(roomId));
  }

  // 获取弹幕
  async getDanmaku(roomId) {
    const data = await this.request(API.getDanmaku(roomId));
    if (data.code === 0 && data.data) {
      return data.data.map(d => ({
        text: d.content,
        user: d.uname,
        time: d.ctime,
        color: d.color
      }));
    }
    return [];
  }

  // HTTP请求封装
  request(url) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      client.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch(e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  }

  // 添加监控房间
  addRoom(roomId, keywords = []) {
    this.rooms.set(roomId, { keywords, lastTime: 0 });
  }

  // 监控所有房间
  async monitor() {
    const results = [];
    for (const [roomId, config] of this.rooms) {
      try {
        const danmakus = await this.getDanmaku(roomId);
        for (const dm of danmakus) {
          if (dm.time > config.lastTime) {
            // 检查关键词
            if (config.keywords.some(k => dm.text.includes(k))) {
              results.push({
                type: 'alert',
                room: roomId,
                danmaku: dm
              });
            }
            results.push({ type: 'danmaku', room: roomId, danmaku: dm });
          }
        }
        config.lastTime = danmakus[0]?.time || config.lastTime;
      } catch(e) {
        results.push({ type: 'error', room: roomId, error: e.message });
      }
    }
    return results;
  }
}

module.exports = BilibiliDanmaku;
