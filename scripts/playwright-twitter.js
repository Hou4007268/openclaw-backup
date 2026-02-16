const { chromium } = require('playwright');

// Twitter 发布测试脚本
async function postToTwitter(text) {
  console.log('🚀 启动 Playwright...');
  
  const browser = await chromium.launch({ 
    headless: false, // 先设为 false 便于调试，稳定后改为 true
    slowMo: 100 
  });
  
  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    
    // 访问 Twitter
    console.log('📱 访问 Twitter...');
    await page.goto('https://twitter.com/login');
    
    // 等待用户登录（首次需要）
    console.log('⏳ 等待登录...');
    await page.waitForTimeout(5000);
    
    // 访问发推页面
    await page.goto('https://twitter.com/compose/tweet');
    await page.waitForTimeout(3000);
    
    // 输入推文内容
    console.log('📝 输入推文...');
    const editor = await page.locator('[data-testid="tweetTextarea_0"]').first();
    await editor.fill(text);
    await page.waitForTimeout(1000);
    
    // 点击发布按钮
    console.log('📤 点击发布...');
    const postButton = await page.locator('[data-testid="tweetButton"]').first();
    await postButton.click();
    
    // 等待发布完成
    await page.waitForTimeout(3000);
    console.log('✅ 推文发布成功！');
    
    // 保存登录状态（下次自动登录）
    await context.storageState({ path: './twitter-auth.json' });
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    await browser.close();
  }
}

// 测试内容
const tweetText = `今天见了个程序员客户

"大师，我天天失眠，数羊数到草原都秃了"

我一进卧室就明白了——床头正对着大窗户，窗帘还透光

"你这床得换个方向，头不能朝窗，光煞影响睡眠"

风水上床头宜实不宜虚，窗户是虚，墙面是实，头朝墙才有靠山感

客户："难怪我做梦都在飘" 😂

你家床头是怎么摆的？评论区聊聊

#风水 #玄学 #一宅一句 #卧室 #睡眠 #真实故事 #道长`;

postToTwitter(tweetText);
