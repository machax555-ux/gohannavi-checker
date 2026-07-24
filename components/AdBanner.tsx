"use client";

import React from "react";

export default function AdBanner() {
  // ここにGoogle AdSenseコードを挿入してください

  return (
    <div className="w-full min-h-[90px] bg-[#FAF9F5] border border-dashed border-[#D6D3D1] rounded-2xl my-3 flex flex-col items-center justify-center p-4 text-center">
      <span className="text-[9px] text-[#A8A29E] font-mono tracking-widest uppercase mb-0.5">
        SPONSORED
      </span>
      <span className="text-xs text-[#A8A29E] font-bold">
        広告
      </span>
    </div>
  );
}
