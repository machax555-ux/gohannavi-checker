"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import ResultCard from "@/components/ResultCard";
import AlternativeProducts from "@/components/AlternativeProducts";
import AdBanner from "@/components/AdBanner";
import AffiliateNoticeFooter from "@/components/AffiliateNoticeFooter";
import { AdditiveCheckResult } from "@/lib/gemini";

export default function ResultPage() {
  const [result, setResult] = useState<AdditiveCheckResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Demo mock data for sample display if sessionStorage is empty
    const dataStr = sessionStorage.getItem("gohannavi_result");
    if (dataStr) {
      try {
        const parsed = JSON.parse(dataStr);
        setResult(parsed);
      } catch (e) {
        console.error("Failed to parse gohannavi_result", e);
      }
    } else {
      // Fallback mock sample for immediate visual demo in test/render mode
      setResult({
        judgment: "danger",
        product_category: "加工肉（ハム・ベーコン・ソーセージ）",
        summary: "発色剤の亜硝酸ナトリウムと人工甘味料のアスパルテームが含まれるため、常用を避け無添加代替商品への切り替えをおすすめします。",
        detected_additives: [
          {
            name: "亜硝酸ナトリウム",
            category: "発色剤・保存料",
            reason: "肉の赤みを保持するが、体内で発がん性物質アミンの生成に関与するリスクが指摘されている。"
          },
          {
            name: "アスパルテーム",
            category: "人工甘味料",
            reason: "砂糖の200倍の甘味度を持つ合成甘味料。腸内細菌叢への懸念あり。"
          },
          {
            name: "ソルビン酸カリウム",
            category: "保存料",
            reason: "細菌の発育を抑える化学合成保存料。"
          }
        ],
        safe_ingredients: ["豚肉", "豚脂", "食塩", "香辛料", "砂糖"],
        blog_keyword: "無添加ソーセージ"
      });
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <main className="h-full flex flex-col justify-start overflow-y-auto py-2 gap-4 pb-8 max-w-full md:max-w-[1000px] md:mx-auto w-full">
      {/* Header Bar */}
      <header className="flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="bg-[#121212] text-white px-3 py-1.5 md:px-4 md:py-2 swiss-border text-xs md:text-sm font-black font-display tracking-wider flex items-center gap-1.5 hover:bg-[#EF4444] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span>HOME</span>
          </Link>
          <span className="font-display font-black text-xs md:text-sm text-[#111111] bg-white px-3 py-1.5 md:px-4 md:py-2 swiss-border">
            RESULT PAGE
          </span>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <span className="font-display font-black text-xs md:text-sm text-[#111111] tracking-widest">
            02. ANALYSIS RESULT
          </span>
          <h1 className="font-display font-black text-3xl md:text-4xl text-[#111111] leading-none">
            判定結果画面
          </h1>
        </div>

        <div className="w-full h-[3px] bg-[#111111]" />
      </header>

      {/* Main Content Area: 1-Column on Mobile, 2-Column on PC */}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 items-start">
        {/* Left Column: Result Card */}
        <div className="flex flex-col gap-4 w-full">
          {result && <ResultCard result={result} />}
        </div>

        {/* Right Column: AdBanner + Alternative Products + Retry Button */}
        <div className="flex flex-col gap-4 w-full">
          <AdBanner />

          {result && (
            <AlternativeProducts
              blogKeyword={result.blog_keyword}
              productCategory={result.product_category}
            />
          )}

          <div className="mt-2 mb-2 shrink-0">
            <Link
              href="/scan"
              className="w-full py-4 bg-[#121212] hover:bg-[#222222] text-[#F5CE42] swiss-border swiss-shadow font-black text-base md:text-lg text-center flex items-center justify-center gap-2 transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <RefreshCw className="w-5 h-5 md:w-6 md:h-6" />
              <span>もう一度判定する</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <AffiliateNoticeFooter />
    </main>
  );
}
