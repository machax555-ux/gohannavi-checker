import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Unbounded } from "next/font/google";
import fs from "fs";
import path from "path";
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

function getLogoBase64(): string {
  try {
    const logoPath = path.join(process.cwd(), "public", "rogo11.png");
    const buffer = fs.readFileSync(logoPath);
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch (e) {
    return "/rogo11.png";
  }
}

const logoBase64 = getLogoBase64();

export const metadata: Metadata = {
  title: "FOOD CHECKER | ごはんなび食品添加物チェッカー",
  description: "原材料を撮るだけで気になる添加物をAIが瞬時に検出。安全な無添加商品の購入までフルサポート。",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: logoBase64, type: "image/png" }],
    apple: [{ url: logoBase64, type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "食品添加物をチェック",
  },
};

export const viewport: Viewport = {
  themeColor: "#F5CE42",
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
        <link rel="icon" href={logoBase64} type="image/png" />
        <link rel="apple-touch-icon" href={logoBase64} />
        <link rel="apple-touch-icon-precomposed" href={logoBase64} />
      </head>
      <body
        className={`${notoSansJP.variable} ${unbounded.variable} antialiased h-full w-full overflow-hidden overscroll-none bg-[#F5CE42] text-[#111111] selection:bg-[#111111] selection:text-[#F5CE42] fixed inset-0`}
      >
        <div className="fixed inset-0 max-w-[440px] mx-auto h-[100dvh] max-h-[100dvh] overflow-hidden overscroll-none bg-[#F5CE42] sm:border-x-3 sm:border-black flex flex-col p-2.5 sm:p-3.5 justify-between select-none">
          {children}
        </div>
      </body>
    </html>
  );
}
