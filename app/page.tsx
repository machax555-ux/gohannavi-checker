"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Camera, Search, ArrowRight, ExternalLink, Smartphone, Share, PlusSquare, X } from "lucide-react";
import UsageLimit from "@/components/UsageLimit";
import { canUseToday } from "@/lib/storage";

export default function HomePage() {
  const [usable, setUsable] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    setUsable(canUseToday());

    if (typeof window !== "undefined") {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else {
      setShowIosGuide(true);
    }
  };

  return (
    <main className="h-full flex flex-col justify-between overflow-y-auto py-1 select-none">
      {/* 1. Header Row */}
      <header className="flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <a
            href="https://gohannavi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white px-2.5 py-1 swiss-border inline-flex items-center hover:opacity-90 transition-opacity"
          >
            <img
              src="/gohannavi-logo.png"
              alt="ごはんなび"
              className="h-6 w-auto object-contain"
            />
          </a>
          <UsageLimit onLimitCheck={(valid) => setUsable(valid)} />
        </div>

        {/* Mega Typography Header */}
        <div className="flex flex-col gap-0.5 mt-0.5">
          <h1 className="font-display font-black text-3xl sm:text-4xl leading-none tracking-tight text-[#111111]">
            FOOD<br />CHECKER
          </h1>
          <p className="text-[11px] font-black text-[#111111] tracking-wider mt-0.5">
            食品添加物を瞬時に判定するアプリ
          </p>
        </div>

        <div className="w-full h-[2px] bg-[#111111]" />
      </header>

      {/* 2. Main Hero Cards (Order: 01. DATABASE -> 02. SCANNER -> 03. HOW IT WORKS -> 04. INSTALL) */}
      <div className="flex flex-col gap-2.5 my-auto overflow-hidden py-1">
        {/* 01. DATABASE Card */}
        <Link
          href="/search"
          className="swiss-card-dark p-3 sm:p-3.5 flex flex-col gap-2 group hover:opacity-95 transition-opacity cursor-pointer block"
        >
          <div className="flex items-center justify-between">
            <span className="font-display font-black text-[10px] sm:text-xs text-[#F5CE42] tracking-widest">
              01. DATABASE
            </span>
          </div>
          <div className="w-full py-2.5 px-3.5 bg-[#EF4444] text-white swiss-border-sm font-black text-sm sm:text-base flex items-center justify-center gap-2.5 group-hover:bg-[#DC2626] transition-colors">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform" />
            <span>無添加商品を検索する</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 02. SCANNER Card */}
        <div className="swiss-card-dark p-3.5 sm:p-4 flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/20 pb-1">
            <span className="font-display font-black text-[10px] sm:text-xs text-[#F5CE42] tracking-widest">
              02. SCANNER
            </span>
          </div>

          <h2 className="font-extrabold text-base sm:text-lg text-white leading-tight whitespace-nowrap">
            原材料名を撮影・入力する
          </h2>

          {mounted && !usable ? (
            <div className="w-full py-2.5 bg-[#333333] text-white/50 swiss-border-sm text-center font-extrabold text-xs flex items-center justify-center gap-2 cursor-not-allowed">
              <Camera className="w-4 h-4" />
              <span>本日分（10回）の利用上限に達しました</span>
            </div>
          ) : (
            <Link
              href="/scan"
              className="w-full py-2.5 sm:py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white swiss-border swiss-shadow-sm font-black text-base flex items-center justify-center gap-2.5 transition-transform active:translate-x-0.5 active:translate-y-0.5 group"
            >
              <Camera className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span>判定スタート</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* 03. HOW IT WORKS Section */}
        <section className="swiss-card-white p-3 flex flex-col gap-2">
          <h3 className="font-display font-black text-[10px] sm:text-xs text-[#111111] tracking-widest border-b-2 border-black pb-1 flex items-center justify-between">
            <span>03. HOW IT WORKS</span>
            <span>使い方</span>
          </h3>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-start gap-2">
              <span className="font-display font-black text-[10px] bg-[#111111] text-[#F5CE42] px-1.5 py-0.5 shrink-0 mt-0.5">
                01
              </span>
              <div>
                <p className="font-extrabold text-xs text-[#111111] leading-none">パッケージ撮影</p>
                <p className="text-[10px] text-[#444444] font-medium leading-tight mt-0.5">原材料名欄をスマホでパシャリ</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-display font-black text-[10px] bg-[#111111] text-[#F5CE42] px-1.5 py-0.5 shrink-0 mt-0.5">
                02
              </span>
              <div>
                <p className="font-extrabold text-xs text-[#111111] leading-none">AI瞬時判定</p>
                <p className="text-[10px] text-[#444444] font-medium leading-tight mt-0.5">AIが食品添加物を検出</p>
              </div>
            </div>
          </div>
        </section>

        {/* 04. INSTALL Card (Hidden in PWA standalone mode) */}
        {mounted && !isStandalone && (
          <div className="swiss-card-dark p-3 sm:p-3.5 flex flex-col gap-2 group cursor-pointer block">
            <div className="flex items-center justify-between">
              <span className="font-display font-black text-[10px] sm:text-xs text-[#F5CE42] tracking-widest">
                04. INSTALL
              </span>
            </div>
            <button
              onClick={handleInstallClick}
              className="w-full py-2.5 px-3.5 bg-[#F5CE42] hover:bg-[#E5BE32] text-[#111111] swiss-border-sm font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer group"
            >
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-[#111111] group-hover:scale-110 transition-transform" />
              <span>スマホのホーム画面に追加する →</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Footer */}
      <footer className="pt-1.5 border-t-2 border-black flex items-center justify-between text-xs shrink-0">
        <a
          href="https://gohannavi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display font-black tracking-widest text-[10px] text-[#111111] hover:underline"
        >
          GOHANNAVI.COM
        </a>
        <a
          href="https://gohannavi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#111111] text-white px-2.5 py-1 font-display font-black text-[9px] tracking-wider hover:bg-[#EF4444] transition-colors flex items-center gap-1"
        >
          <span>READ BLOG</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </footer>

      {/* PWA / iOS Home Screen Install Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="swiss-card-white p-5 max-w-sm w-full flex flex-col gap-4 relative">
            <button
              onClick={() => setShowIosGuide(false)}
              className="absolute top-3 right-3 p-1 text-[#111111] hover:bg-black/10 rounded-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b-2 border-black pb-2">
              <Smartphone className="w-5 h-5 text-[#EF4444]" />
              <h3 className="font-display font-black text-sm text-[#111111]">
                ホーム画面への追加方法
              </h3>
            </div>

            <p className="text-xs font-extrabold text-[#333333] leading-relaxed">
              アプリのようにワンタップで起動できるよう、ホーム画面に追加できます。
            </p>

            <div className="flex flex-col gap-3 my-1">
              <div className="flex items-start gap-2.5 bg-[#FAF9F5] p-2.5 swiss-border-sm">
                <span className="font-display font-black text-xs bg-[#111111] text-[#F5CE42] w-5 h-5 flex items-center justify-center shrink-0">
                  1
                </span>
                <p className="text-xs font-bold text-[#111111] leading-snug">
                  ブラウザ下の <Share className="w-3.5 h-3.5 inline mx-0.5 text-[#007AFF]" /> 「共有ボタン」をタップ
                </p>
              </div>

              <div className="flex items-start gap-2.5 bg-[#FAF9F5] p-2.5 swiss-border-sm">
                <span className="font-display font-black text-xs bg-[#111111] text-[#F5CE42] w-5 h-5 flex items-center justify-center shrink-0">
                  2
                </span>
                <p className="text-xs font-bold text-[#111111] leading-snug">
                  メニューから <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-[#111111]" /> 「ホーム画面に追加」をタップ
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2 bg-[#111111] text-white swiss-border font-black text-xs hover:bg-[#EF4444] transition-colors"
            >
              とじる
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
