const { chromium } = require('playwright');
const path = require('path');
const { spawn } = require('child_process');

(async () => {
  console.log('Starting Next.js server on port 3009...');
  const server = spawn('npx', ['next', 'start', '-p', '3009'], {
    cwd: __dirname,
    shell: true,
    stdio: 'ignore'
  });

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 4000));

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2,
  });

  const outputDir = 'C:\\Users\\masas\\Desktop\\hallmark_unbounded_5_pro_designs';

  // Render Page 1 (Home)
  console.log('Rendering http://localhost:3009/ -> sample_8_swiss_70s_page1_home.jpeg...');
  await page.goto('http://localhost:3009/', { waitUntil: 'networkidle' });
  await page.screenshot({
    path: path.join(outputDir, 'sample_8_swiss_70s_page1_home.jpeg'),
    type: 'jpeg',
    quality: 90
  });

  // Render Page 2 (Scan)
  console.log('Rendering http://localhost:3009/scan -> sample_8_swiss_70s_page2_scan.jpeg...');
  await page.goto('http://localhost:3009/scan', { waitUntil: 'networkidle' });
  await page.screenshot({
    path: path.join(outputDir, 'sample_8_swiss_70s_page2_scan.jpeg'),
    type: 'jpeg',
    quality: 90
  });

  // Render Page 3 (Result)
  console.log('Rendering http://localhost:3009/result -> sample_8_swiss_70s_page3_result.jpeg...');
  await page.goto('http://localhost:3009/result', { waitUntil: 'networkidle' });
  await page.screenshot({
    path: path.join(outputDir, 'sample_8_swiss_70s_page3_result.jpeg'),
    type: 'jpeg',
    quality: 90
  });

  // Render Page 4 (Search)
  console.log('Rendering http://localhost:3009/search -> sample_8_swiss_70s_page4_search.jpeg...');
  await page.goto('http://localhost:3009/search', { waitUntil: 'networkidle' });
  await page.screenshot({
    path: path.join(outputDir, 'sample_8_swiss_70s_page4_search.jpeg'),
    type: 'jpeg',
    quality: 90
  });

  await browser.close();
  server.kill();
  console.log('All 4 Swiss 70s design JPEG samples successfully rendered!');
  process.exit(0);
})();
