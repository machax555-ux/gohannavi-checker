const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();

  const logoPath = path.join(__dirname, 'public', 'rogo11.png');
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  const logoDataUri = `data:image/png;base64,${logoBase64}`;

  const generateIcon = async (size, outputPath) => {
    const page = await browser.newPage({ viewport: { width: size, height: size } });

    const borderWidth = Math.max(4, Math.round(size * 0.04));

    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            width: ${size}px;
            height: ${size}px;
            background-color: #F5CE42;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: ${borderWidth}px;
            overflow: hidden;
            font-family: sans-serif;
          }
          .outer-card {
            width: 100%;
            height: 100%;
            background-color: #121212;
            border: ${borderWidth}px solid #111111;
            border-radius: ${Math.round(size * 0.22)}px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: ${Math.round(size * 0.06)}px;
          }
          .emblem-img {
            width: 85%;
            height: 85%;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <div class="outer-card">
          <img src="${logoDataUri}" class="emblem-img" alt="FOOD CHECKER Logo" />
        </div>
      </body>
      </html>
    `);

    await page.waitForTimeout(400);
    await page.screenshot({ path: outputPath, type: 'png' });
    console.log(`Generated ${size}x${size} icon at ${outputPath}`);
    await page.close();
  };

  const publicDir = path.resolve(__dirname, 'public');
  const appDir = path.resolve(__dirname, 'app');

  await generateIcon(192, path.join(publicDir, 'icon-192.png'));
  await generateIcon(512, path.join(publicDir, 'icon-512.png'));
  await generateIcon(180, path.join(publicDir, 'apple-icon.png'));
  await generateIcon(180, path.join(publicDir, 'apple-touch-icon.png'));
  await generateIcon(192, path.join(appDir, 'icon.png'));
  await generateIcon(180, path.join(appDir, 'apple-icon.png'));

  await browser.close();
  console.log('All PWA app icons restored using high-res rogo11.png emblem!');
})();
