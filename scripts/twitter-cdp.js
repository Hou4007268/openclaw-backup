const { chromium } = require('playwright');

async function useExistingChrome() {
  console.log('🚀 连接到已登录的 Chrome...');
  
  // 连接到本地已运行的 Chrome
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  
  const context = browser.contexts()[0] || await browser.newContext();
  const page = await context.newPage();
  
  console.log('📱 访问 Twitter...');
  await page.goto('https://twitter.com/compose/tweet');
  await page.waitForTimeout(3000);
  
  console.log('📝 输入推文...');
  const tweetText = `今天见了个程序员客户

"大师，我天天失眠，数羊数到草原都秃了"

我一进卧室就明白了——床头正对着大窗户，窗帘还透光

"你这床得换个方向，头不能朝窗，光煞影响睡眠"

客户："难怪我做梦都在飘" 😂

你家床头是怎么摆的？评论区聊聊

#风水 #玄学 #一宅一句 #卧室 #睡眠 #真实故事 #道长`;
  
  await page.locator('div[contenteditable="true"]').first().fill(tweetText);
  await page.waitForTimeout(2000);
  
  console.log('📤 发布...');
  await page.locator('button:has-text("Post")').first().click();
  
  console.log('✅ 推文已发布！');
  await page.waitForTimeout(3000);
  await browser.close();
}

useExistingChrome().catch(err => {
  console.error('❌ 错误:', err.message);
  console.log('提示: 请确保 Chrome 已开启远程调试端口 9222');
  console.log('启动方式: /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222');
});
