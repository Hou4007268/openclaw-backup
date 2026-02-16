const { chromium } = require('playwright');

async function postWithSavedAuth() {
  console.log('🚀 启动浏览器...');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  
  const context = await browser.newContext({
    storageState: './twitter-auth.json',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  console.log('📱 访问 Twitter...');
  await page.goto('https://twitter.com/compose/tweet');
  
  // 等待页面完全加载
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  const url = page.url();
  console.log('当前URL:', url);
  
  if (url.includes('login')) {
    console.log('❌ 登录状态失效');
    await browser.close();
    return;
  }
  
  console.log('✅ 已登录，准备发推...');
  
  // 等待输入框出现
  console.log('📝 等待输入框...');
  await page.locator('div[contenteditable="true"]').first().waitFor({ timeout: 10000 });
  
  const tweetText = `今天见了个程序员客户

"大师，我天天失眠，数羊数到草原都秃了"

我一进卧室就明白了——床头正对着大窗户，窗帘还透光

"你这床得换个方向，头不能朝窗，光煞影响睡眠"

客户："难怪我做梦都在飘" 😂

你家床头是怎么摆的？评论区聊聊

#风水 #玄学 #一宅一句 #卧室 #睡眠 #真实故事 #道长`;
  
  await page.locator('div[contenteditable="true"]').first().fill(tweetText);
  console.log('✅ 推文已输入');
  
  // 等待按钮可用
  await page.waitForTimeout(3000);
  
  // 发布（尝试多种方式）
  console.log('📤 点击发布...');
  try {
    // 方式1：通过 data-testid
    await page.locator('[data-testid="tweetButton"]').first().click({ timeout: 5000 });
  } catch {
    try {
      // 方式2：通过文本 Post
      await page.locator('button:has-text("Post")').first().click({ timeout: 5000 });
    } catch {
      // 方式3：通过文本 Tweet
      await page.locator('button:has-text("Tweet")').first().click({ timeout: 5000 });
    }
  }
  
  console.log('✅ 推文发布成功！');
  await page.waitForTimeout(3000);
  await browser.close();
}

postWithSavedAuth();
