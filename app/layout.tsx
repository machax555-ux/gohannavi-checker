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
  themeColor: "#2D6A4F",
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
      <body className={`${notoSansJP.variable} antialiased min-h-screen bg-[#F8F9FA] text-[#212529]`}>
        <div className="mx-auto max-w-[430px] min-h-screen bg-white shadow-xl flex flex-col relative overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
