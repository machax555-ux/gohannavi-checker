"use client";

import React, { useEffect, useState } from "react";
import { getUsageCount, canUseToday } from "@/lib/storage";

interface UsageLimitProps {
  onLimitCheck?: (hasRemaining: boolean) => void;
}

export default function UsageLimit({ onLimitCheck }: UsageLimitProps) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const rem = getUsageCount();
    setRemaining(rem);
    if (onLimitCheck) {
      onLimitCheck(canUseToday());
    }
  }, [onLimitCheck]);

  // SSR hydration safeguard - don't render until mounted on client
  if (remaining === null) {
    return null;
  }

  if (remaining > 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#121212] text-white swiss-border rounded-none text-xs font-black tracking-widest font-display">
        <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
        <span>{remaining} USES LEFT</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#EF4444] text-white swiss-border swiss-shadow p-3 text-center">
      <p className="text-xs font-extrabold tracking-wide">
        本日の無料判定は終了しました。明日またご利用ください。
      </p>
    </div>
  );
}
