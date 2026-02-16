const { chromium } = require('playwright');

async function loginAndSave() {
  console.log('🚀 启动浏览器进行登录...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('📱 请登录 Twitter...');
  await page.goto('https://twitter.com/login');
  
  console.log('⏳ 等待 60 秒让你完成登录...');
  await page.waitForTimeout(60000);
  
  // 保存登录状态
  await context.storageState({ path: './twitter-auth.json' });
  console.log('✅ 登录状态已保存到 twitter-auth.json');
  console.log('下次就可以自动发推了！');
  
  await browser.close();
}

loginAndSave();
