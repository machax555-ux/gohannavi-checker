import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Unbounded } from "next/font/google";
import fs from "fs";
import path from "path";
import Script from "next/script";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

function getFoodCheckerIconBase64(): string {
  try {
    const iconPath = path.join(process.cwd(), "public", "pwa-icon.png");
    const buffer = fs.readFileSync(iconPath);
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch (e) {
    return "/pwa-icon.png";
  }
}

const foodCheckerIconBase64 = getFoodCheckerIconBase64();

export const metadata: Metadata = {
  title: "FOOD CHECKER | ごはんなび食品添加物チェッカー",
  description: "原材料を撮るだけで気になる添加物を瞬時に検出。安全な無添加商品の購入までフルサポート。",
  manifest: "/manifest.json?v=6",
  icons: {
    icon: [{ url: "/favicon-transparent.png?v=6", type: "image/png" }],
    apple: [{ url: foodCheckerIconBase64, type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "食品添加物をチェック",
  },
};

export const viewport: Viewport = {
  themeColor: "#FDFBF7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full overflow-hidden overscroll-none">
      <head>
        <link rel="icon" href="/favicon-transparent.png?v=6" type="image/png" />
        <link rel="shortcut icon" href="/favicon-transparent.png?v=6" type="image/png" />
        <link rel="apple-touch-icon" href={foodCheckerIconBase64} />
        <link rel="apple-touch-icon-precomposed" href={foodCheckerIconBase64} />
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5974007350632133"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          id="disable-auto-ads"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (window.adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: "ca-pub-5974007350632133",
                enable_page_level_ads: false
              });
            `,
          }}
        />
      </head>
      <body
        className={`${notoSansJP.variable} ${unbounded.variable} antialiased h-full w-full overflow-hidden overscroll-none bg-[#FDFBF7] text-[#111111] selection:bg-[#111111] selection:text-[#F5CE42] fixed inset-0`}
      >
        <div className="fixed inset-0 max-w-[440px] md:max-w-[1200px] mx-auto h-[100dvh] max-h-[100dvh] overflow-hidden overscroll-none bg-[#FDFBF7] sm:border-x-3 sm:border-black flex flex-col p-2.5 sm:p-3.5 md:p-6 justify-between select-none pc-scale-80">
          {children}
        </div>

        {/* Service Worker v6 Registration & Automatic Cache Purge Script */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js?v=6', { scope: '/' })
                    .then(function(registration) {
                      registration.update();
                    })
                    .catch(function(error) {
                      console.error('ServiceWorker registration failed:', error);
                    });
                });
              }
              if ('caches' in window) {
                caches.keys().then(function(names) {
                  for (let name of names) {
                    if (name !== 'food-checker-v6') {
                      caches.delete(name);
                    }
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
