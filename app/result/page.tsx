"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import ResultCard from "@/components/ResultCard";
import AlternativeProducts from "@/components/AlternativeProducts";
import AdBanner from "@/components/AdBanner";
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
    <main className="flex-1 flex flex-col justify-between gap-4 py-2 pb-6">
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
          <span className="font-display font-black text-xs text-[#111111] bg-white px-3 py-1.5 swiss-border">
            RESULT PAGE
          </span>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <span className="font-display font-black text-xs text-[#111111] tracking-widest">
            02. ANALYSIS RESULT
          </span>
          <h1 className="font-display font-black text-3xl text-[#111111] leading-none">
            判定結果画面
          </h1>
        </div>

        <div className="w-full h-[3px] bg-[#111111]" />
      </header>

      {/* 1. ResultCard */}
      {result && <ResultCard result={result} />}

      {/* 2. AdBanner */}
      <AdBanner />

      {/* 3. AlternativeProducts (danger / caution 判定時) */}
      {result && (result.judgment === "danger" || result.judgment === "caution") && (
        <AlternativeProducts
          blogKeyword={result.blog_keyword}
          productCategory={result.product_category}
        />
      )}

      {/* 4. Action Button */}
      <div className="mt-2">
        <Link
          href="/scan"
          className="w-full py-4 bg-[#121212] hover:bg-[#222222] text-[#F5CE42] swiss-border swiss-shadow font-black text-base text-center flex items-center justify-center gap-2 transition-transform active:translate-x-0.5 active:translate-y-0.5"
        >
          <RefreshCw className="w-5 h-5" />
          <span>もう一度判定する</span>
        </Link>
      </div>
    </main>
  );
}
