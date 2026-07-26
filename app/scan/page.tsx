"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import CameraCapture from "@/components/CameraCapture";
import UsageLimit from "@/components/UsageLimit";
import AdBanner from "@/components/AdBanner";

export default function ScanPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [canUse, setCanUse] = useState(true);

  return (
    <main className="flex-1 flex flex-col justify-between gap-2 py-1 sm:py-2 max-w-full md:max-w-[800px] md:mx-auto w-full min-h-0 overflow-hidden">
      {/* Header Bar */}
      <header className="flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="bg-[#121212] text-white px-3 py-1.5 md:px-4 md:py-2 swiss-border text-xs md:text-sm font-black font-display tracking-wider flex items-center gap-1.5 hover:bg-[#EF4444] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span>HOME</span>
          </Link>
          <UsageLimit onLimitCheck={(valid) => setCanUse(valid)} />
        </div>

        <div className="flex flex-col gap-0.5 mt-0.5">
          <span className="font-display font-black text-xs md:text-sm text-[#111111] tracking-widest">
            01. SCANNER
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-[#111111] leading-none">
            撮影・入力画面
          </h1>
        </div>

        <div className="w-full h-[2px] sm:h-[3px] bg-[#111111]" />
      </header>

      {/* Error Banner */}
      {errorMsg && (
        <div className="swiss-card-coral p-3 text-xs md:text-sm font-extrabold flex items-start gap-2 shrink-0">
          <AlertCircle className="w-4 h-4 md:w-5 md:h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading State UI */}
      {loading ? (
        <div className="my-auto flex flex-col gap-3 sm:gap-4 w-full min-h-0">
          {/* Main Loading Status Card */}
          <div className="swiss-card-dark p-5 sm:p-6 md:p-8 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#F5CE42] text-[#111111] swiss-border flex items-center justify-center">
              <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin" />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <h2 className="font-display font-black text-lg sm:text-xl md:text-2xl text-[#F5CE42] tracking-wider leading-snug">
                原材料を判定中...
              </h2>
              <p className="text-xs sm:text-sm md:text-base font-extrabold text-white tracking-wide">
                少々お待ちください
              </p>
              <p className="text-xs sm:text-sm text-white/90 font-bold mt-1">
                食品添加物の抽出と安全性をスキャンしています
              </p>
              <p className="text-[9.5px] sm:text-[10.5px] text-white/70 font-bold text-center whitespace-nowrap tracking-tighter mt-1">
                ※撮影された画像や解析データはサーバーに保存・収集されることはありません
              </p>
            </div>
            <div className="w-full bg-white/20 h-2.5 sm:h-3 swiss-border-sm overflow-hidden mt-1">
              <div className="bg-[#EF4444] h-full w-2/3 animate-pulse" />
            </div>
          </div>

          {/* Ad Container for Google AdSense */}
          <div className="w-full max-w-[320px] mx-auto shrink-0 mt-4 sm:mt-6">
            <AdBanner />
          </div>
        </div>
      ) : canUse ? (
        <div className="my-auto flex flex-col w-full min-h-0">
          <CameraCapture
            disabled={!canUse}
            onStartLoading={() => setLoading(true)}
            onEndLoading={() => setLoading(false)}
            onError={(msg) => setErrorMsg(msg)}
          />
        </div>
      ) : (
        /* Disabled Message */
        <div className="swiss-card-dark p-6 md:p-10 text-center flex flex-col items-center gap-4 my-auto">
          <AlertCircle className="w-10 h-10 md:w-14 md:h-14 text-[#EF4444]" />
          <p className="text-sm md:text-base font-extrabold text-white leading-relaxed">
            本日分（10回）の利用上限に達したため、新規撮影・判定はできません。
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 bg-[#F5CE42] text-[#111111] swiss-border font-black text-xs md:text-sm"
          >
            ホーム画面に戻る
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer className="pt-1 sm:pt-1.5 border-t-2 sm:border-t-3 border-black text-center shrink-0">
        <a
          href="https://gohannavi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display font-black tracking-widest text-[9px] sm:text-[10px] md:text-xs text-[#111111] hover:underline inline-block"
        >
          GOHANNAVI.COM
        </a>
      </footer>
    </main>
  );
}
