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
    <main className="h-full flex flex-col justify-between overflow-hidden py-1">
      {/* Header Bar */}
      <header className="flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="bg-[#121212] text-white px-2.5 py-1 swiss-border text-[10px] font-black font-display tracking-wider flex items-center gap-1 hover:bg-[#EF4444] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>HOME</span>
          </Link>
          <UsageLimit onLimitCheck={(valid) => setCanUse(valid)} />
        </div>

        <div className="flex flex-col gap-0.5 mt-0.5">
          <span className="font-display font-black text-[10px] text-[#111111] tracking-widest">
            01. SCANNER
          </span>
          <h1 className="font-display font-black text-2xl text-[#111111] leading-none">
            撮影・入力画面
          </h1>
        </div>

        <div className="w-full h-[2px] bg-[#111111]" />
      </header>

      {/* Error Banner */}
      {errorMsg && (
        <div className="swiss-card-coral p-3 text-xs font-extrabold flex items-start gap-1.5 shrink-0 my-1">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading State UI */}
      {loading ? (
        <div className="swiss-card-dark p-6 flex flex-col items-center justify-center gap-4 text-center my-auto shrink-0">
          <div className="w-12 h-12 bg-[#F5CE42] text-[#111111] swiss-border flex items-center justify-center">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="font-display font-black text-lg text-[#F5CE42] tracking-wider">
              ANALYZING...
            </h2>
            <p className="text-xs font-extrabold text-white">
              原材料を分析中...少々お待ちください
            </p>
            <p className="text-[10px] text-white/70">
              AIが添加物の抽出と安全性をスキャンしています
            </p>
          </div>
          <div className="w-full bg-white/20 h-2.5 swiss-border-sm overflow-hidden mt-1">
            <div className="bg-[#EF4444] h-full w-2/3 animate-pulse" />
          </div>
        </div>
      ) : canUse ? (
        <div className="flex-1 my-auto overflow-hidden flex flex-col">
          <CameraCapture
            disabled={!canUse}
            onStartLoading={() => setLoading(true)}
            onEndLoading={() => setLoading(false)}
            onError={(msg) => setErrorMsg(msg)}
          />
        </div>
      ) : (
        /* Disabled Message */
        <div className="swiss-card-dark p-5 text-center flex flex-col items-center gap-3 my-auto shrink-0">
          <AlertCircle className="w-8 h-8 text-[#EF4444]" />
          <p className="text-xs font-extrabold text-white leading-relaxed">
            本日の無料判定回数（3回）の上限に達しているため、新規撮影・判定はできません。
          </p>
          <Link
            href="/"
            className="px-3 py-1.5 bg-[#F5CE42] text-[#111111] swiss-border font-black text-xs"
          >
            ホーム画面に戻る
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer className="pt-1 border-t-2 border-black text-center shrink-0">
        <span className="font-display font-black tracking-widest text-[9px] text-[#111111]">
          GOHANNAVI ADDITIVE CHECKER
        </span>
      </footer>
    </main>
  );
}
