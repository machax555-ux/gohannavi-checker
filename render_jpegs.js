const { chromium } = require('playwright');
const path = require('path');

async function renderJpegSamples() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 900 },
    deviceScaleFactor: 2, // High resolution crisp rendering
  });
  const page = await context.newPage();

  const folder = 'C:\\Users\\masas\\Desktop\\hallmark_unbounded_5_pro_designs';

  const files = [
    { html: 'concept11_hallmark_monocle.html', jpeg: 'sample_11_hallmark_monocle.jpeg' },
    { html: 'concept12_hallmark_linear.html', jpeg: 'sample_12_hallmark_linear.jpeg' },
    { html: 'concept13_hallmark_stripe.html', jpeg: 'sample_13_hallmark_stripe.jpeg' },
    { html: 'concept14_hallmark_brutalist.html', jpeg: 'sample_14_hallmark_brutalist.jpeg' },
    { html: 'concept15_hallmark_atelier.html', jpeg: 'sample_15_hallmark_atelier.jpeg' },
  ];

  for (const item of files) {
    const filePath = 'file:///' + path.join(folder, item.html).replace(/\\/g, '/');
    console.log(`Rendering ${item.html} -> ${item.jpeg}...`);
    await page.goto(filePath, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(folder, item.jpeg),
      type: 'jpeg',
      quality: 95,
      fullPage: false,
    });
  }

  await browser.close();
  console.log('All 5 Hallmark Pro JPEG design sample images (sample_11 ~ sample_15) successfully created!');
}

renderJpegSamples().catch(err => {
  console.error(err);
  process.exit(1);
});
