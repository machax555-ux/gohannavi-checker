import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "ごはんなび | 食品添加物チェッカー",
  description: "原材料を撮るだけで気になる添加物をAIが瞬時に検出。安全な無添加商品の購入までフルサポート。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
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
      <body
        className={`${notoSansJP.variable} antialiased min-h-[100dvh] bg-[#F5CE42] text-[#111111] selection:bg-[#111111] selection:text-[#F5CE42]`}
      >
        <div className="mx-auto max-w-[440px] min-h-[100dvh] bg-[#F5CE42] sm:border-x-3 sm:border-black flex flex-col relative p-3.5 sm:p-4 justify-between overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
