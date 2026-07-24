"use client";

import React from "react";
import { AdditiveCheckResult } from "@/lib/gemini";
import { ShieldCheck, AlertCircle, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface ResultCardProps {
  result: AdditiveCheckResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const getBannerConfig = (judgment: "safe" | "caution" | "danger") => {
    switch (judgment) {
      case "safe":
        return {
          cardStyle: "swiss-card-dark",
          badgeBg: "bg-[#10B981] text-[#111111]",
          icon: <CheckCircle2 className="w-8 h-8 text-[#10B981]" />,
          title: "SAFE / 無添加です",
          sub: "避けるべき添加物は検出されませんでした",
          accentColor: "#10B981",
        };
      case "caution":
        return {
          cardStyle: "swiss-card-dark",
          badgeBg: "bg-[#F59E0B] text-[#111111]",
          icon: <AlertTriangle className="w-8 h-8 text-[#F59E0B]" />,
          title: "CAUTION / 要注意添加物あり",
          sub: "過剰摂取に注意が必要な成分が含まれます",
          accentColor: "#F59E0B",
        };
      case "danger":
        return {
          cardStyle: "swiss-card-coral",
          badgeBg: "bg-[#121212] text-white",
          icon: <XCircle className="w-8 h-8 text-white" />,
          title: "食品添加物が含まれている商品です",
          sub: "",
          accentColor: "#EF4444",
        };
    }
  };

  const banner = getBannerConfig(result.judgment);
  const showAdditives = (result.judgment === "caution" || result.judgment === "danger") &&
                        result.detected_additives && result.detected_additives.length > 0;

  // Format category badge text: Remove "CATEGORY:", and map "加工肉" to "加工肉（ハム・ベーコン・ソーセージ）"
  const formatCategory = (cat?: string) => {
    if (!cat) return "判定結果";
    const cleaned = cat.replace(/^CATEGORY:\s*/i, "");
    if (cleaned.includes("加工肉")) {
      return "加工肉（ハム・ベーコン・ソーセージ）";
    }
    return cleaned;
  };

  return (
    <div className="w-full flex flex-col gap-4 my-2">
      {/* 1. Status Banner Header */}
      <div className={`${banner.cardStyle} p-5 flex flex-col gap-3`}>
        <div className="flex items-center justify-between border-b border-current/20 pb-2">
          <span className={`font-display font-black text-xs px-2.5 py-0.5 swiss-border-sm ${banner.badgeBg}`}>
            {formatCategory(result.product_category)}
          </span>
          {banner.icon}
        </div>
        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl tracking-tight leading-tight">
            {banner.title}
          </h2>
          <p className="text-xs font-bold opacity-90 mt-1">
            {banner.sub}
          </p>
        </div>
      </div>

      {/* 2. Summary Quote Card */}
      <div className="swiss-card-white p-5 flex flex-col gap-2">
        <h3 className="font-display font-black text-xs text-[#111111] tracking-widest border-b-2 border-black pb-1 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-[#111111]" />
          <span>判定結果</span>
        </h3>
        <p className="text-xs sm:text-sm text-[#111111] leading-relaxed font-extrabold pt-1">
          "{result.summary}"
        </p>
      </div>

      {/* 3. Detected Additives List */}
      {showAdditives && (
        <div className="swiss-card-dark p-5 flex flex-col gap-3">
          <h3 className="font-display font-black text-xs text-[#F5CE42] tracking-widest border-b border-white/20 pb-2">
            01. DETECTED ADDITIVES ({result.detected_additives.length})
          </h3>
          <div className="flex flex-col gap-3">
            {result.detected_additives.map((item, idx) => (
              <div
                key={idx}
                className="bg-white text-[#111111] swiss-border p-3.5 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold text-base text-[#111111]">{item.name}</span>
                  <span className="font-display font-black text-[10px] bg-[#121212] text-[#F5CE42] px-2 py-0.5 shrink-0">
                    {item.category || "添加物"}
                  </span>
                </div>
                {item.reason && (
                  <p className="text-xs font-medium text-[#444444] leading-relaxed pt-0.5">
                    {item.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Safe Ingredients */}
      {result.safe_ingredients && result.safe_ingredients.length > 0 && (
        <div className="swiss-card-white p-5 flex flex-col gap-3">
          <h3 className="font-display font-black text-xs text-[#111111] tracking-widest border-b-2 border-black pb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>02. SAFE INGREDIENTS / 主な安全な原材料</span>
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {result.safe_ingredients.map((ing, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 bg-[#121212] text-white font-extrabold swiss-border-sm"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
