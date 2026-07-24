"use client";

import React from "react";

export default function AdBanner() {
  // ここにGoogle AdSenseコードを挿入してください

  return (
    <div className="w-full min-h-[90px] bg-[#F8F9FA] border border-dashed border-gray-300 rounded-2xl my-4 flex flex-col items-center justify-center p-4 text-center">
      <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase mb-1">
        スポンサーリンク
      </span>
      <span className="text-xs text-gray-400 font-medium">
        広告
      </span>
    </div>
  );
}
