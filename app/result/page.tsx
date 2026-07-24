"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import ResultCard from "@/components/ResultCard";
import AlternativeProducts from "@/components/AlternativeProducts";
import AdBanner from "@/components/AdBanner";
import { AdditiveCheckResult } from "@/lib/gemini";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<AdditiveCheckResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Read result from sessionStorage key "gohannavi_result"
    const dataStr = sessionStorage.getItem("gohannavi_result");
    if (dataStr) {
      try {
        const parsed = JSON.parse(dataStr);
        setResult(parsed);
      } catch (e) {
        console.error("Failed to parse gohannavi_result from sessionStorage", e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  // データがない場合の表示
  if (!result) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">判定結果がありません</h1>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          原材料名の読み取り・判定を最初からやり直してください。
        </p>
        <Link
          href="/scan"
          className="py-3.5 px-6 bg-[#2D6A4F] text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md transition active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>撮影・入力画面へ戻る</span>
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col p-5 pb-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-2">
        <Link
          href="/"
          className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>ホームへ</span>
        </Link>
        <h1 className="text-base font-bold text-gray-900">添加物判定結果</h1>
        <div className="w-12" /> {/* Spacer */}
      </div>

      {/* 1. ResultCard */}
      <ResultCard result={result} />

      {/* 2. AdBanner (ResultCard の下に表示) */}
      <AdBanner />

      {/* 3. AlternativeProducts (danger 判定の場合のみ表示) */}
      {result.judgment === "danger" && (
        <AlternativeProducts
          blogKeyword={result.blog_keyword}
          productCategory={result.product_category}
        />
      )}

      {/* 4. 「もう一度判定する」ボタン → /scan へ遷移 */}
      <div className="mt-4">
        <Link
          href="/scan"
          className="w-full py-4 bg-[#2D6A4F] hover:bg-[#255740] text-white rounded-2xl font-bold text-base text-center flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98]"
        >
          <RefreshCw className="w-5 h-5" />
          <span>もう一度判定する</span>
        </Link>
      </div>
    </main>
  );
}
