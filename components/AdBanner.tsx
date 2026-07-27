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
    // 既にこのコンポーネントで push 済みの場合は処理しない
    if (pushedRef.current) return;

    // メインスレッドの処理（API通信等）と衝突しないようタイマーで遅延初期化
    const timer = setTimeout(() => {
      try {
        const insElement = adRef.current;
        // ins要素が存在し、AdSenseによって未処理の場合のみ push
        if (insElement && !insElement.getAttribute("data-adsbygoogle-status")) {
          const scriptUrl =
            "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5974007350632133";

          let script = document.querySelector(
            `script[src="${scriptUrl}"]`
          ) as HTMLScriptElement | null;

          const pushAd = () => {
            try {
              if (
                insElement &&
                !insElement.getAttribute("data-adsbygoogle-status") &&
                !pushedRef.current
              ) {
                pushedRef.current = true;
                (window.adsbygoogle = window.adsbygoogle || []).push({});
              }
            } catch (e) {
              console.warn("AdSense push warning:", e);
            }
          };

          if (!script) {
            script = document.createElement("script");
            script.src = scriptUrl;
            script.async = true;
            script.crossOrigin = "anonymous";
            script.onload = pushAd;
            document.head.appendChild(script);
          } else {
            pushAd();
          }
        }
      } catch (e) {
        console.warn("AdSense init warning:", e);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="w-full my-3 flex flex-col items-center justify-center text-center overflow-hidden">
      <span className="text-[9px] text-[#A8A29E] font-mono tracking-widest uppercase mb-0.5">
        SPONSORED
      </span>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-5974007350632133"
        data-ad-slot="7975055877"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
