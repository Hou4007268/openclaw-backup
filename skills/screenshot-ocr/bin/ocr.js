#!/usr/bin/env node

/**
 * 截图OCR识别技能
 * 使用macOS内置OCR或Tesseract
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class OCREngine {
  constructor() {
    this.platform = process.platform;
  }

  // macOS使用screencapture + 内置OCR
  async macOSOCR(imagePath) {
    // 方案1: 使用TextSniper.app (需要安装)
    // 方案2: 使用tesseract
    try {
      const result = execSync(`tesseract "${imagePath}" - --tessdata-dir=/usr/local/share/tessdata 2>/dev/null`, {
        encoding: 'utf8',
        timeout: 30000
      });
      return result.trim();
    } catch(e) {
      return this.fallbackOCR(imagePath);
    }
  }

  // 备选方案
  async fallbackOCR(imagePath) {
    // 使用QuickLook生成PDF然后OCR
    const tempPdf = `/tmp/ocr_${Date.now()}.pdf`;
    try {
      execSync(`qlmanage -t -s 1200 -o /tmp "${imagePath}" 2>/dev/null`);
      // 这里需要额外工具，返回提示
      return "需要安装tesseract: brew install tesseract";
    } catch(e) {
      return "OCR失败: " + e.message;
    }
  }

  // 截取屏幕
  async captureScreen() {
    const tempFile = `/tmp/screenshot_${Date.now()}.png`;
    execSync(`screencapture -i "${tempFile}" 2>/dev/null`);
    return tempFile;
  }

  // 主识别流程
  async recognize(imagePath) {
    if (!imagePath) {
      imagePath = await this.captureScreen();
    }
    
    if (!fs.existsSync(imagePath)) {
      return { error: '图片不存在' };
    }

    const text = await this.macOSOCR(imagePath);
    
    // 清理临时文件
    if (imagePath.startsWith('/tmp/')) {
      try { fs.unlinkSync(imagePath); } catch(e) {}
    }

    return {
      success: true,
      text,
      length: text.length
    };
  }
}

module.exports = OCREngine;
