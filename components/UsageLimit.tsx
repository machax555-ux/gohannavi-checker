"use client";

import React, { useEffect, useState } from "react";
import { getUsageCount, canUseToday, resetUsage } from "@/lib/storage";

interface UsageLimitProps {
  onLimitCheck?: (hasRemaining: boolean) => void;
}

export default function UsageLimit({ onLimitCheck }: UsageLimitProps) {
  const [remaining, setRemaining] = useState<number | null>(null);

  const check = () => {
    const rem = getUsageCount();
    setRemaining(rem);
    if (onLimitCheck) {
      onLimitCheck(canUseToday());
    }
  };

  useEffect(() => {
    check();
  }, [onLimitCheck]);

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    resetUsage();
    check();
  };

  if (remaining === null) {
    return null;
  }

  if (remaining > 0) {
    return (
      <button
        type="button"
        onClick={handleReset}
        title="クリックで回数をリセット（テスト用）"
        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#121212] text-white swiss-border rounded-none text-xs font-black tracking-widest font-display hover:bg-[#EF4444] transition-colors cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
        <span>{remaining} USES LEFT</span>
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 bg-[#EF4444] text-white swiss-border p-2 text-center">
      <p className="text-xs font-extrabold tracking-wide flex-1 text-left px-1">
        本日の無料判定は終了しました
      </p>
      <button
        type="button"
        onClick={handleReset}
        className="px-2.5 py-1 bg-white text-[#111111] swiss-border-sm font-black text-xs hover:bg-[#F5CE42] shrink-0"
      >
        リセット
      </button>
    </div>
  );
}
