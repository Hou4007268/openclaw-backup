const { chromium } = require('playwright');

async function loginWithStealth() {
  console.log('🚀 启动伪装浏览器...');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai'
  });
  
  // 注入脚本隐藏自动化特征
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined
    });
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5]
    });
  });
  
  const page = await context.newPage();
  
  console.log('📱 访问 Twitter...');
  await page.goto('https://twitter.com/login');
  
  console.log('⏳ 请完成登录（60秒）...');
  await page.waitForTimeout(60000);
  
  // 保存状态
  await context.storageState({ path: './twitter-auth.json' });
  console.log('✅ 登录状态已保存！');
  
  await browser.close();
}

loginWithStealth();
