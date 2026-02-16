const { chromium } = require('playwright');

async function testVisibleBrowser() {
  console.log('🚀 启动可见浏览器...');
  
  const browser = await chromium.launch({ 
    headless: false,  // 强制显示浏览器窗口
    args: ['--window-size=1280,720']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  console.log('📱 访问 Twitter 登录页...');
  await page.goto('https://twitter.com/i/flow/login');
  
  console.log('✅ 浏览器已打开，请手动登录 Twitter');
  console.log('登录成功后，脚本会继续执行发推...');
  
  // 等待用户手动登录（给你60秒时间）
  await page.waitForTimeout(60000);
  
  // 检查是否已登录（通过查找发推按钮）
  const tweetButton = await page.locator('a[href="/compose/tweet"]').first();
  if (await tweetButton.isVisible().catch(() => false)) {
    console.log('✅ 检测到已登录，前往发推页面...');
    await tweetButton.click();
  } else {
    console.log('⏳ 未检测到登录状态，尝试直接访问发推页面...');
    await page.goto('https://twitter.com/compose/tweet');
  }
  
  await page.waitForTimeout(3000);
  
  // 尝试多种方式找到输入框
  console.log('📝 寻找推文输入框...');
  
  // 方法1：通过 placeholder 文本
  const editor1 = await page.locator('div[contenteditable="true"]').first();
  // 方法2：通过 aria-label
  const editor2 = await page.locator('[aria-label="Tweet text"]').first();
  // 方法3：通过 role
  const editor3 = await page.locator('[role="textbox"]').first();
  
  let editor = editor1;
  try {
    await editor.waitFor({ timeout: 5000 });
  } catch {
    editor = editor2;
    try {
      await editor.waitFor({ timeout: 5000 });
    } catch {
      editor = editor3;
    }
  }
  
  // 输入推文
  const tweetText = `今天见了个程序员客户

"大师，我天天失眠，数羊数到草原都秃了"

我一进卧室就明白了——床头正对着大窗户，窗帘还透光

"你这床得换个方向，头不能朝窗，光煞影响睡眠"

客户："难怪我做梦都在飘" 😂

你家床头是怎么摆的？评论区聊聊

#风水 #玄学 #一宅一句 #卧室 #睡眠 #真实故事 #道长`;
  
  await editor.fill(tweetText);
  console.log('✅ 推文内容已输入');
  
  await page.waitForTimeout(2000);
  
  // 寻找发布按钮
  console.log('📤 点击发布...');
  const postButton = await page.locator('button:has-text("Post")').first();
  await postButton.click();
  
  await page.waitForTimeout(3000);
  console.log('✅ 操作完成！');
  
  // 保存登录状态
  await context.storageState({ path: './twitter-auth.json' });
  console.log('💾 登录状态已保存');
  
  await browser.close();
}

testVisibleBrowser().catch(err => {
  console.error('❌ 错误:', err.message);
  process.exit(1);
});
