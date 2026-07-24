const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();

  const generateIcon = async (size, outputPath) => {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    const logoPath = 'file:///' + path.resolve(__dirname, 'public', 'gohannavi-icon.png').replace(/\\/g, '/');

    const borderWidth = Math.max(4, Math.round(size * 0.04));
    const padding = Math.round(size * 0.14);
    const badgePadding = Math.round(size * 0.08);

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
            padding: ${padding}px;
            overflow: hidden;
            font-family: system-ui, sans-serif;
          }
          .icon-box {
            width: 100%;
            height: 100%;
            background-color: #FFFFFF;
            border: ${borderWidth}px solid #111111;
            border-radius: ${Math.round(size * 0.16)}px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: ${badgePadding}px;
            box-shadow: ${Math.round(size * 0.03)}px ${Math.round(size * 0.03)}px 0px #111111;
          }
          .icon-box img {
            width: 85%;
            height: 85%;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <div class="icon-box">
          <img src="${logoPath}" alt="ごはんなび" />
        </div>
      </body>
      </html>
    `);

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
  console.log('All app icons generated successfully!');
})();
