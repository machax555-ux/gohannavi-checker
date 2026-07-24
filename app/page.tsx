"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Camera, ArrowRight, ExternalLink } from "lucide-react";
import UsageLimit from "@/components/UsageLimit";
import { canUseToday } from "@/lib/storage";

export default function HomePage() {
  const [usable, setUsable] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    setUsable(canUseToday());
  }, []);

  return (
    <main className="h-full flex flex-col justify-between overflow-hidden py-1">
      {/* 1. Header Row & Mega Title */}
      <header className="flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <a
            href="https://gohannavi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white px-2.5 py-1 swiss-border inline-flex items-center hover:opacity-90 transition-opacity"
          >
            <img
              src="/gohannavi-logo.png"
              alt="ごはんなび"
              className="h-6 w-auto object-contain"
            />
          </a>
          <UsageLimit onLimitCheck={(valid) => setUsable(valid)} />
        </div>

        {/* Hallmark Mega Typography Header */}
        <div className="flex flex-col gap-0.5 mt-0.5">
          <h1 className="font-display font-black text-3xl sm:text-4xl leading-none tracking-tight text-[#111111]">
            FOOD CHECKER
          </h1>
          <p className="text-[10px] sm:text-xs font-black text-[#111111] tracking-wider">
            添加物をAIが瞬時に判定するスキャンツール
          </p>
        </div>

        <div className="w-full h-[2px] bg-[#111111]" />
      </header>

      {/* 2. Main Hero Cards (Swiss 70s Hallmark Style) */}
      <div className="flex flex-col gap-3 my-auto shrink-0">
        {/* 01. SCANNER Hero Card */}
        <div className="swiss-card-dark p-4 flex flex-col gap-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/20 pb-1.5">
            <span className="font-display font-black text-[10px] sm:text-xs text-[#F5CE42] tracking-widest">
              01. SCANNER
            </span>
            <span className="text-[9px] font-mono text-white/60">AI POWERED</span>
          </div>

          <h2 className="font-extrabold text-lg sm:text-xl text-white leading-snug">
            原材料名を撮影・入力する
          </h2>

          {mounted && !usable ? (
            <div className="w-full py-2.5 bg-[#333333] text-white/50 swiss-border-sm text-center font-extrabold text-xs flex items-center justify-center gap-2 cursor-not-allowed">
              <Camera className="w-4 h-4" />
              <span>本日の無料判定は終了しました</span>
            </div>
          ) : (
            <Link
              href="/scan"
              className="w-full py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white swiss-border swiss-shadow-sm font-black text-base flex items-center justify-center gap-2.5 transition-transform active:translate-x-0.5 active:translate-y-0.5 group"
            >
              <Camera className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span>判定スタート</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* 02. DATABASE Card */}
        <div className="swiss-card-white p-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-display font-black text-[10px] text-[#111111] tracking-widest">
              02. DATABASE
            </span>
          </div>
          <Link
            href="/search"
            className="flex items-center justify-between text-left group"
          >
            <span className="font-extrabold text-sm text-[#111111] group-hover:underline">
              無添加商品を検索する
            </span>
            <span className="font-display font-black text-base text-[#111111] group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>

        {/* 03. HOW IT WORKS Section (Compact 3-Step) */}
        <section className="swiss-card-white p-3.5 flex flex-col gap-2">
          <h3 className="font-display font-black text-[10px] text-[#111111] tracking-widest border-b border-black pb-1 flex items-center justify-between">
            <span>03. HOW IT WORKS</span>
            <span>使い方</span>
          </h3>
          
          <div className="grid grid-cols-3 gap-1.5 pt-0.5">
            <div className="flex flex-col items-start gap-1 p-1.5 bg-[#F5CE42]/20 swiss-border-sm">
              <span className="font-display font-black text-[10px] bg-[#111111] text-[#F5CE42] px-1.5 py-0.2">
                01
              </span>
              <p className="font-extrabold text-[11px] text-[#111111] leading-tight">撮影する</p>
              <p className="text-[9px] text-[#444444] leading-none">原材料名をパシャリ</p>
            </div>

            <div className="flex flex-col items-start gap-1 p-1.5 bg-[#F5CE42]/20 swiss-border-sm">
              <span className="font-display font-black text-[10px] bg-[#111111] text-[#F5CE42] px-1.5 py-0.2">
                02
              </span>
              <p className="font-extrabold text-[11px] text-[#111111] leading-tight">AI判定</p>
              <p className="text-[9px] text-[#444444] leading-none">危険添加物を自動検出</p>
            </div>

            <div className="flex flex-col items-start gap-1 p-1.5 bg-[#F5CE42]/20 swiss-border-sm">
              <span className="font-display font-black text-[10px] bg-[#111111] text-[#F5CE42] px-1.5 py-0.2">
                03
              </span>
              <p className="font-extrabold text-[11px] text-[#111111] leading-tight">代替提案</p>
              <p className="text-[9px] text-[#444444] leading-none">Amazon安心商品を推薦</p>
            </div>
          </div>
        </section>
      </div>

      {/* 4. Footer Row */}
      <footer className="pt-1.5 border-t-2 border-black flex items-center justify-between text-xs shrink-0">
        <a
          href="https://gohannavi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display font-black tracking-widest text-[10px] text-[#111111] hover:underline"
        >
          GOHANNAVI.COM
        </a>
        <a
          href="https://gohannavi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#111111] text-white px-2.5 py-1 font-display font-black text-[9px] tracking-wider hover:bg-[#EF4444] transition-colors flex items-center gap-1"
        >
          <span>READ BLOG</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </footer>
    </main>
  );
}
