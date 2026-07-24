"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Camera, ArrowRight, ExternalLink, ShieldCheck, Search } from "lucide-react";
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
    <main className="flex-1 flex flex-col p-6 justify-between gap-6">
      {/* 1. ヘッダー */}
      <header className="flex flex-col items-center text-center mt-4 gap-2">
        <div className="w-16 h-16 bg-[#2D6A4F] rounded-2xl flex items-center justify-center text-white shadow-lg mb-1">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D6A4F] tracking-tight">
          ごはんなび添加物チェッカー
        </h1>
        <p className="text-sm font-semibold text-gray-600">
          原材料を撮るだけで添加物を瞬時に判定
        </p>
      </header>

      {/* 2. UsageLimitコンポーネント（本日の残り回数表示） */}
      <div className="w-full">
        <UsageLimit onLimitCheck={(valid) => setUsable(valid)} />
      </div>

      {/* 3. メインアクションボタンエリア */}
      <div className="w-full flex flex-col gap-3">
        {mounted && !usable ? (
          <div
            className="w-full min-h-[80px] bg-gray-300 text-gray-500 rounded-3xl font-extrabold text-xl flex items-center justify-center gap-3 cursor-not-allowed shadow-inner px-4 text-center"
          >
            <Camera className="w-7 h-7 text-gray-400" />
            <span>本日の無料判定は終了しました</span>
          </div>
        ) : (
          <Link
            href="/scan"
            className="w-full min-h-[80px] bg-[#2D6A4F] hover:bg-[#255740] text-white rounded-3xl font-extrabold text-xl sm:text-2xl flex items-center justify-center gap-3 shadow-xl transition active:scale-[0.98] px-4 text-center"
          >
            <Camera className="w-7 h-7 text-white" />
            <span>判定スタート</span>
            <ArrowRight className="w-6 h-6 text-white ml-1" />
          </Link>
        )}

        {/* 無添加商品を検索 ボタン */}
        <Link
          href="/search"
          className="w-full py-4 bg-[#F4A261] hover:bg-[#e7924e] text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-md transition active:scale-[0.98]"
        >
          <Search className="w-5 h-5" />
          <span>🔍 無添加商品を検索</span>
        </Link>
      </div>

      {/* 4. 使い方3ステップ */}
      <section className="w-full my-2">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-4">
          かんたん 3ステップの使い方
        </h2>
        <div className="flex flex-col gap-3">
          {/* Step 1 */}
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-start gap-3.5 shadow-sm">
            <span className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-extrabold text-sm text-gray-900">
                📷 原材料名を撮影
              </span>
              <p className="text-xs text-gray-500 leading-relaxed">
                食品パッケージ裏面の原材料名欄をスマホカメラで撮影またはテキスト入力します。
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-start gap-3.5 shadow-sm">
            <span className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-extrabold text-sm text-gray-900">
                🤖 AIが添加物を自動判定
              </span>
              <p className="text-xs text-gray-500 leading-relaxed">
                Gemini AIが文字を解析し、無添加・要注意・避けるべき添加物をワンストップ判定。
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-start gap-3.5 shadow-sm">
            <span className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-extrabold text-sm text-gray-900">
                🛒 無添加の代替商品を提案
              </span>
              <p className="text-xs text-gray-500 leading-relaxed">
                添加物が含まれる場合は、Amazonで購入可能な安心安全な代替商品をすぐ提案します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ごはんなびへのリンクバナー */}
      <footer className="w-full mb-2">
        <a
          href="https://gohannavi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-4 bg-[#95D5B2]/40 hover:bg-[#95D5B2]/60 border border-[#95D5B2] rounded-2xl flex items-center justify-between gap-3 shadow-sm transition active:scale-[0.98]"
        >
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-xs font-bold text-[#2D6A4F]">
              ごはんなび 公式ブログ
            </span>
            <span className="text-sm font-extrabold text-gray-900">
              無添加食品をもっと知りたい方はごはんなびへ
            </span>
          </div>
          <ExternalLink className="w-5 h-5 text-[#2D6A4F] shrink-0" />
        </a>
      </footer>
    </main>
  );
}
