import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "ごはんなび添加物チェッカー｜原材料を撮るだけで無添加判定",
  description: "食品の原材料名を撮影するだけで、AIが添加物を瞬時に判定。無添加の代替商品も提案します。",
  manifest: "/manifest.json",
  openGraph: {
    title: "ごはんなび添加物チェッカー｜原材料を撮るだけで無添加判定",
    description: "食品の原材料名を撮影するだけで、AIが添加物を瞬時に判定。無添加の代替商品も提案します。",
    type: "website",
    siteName: "ごはんなび添加物チェッカー",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "添加物チェッカー",
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
    <html lang="ja">
      <body className={`${notoSansJP.variable} antialiased min-h-screen bg-[#F5CE42] text-[#111111] selection:bg-[#111111] selection:text-[#F5CE42]`}>
        <div className="mx-auto max-w-[440px] min-h-screen bg-[#F5CE42] sm:border-x-3 sm:border-black flex flex-col relative overflow-x-hidden p-3 sm:p-5">
          {children}
        </div>
      </body>
    </html>
  );
}
