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
    <main className="flex-1 flex flex-col justify-between gap-4 py-1">
      {/* 1. Header Row & Mega Title */}
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <a
            href="https://gohannavi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white px-3 py-1.5 swiss-border inline-flex items-center hover:opacity-90 transition-opacity"
          >
            <img
              src="/gohannavi-logo.png"
              alt="ごはんなび"
              className="h-7 w-auto object-contain"
            />
          </a>
          <UsageLimit onLimitCheck={(valid) => setUsable(valid)} />
        </div>

        {/* Mega Typography Header */}
        <div className="flex flex-col gap-1 mt-0.5">
          <h1 className="font-display font-black text-4xl sm:text-5xl leading-none tracking-tight text-[#111111]">
            FOOD<br />CHECKER
          </h1>
          <p className="text-xs font-black text-[#111111] tracking-wider mt-0.5">
            添加物をAIが瞬時に判定するスキャンツール
          </p>
        </div>

        <div className="w-full h-[3px] bg-[#111111]" />
      </header>

      {/* 2. Main Hero Cards (Full Original Swiss 70s Style) */}
      <div className="flex flex-col gap-4 my-auto">
        {/* 01. SCANNER Hero Card */}
        <div className="swiss-card-dark p-5 flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/20 pb-1.5">
            <span className="font-display font-black text-xs text-[#F5CE42] tracking-widest">
              01. SCANNER
            </span>
          </div>

          <h2 className="font-extrabold text-xl sm:text-2xl text-white leading-tight">
            原材料名を<br />撮影・入力する
          </h2>

          {mounted && !usable ? (
            <div className="w-full py-3 bg-[#333333] text-white/50 swiss-border-sm text-center font-extrabold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
              <Camera className="w-5 h-5" />
              <span>本日の無料判定は終了しました</span>
            </div>
          ) : (
            <Link
              href="/scan"
              className="w-full py-3.5 bg-[#EF4444] hover:bg-[#DC2626] text-white swiss-border swiss-shadow-sm font-black text-lg flex items-center justify-center gap-3 transition-transform active:translate-x-0.5 active:translate-y-0.5 group"
            >
              <Camera className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <span>判定スタート</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* 02. DATABASE Card */}
        <div className="swiss-card-white p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-display font-black text-xs text-[#111111] tracking-widest">
              02. DATABASE
            </span>
          </div>
          <Link
            href="/search"
            className="flex items-center justify-between text-left group pt-0.5"
          >
            <span className="font-extrabold text-base text-[#111111] group-hover:underline">
              無添加商品を検索する
            </span>
            <span className="font-display font-black text-xl text-[#111111] group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>

        {/* 03. HOW IT WORKS Section (Full Original Vertical Step List) */}
        <section className="swiss-card-white p-4 flex flex-col gap-3">
          <h3 className="font-display font-black text-xs text-[#111111] tracking-widest border-b-2 border-black pb-1.5 flex items-center justify-between">
            <span>03. HOW IT WORKS</span>
            <span>使い方</span>
          </h3>
          
          <div className="flex flex-col gap-2.5">
            <div className="flex items-start gap-3">
              <span className="font-display font-black text-xs bg-[#111111] text-[#F5CE42] px-2 py-0.5 shrink-0 mt-0.5">
                01
              </span>
              <div>
                <p className="font-extrabold text-xs text-[#111111]">パッケージ撮影</p>
                <p className="text-[11px] text-[#444444] font-medium leading-tight">原材料名欄をスマホでパシャリ</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="font-display font-black text-xs bg-[#111111] text-[#F5CE42] px-2 py-0.5 shrink-0 mt-0.5">
                02
              </span>
              <div>
                <p className="font-extrabold text-xs text-[#111111]">AI瞬時判定</p>
                <p className="text-[11px] text-[#444444] font-medium leading-tight">Gemini AIが危険添加物を検出</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="font-display font-black text-xs bg-[#111111] text-[#F5CE42] px-2 py-0.5 shrink-0 mt-0.5">
                03
              </span>
              <div>
                <p className="font-extrabold text-xs text-[#111111]">無添加代替品提案</p>
                <p className="text-[11px] text-[#444444] font-medium leading-tight">Amazonで買える安心商品を推薦</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 4. Footer */}
      <footer className="pt-2 border-t-3 border-black flex items-center justify-between text-xs">
        <a
          href="https://gohannavi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display font-black tracking-widest text-[11px] text-[#111111] hover:underline"
        >
          GOHANNAVI.COM
        </a>
        <a
          href="https://gohannavi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#111111] text-white px-3 py-1.5 font-display font-black text-[10px] tracking-wider hover:bg-[#EF4444] transition-colors flex items-center gap-1.5"
        >
          <span>READ BLOG</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </footer>
    </main>
  );
}
