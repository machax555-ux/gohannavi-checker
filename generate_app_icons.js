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

    const borderWidth = Math.max(8, Math.round(size * 0.08));
    const cardPadding = Math.round(size * 0.06);

    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@900&display=swap" rel="stylesheet">
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
            font-family: 'Unbounded', sans-serif;
          }
          .outer-card {
            width: 100%;
            height: 100%;
            background-color: #121212;
            border: ${Math.round(size * 0.04)}px solid #111111;
            border-radius: ${Math.round(size * 0.18)}px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: ${cardPadding}px;
            box-shadow: 0 0 0 ${Math.round(size * 0.02)}px #111111;
          }
          .content-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: ${Math.round(size * 0.03)}px;
            width: 100%;
          }
          .line1 {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: ${Math.round(size * 0.035)}px;
            width: 100%;
          }
          .food-text {
            font-size: ${Math.round(size * 0.15)}px;
            color: #F5CE42;
            line-height: 1;
            font-weight: 900;
            letter-spacing: -0.03em;
          }
          .emblem-img {
            height: ${Math.round(size * 0.23)}px;
            width: auto;
            object-fit: contain;
            filter: drop-shadow(0px 2px 5px rgba(0,0,0,0.6));
          }
          .line2 {
            font-size: ${Math.round(size * 0.175)}px;
            color: #FFFFFF;
            line-height: 1;
            font-weight: 900;
            letter-spacing: -0.03em;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="outer-card">
          <div class="content-container">
            <div class="line1">
              <span class="food-text">FOOD</span>
              <img src="${logoDataUri}" class="emblem-img" alt="rogo11" />
            </div>
            <div class="line2">CHECK</div>
          </div>
        </div>
      </body>
      </html>
    `);

    // Wait for Unbounded font and emblem image to render
    await page.waitForTimeout(600);

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
  console.log('All PWA app icons generated with larger rogo11.png emblem!');
})();
