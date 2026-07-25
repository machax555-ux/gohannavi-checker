"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import CameraCapture from "@/components/CameraCapture";
import UsageLimit from "@/components/UsageLimit";

export default function ScanPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [canUse, setCanUse] = useState(true);

  return (
    <main className="flex-1 flex flex-col justify-between gap-4 py-2">
      {/* Header Bar */}
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="bg-[#121212] text-white px-3 py-1.5 swiss-border text-xs font-black font-display tracking-wider flex items-center gap-1.5 hover:bg-[#EF4444] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>HOME</span>
          </Link>
          <UsageLimit onLimitCheck={(valid) => setCanUse(valid)} />
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <span className="font-display font-black text-xs text-[#111111] tracking-widest">
            01. SCANNER
          </span>
          <h1 className="font-display font-black text-3xl text-[#111111] leading-none">
            撮影・入力画面
          </h1>
        </div>

        <div className="w-full h-[3px] bg-[#111111]" />
      </header>

      {/* Error Banner */}
      {errorMsg && (
        <div className="swiss-card-coral p-4 text-xs font-extrabold flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading State UI */}
      {loading ? (
        <div className="swiss-card-dark p-8 flex flex-col items-center justify-center gap-5 text-center my-auto">
          <div className="w-14 h-14 bg-[#F5CE42] text-[#111111] swiss-border flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="font-display font-black text-xl text-[#F5CE42] tracking-wider">
              ANALYZING...
            </h2>
            <p className="text-sm font-extrabold text-white">
              原材料を分析中...少々お待ちください
            </p>
            <p className="text-xs text-white/70">
              AIが添加物の抽出と安全性をスキャンしています
            </p>
          </div>
          <div className="w-full bg-white/20 h-3 swiss-border-sm overflow-hidden mt-2">
            <div className="bg-[#EF4444] h-full w-2/3 animate-pulse" />
          </div>
        </div>
      ) : canUse ? (
        <div className="my-auto flex flex-col">
          <CameraCapture
            disabled={!canUse}
            onStartLoading={() => setLoading(true)}
            onEndLoading={() => setLoading(false)}
            onError={(msg) => setErrorMsg(msg)}
          />
        </div>
      ) : (
        /* Disabled Message */
        <div className="swiss-card-dark p-6 text-center flex flex-col items-center gap-4 my-auto">
          <AlertCircle className="w-10 h-10 text-[#EF4444]" />
          <p className="text-sm font-extrabold text-white leading-relaxed">
            本日の無料判定回数（3回）の上限に達しているため、新規撮影・判定はできません。
          </p>
          <Link
            href="/"
            className="px-4 py-2 bg-[#F5CE42] text-[#111111] swiss-border font-black text-xs"
          >
            ホーム画面に戻る
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer className="pt-2 border-t-3 border-black text-center shrink-0">
        <a
          href="https://gohannavi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display font-black tracking-widest text-[10px] text-[#111111] hover:underline inline-block"
        >
          GOHANNAVI.COM
        </a>
      </footer>
    </main>
  );
}
