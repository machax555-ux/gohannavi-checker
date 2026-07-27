"use client";

import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export default function AdBanner() {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef<boolean>(false);

  useEffect(() => {
    if (pushedRef.current) return;

    const timer = setTimeout(() => {
      try {
        const insElement = adRef.current;
        if (insElement && !insElement.getAttribute("data-adsbygoogle-status")) {
          pushedRef.current = true;
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (e) {
        console.warn("AdSense push warning:", e);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className="w-full my-1 flex flex-col items-center justify-center text-center overflow-hidden shrink-0"
      style={{ minHeight: "auto", height: "fit-content" }}
    >
      <span className="text-[9px] text-[#A8A29E] font-mono tracking-widest uppercase mb-0.5 shrink-0">
        SPONSORED
      </span>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "auto", minHeight: "auto" }}
        data-ad-client="ca-pub-5974007350632133"
        data-ad-slot="7975055877"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
