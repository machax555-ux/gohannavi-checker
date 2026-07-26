"use client";

import React, { useEffect, useState } from "react";
import { getUsageCount, canUseToday } from "@/lib/storage";

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

    const handleUpdate = () => check();
    window.addEventListener("gohannavi_usage_updated", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    return () => {
      window.removeEventListener("gohannavi_usage_updated", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, [onLimitCheck]);

  if (remaining === null) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#121212] text-white swiss-border rounded-none text-xs font-black tracking-wider font-display select-none">
      <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse shrink-0" />
      <span>DAY {remaining}/10回</span>
    </div>
  );
}
