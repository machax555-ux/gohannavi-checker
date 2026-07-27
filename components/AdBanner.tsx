"use client";

import React, { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export default function AdBanner() {
  useEffect(() => {
    try {
      const scriptUrl =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5974007350632133";

      let script = document.querySelector(
        `script[src="${scriptUrl}"]`
      ) as HTMLScriptElement | null;

      const pushAd = () => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error("AdSense push error:", e);
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
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className="w-full my-3 flex flex-col items-center justify-center text-center overflow-hidden">
      <span className="text-[9px] text-[#A8A29E] font-mono tracking-widest uppercase mb-0.5">
        SPONSORED
      </span>
      <ins
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
