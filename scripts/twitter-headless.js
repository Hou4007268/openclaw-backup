const { chromium } = require('playwright');

async function postTweetHeadless() {
  console.log('🚀 启动 headless 浏览器...');
  
  const browser = await chromium.launch({ 
    headless: true  // 后台模式，更稳定
  });
  
  try {
    // 尝试加载已保存的登录状态
    let context;
    try {
      context = await browser.newContext({
        storageState: './twitter-auth.json'
      });
      console.log('✅ 使用已保存的登录状态');
    } catch {
      context = await browser.newContext();
      console.log('⚠️ 没有登录状态，需要手动登录');
    }
    
    const page = await context.newPage();
    
    // 访问 Twitter
    console.log('📱 访问 Twitter...');
    await page.goto('https://twitter.com/compose/tweet');
    await page.waitForTimeout(3000);
    
    // 检查是否需要登录
    const url = page.url();
    if (url.includes('login')) {
      console.log('❌ 需要登录 Twitter');
      console.log('请手动登录后，保存状态再试');
      await browser.close();
      return;
    }
    
    // 输入推文
    console.log('📝 输入推文...');
    const tweetText = `今天见了个程序员客户

"大师，我天天失眠，数羊数到草原都秃了"

我一进卧室就明白了——床头正对着大窗户，窗帘还透光

"你这床得换个方向，头不能朝窗，光煞影响睡眠"

客户："难怪我做梦都在飘" 😂

你家床头是怎么摆的？评论区聊聊

#风水 #玄学 #一宅一句 #卧室 #睡眠 #真实故事 #道长`;
    
    // 多种方式尝试找到输入框
    const selectors = [
      'div[contenteditable="true"]',
      '[data-testid="tweetTextarea_0"]',
      '[aria-label="Tweet text"]',
      '[role="textbox"]'
    ];
    
    let editor = null;
    for (const selector of selectors) {
      try {
        editor = await page.locator(selector).first();
        await editor.waitFor({ timeout: 5000 });
        console.log(`✅ 找到输入框: ${selector}`);
        break;
      } catch {
        continue;
      }
    }
    
    if (!editor) {
      console.error('❌ 找不到推文输入框');
      await page.screenshot({ path: './twitter-error.png' });
      console.log('已保存错误截图: ./twitter-error.png');
      return;
    }
    
    await editor.fill(tweetText);
    console.log('✅ 推文已输入');
    
    await page.waitForTimeout(2000);
    
    // 点击发布
    console.log('📤 点击发布...');
    const postButton = await page.locator('button:has-text("Post")').first();
    await postButton.click();
    
    await page.waitForTimeout(3000);
    console.log('✅ 推文发布成功！');
    
    // 保存登录状态
    await context.storageState({ path: './twitter-auth.json' });
    console.log('💾 登录状态已保存');
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    await page.screenshot({ path: './twitter-error.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
}

postTweetHeadless();
