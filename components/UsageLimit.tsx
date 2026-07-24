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

  // SSR hydraton safeguard - don't render until mounted on client
  if (remaining === null) {
    return null;
  }

  if (remaining > 0) {
    return (
      <div className="w-full flex justify-center my-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 text-[#2D6A4F] rounded-full text-xs font-bold shadow-sm">
          <span>本日あと <span className="text-sm font-extrabold">{remaining}</span> 回使えます</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#E63946]/10 border border-[#E63946]/30 text-[#E63946] rounded-2xl p-4 my-3 text-center shadow-sm">
      <p className="text-xs font-bold leading-relaxed">
        本日の無料判定は終了しました。明日またご利用ください。
      </p>
    </div>
  );
}
