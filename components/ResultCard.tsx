"use client";

import React from "react";
import { AdditiveCheckResult } from "@/lib/gemini";
import { ShieldCheck, AlertCircle } from "lucide-react";

interface ResultCardProps {
  result: AdditiveCheckResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const getBannerConfig = (judgment: "safe" | "caution" | "danger") => {
    switch (judgment) {
      case "safe":
        return {
          bg: "bg-[#52B788]",
          text: "✅ 無添加です！",
        };
      case "caution":
        return {
          bg: "bg-[#F4A261]",
          text: "⚠️ 要注意の添加物が含まれます",
        };
      case "danger":
        return {
          bg: "bg-[#E63946]",
          text: "❌ 避けたい添加物が含まれています",
        };
    }
  };

  const banner = getBannerConfig(result.judgment);
  const showAdditives = (result.judgment === "caution" || result.judgment === "danger") &&
                        result.detected_additives && result.detected_additives.length > 0;

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden my-4">
      {/* 1. 判定バナー（画面上部、大きく表示 24px以上 白文字） */}
      <div className={`${banner.bg} text-white p-6 text-center shadow-inner`}>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
          {banner.text}
        </h2>
        {result.product_category && (
          <p className="text-xs mt-2 opacity-90 font-medium">
            カテゴリ: {result.product_category}
          </p>
        )}
      </div>

      {/* Body Area */}
      <div className="p-6 flex flex-col gap-6">
        {/* 2. 判定サマリー文 */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-gray-400" />
            判定サマリー
          </h3>
          <p className="text-base text-gray-800 leading-relaxed font-semibold bg-gray-50 p-4 rounded-2xl border border-gray-100">
            {result.summary}
          </p>
        </div>

        {/* 3. 検出された添加物リスト (caution / danger の場合のみ) */}
        {showAdditives && (
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              検出された添加物 ({result.detected_additives.length}件)
            </h3>
            <div className="flex flex-col gap-3">
              {result.detected_additives.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-base text-gray-900">{item.name}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-600 shrink-0">
                      {item.category || "添加物"}
                    </span>
                  </div>
                  {item.reason && (
                    <p className="text-xs text-gray-600 leading-relaxed">{item.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. 安全な原材料 */}
        {result.safe_ingredients && result.safe_ingredients.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#52B788]" />
              主な安全な原材料
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.safe_ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1.5 bg-[#95D5B2]/30 text-[#2D6A4F] font-bold rounded-xl border border-[#95D5B2]/40"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
