const { chromium } = require('playwright');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

async function renderPages() {
  console.log('Starting Next.js server on port 3009...');
  const server = spawn('npx.cmd', ['next', 'start', '-p', '3009'], {
    cwd: __dirname,
    stdio: 'ignore',
    shell: true,
  });

  // Give server time to boot
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 920 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const desktopFolder = 'C:\\Users\\masas\\Desktop\\hallmark_unbounded_5_pro_designs';
  const brainFolder = 'C:\\Users\\masas\\.gemini\\antigravity\\brain\\11b08e98-f4de-4d11-9a0c-c2f4be05f64f';

  const pagesToRender = [
    { url: 'http://localhost:3009/', filename: 'sample_8_swiss_70s_page1_home.jpeg' },
    { url: 'http://localhost:3009/scan', filename: 'sample_8_swiss_70s_page2_scan.jpeg' },
    { url: 'http://localhost:3009/result', filename: 'sample_8_swiss_70s_page3_result.jpeg' },
  ];

  for (const item of pagesToRender) {
    console.log(`Rendering ${item.url} -> ${item.filename}...`);
    await page.goto(item.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const desktopPath = path.join(desktopFolder, item.filename);
    const brainPath = path.join(brainFolder, item.filename);

    await page.screenshot({
      path: desktopPath,
      type: 'jpeg',
      quality: 95,
      fullPage: false,
    });

    if (fs.existsSync(brainFolder)) {
      fs.copyFileSync(desktopPath, brainPath);
    }
  }

  await browser.close();
  server.kill();
  console.log('All 3 Swiss 70s design JPEG samples successfully rendered!');
  process.exit(0);
}

renderPages().catch(err => {
  console.error(err);
  process.exit(1);
});
