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
    <main className="h-full max-h-full flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Header Row */}
      <header className="flex flex-col gap-1 shrink-0">
        <div className="flex items-center justify-between">
          <a
            href="https://gohannavi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white px-2 py-0.5 md:px-2.5 md:py-0.5 swiss-border inline-flex items-center hover:opacity-90 transition-opacity"
          >
            <img
              src="/gohannavi-logo.png"
              alt="ごはんなび"
              className="h-5 sm:h-5.5 md:h-6 w-auto object-contain"
            />
          </a>
          <UsageLimit onLimitCheck={(valid) => setUsable(valid)} />
        </div>

        {/* Mega Typography Header */}
        <div className="flex flex-col gap-0.5 mt-1.5 sm:mt-2 md:flex-row md:items-end md:justify-between md:mt-2.5">
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-3xl lg:text-4xl leading-none tracking-tight text-[#111111]">
              FOOD<br className="md:hidden" /> <span className="hidden md:inline"></span>CHECKER
            </h1>
            <p className="text-[11px] sm:text-xs md:text-xs font-black text-[#111111] tracking-wider mt-0.5">
              食品添加物を瞬時に判定するアプリ
            </p>
          </div>
        </div>

        <div className="w-full h-[2px] md:h-[2px] bg-[#111111] mt-1 sm:mt-1.5" />
      </header>

      {/* 2. Main Hero Cards Container */}
      {/* MOBILE DISPLAY (767px & below) */}
      <div className="flex-1 flex flex-col justify-start pt-4 sm:pt-6 pb-3 gap-5 sm:gap-6 min-h-0 overflow-y-auto md:hidden">
        {/* 01. DATABASE Card */}
        <Link
          href="/search"
          className="swiss-card-dark p-2.5 sm:p-3 flex flex-col gap-2 group hover:opacity-95 transition-opacity cursor-pointer block"
        >
          <div className="flex items-center justify-between">
            <span className="font-display font-black text-[10px] sm:text-xs text-[#F5CE42] tracking-widest">
              01. DATABASE
            </span>
          </div>
          <div className="w-full py-2.5 sm:py-3 px-3.5 bg-[#EF4444] text-white swiss-border-sm font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 group-hover:bg-[#DC2626] transition-colors">
            <Search className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>無添加商品を検索する</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 02. SCANNER Card (Primary Hero Feature - Slightly expanded bottom padding) */}
        <div className="swiss-card-dark p-3 pb-4 sm:p-3.5 sm:pb-4.5 flex flex-col gap-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/20 pb-1">
            <span className="font-display font-black text-[10px] sm:text-xs text-[#F5CE42] tracking-widest">
              02. SCANNER
            </span>
          </div>

          <h2 className="font-extrabold text-sm sm:text-base text-white leading-tight whitespace-nowrap">
            原材料名を撮影・入力する
          </h2>

          {mounted && !usable ? (
            <div className="w-full py-3 bg-[#333333] text-white/50 swiss-border-sm text-center font-extrabold text-xs flex items-center justify-center gap-2 cursor-not-allowed">
              <Camera className="w-4 h-4" />
              <span>本日分（10回）の利用上限に達しました</span>
            </div>
          ) : (
            <Link
              href="/scan"
              className="w-full py-3 sm:py-3.5 bg-[#EF4444] hover:bg-[#DC2626] text-white swiss-border swiss-shadow-sm font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-transform active:translate-x-0.5 active:translate-y-0.5 group"
            >
              <Camera className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span>判定スタート</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* 03. HOW IT WORKS Section */}
        <section className="swiss-card-white p-2 sm:p-2.5 flex flex-col gap-1.5">
          <h3 className="font-display font-black text-[9px] sm:text-[10px] text-[#111111] tracking-widest border-b border-black pb-0.5 flex items-center justify-between">
            <span>03. HOW IT WORKS</span>
            <span>使い方</span>
          </h3>

          <div className="flex items-center justify-around gap-2 py-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-[9px] bg-[#111111] text-[#F5CE42] px-1 py-0.2 shrink-0">
                01
              </span>
              <p className="font-extrabold text-[10px] sm:text-[11px] text-[#111111] leading-none">
                原材料名を撮影
              </p>
            </div>

            <span className="text-[#888888] text-xs font-black">→</span>

            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-[9px] bg-[#111111] text-[#F5CE42] px-1 py-0.2 shrink-0">
                02
              </span>
              <p className="font-extrabold text-[10px] sm:text-[11px] text-[#111111] leading-none">
                AI瞬時判定
              </p>
            </div>
          </div>
        </section>

        {/* 04. INSTALL Card (Hidden in PWA standalone mode) */}
        {mounted && !isStandalone && (
          <div className="swiss-card-dark p-2 sm:p-2.5 flex flex-col gap-1.5 group cursor-pointer block">
            <div className="flex items-center justify-between">
              <span className="font-display font-black text-[9px] sm:text-[10px] text-[#F5CE42] tracking-widest">
                04. INSTALL
              </span>
            </div>
            <button
              onClick={handleInstallClick}
              className="w-full py-2 sm:py-2.5 px-3 bg-[#F5CE42] hover:bg-[#E5BE32] text-[#111111] swiss-border-sm font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer group"
            >
              <span>📱 スマホのホーム画面に追加する →</span>
            </button>
          </div>
        )}
      </div>

      {/* PC DISPLAY (768px & above) - 2-COLUMN NO-SCROLL FIT GRID LAYOUT */}
      <div className="hidden md:grid grid-cols-2 gap-4 flex-1 my-2 min-h-0 overflow-hidden">
        {/* Left Column: 01. DATABASE + 03. HOW IT WORKS */}
        <div className="flex flex-col gap-3.5 justify-between h-full min-h-0">
          {/* 01. DATABASE Card */}
          <Link
            href="/search"
            className="swiss-card-dark p-4 flex flex-col justify-between gap-2.5 group hover:opacity-95 transition-opacity cursor-pointer block flex-1"
          >
            <div className="flex items-center justify-between border-b border-white/20 pb-1">
              <span className="font-display font-black text-xs text-[#F5CE42] tracking-widest">
                01. DATABASE
              </span>
              <span className="text-[11px] text-white/60 font-bold">無添加商品データベース</span>
            </div>

            <div className="my-auto">
              <h2 className="font-extrabold text-base lg:text-lg text-white mb-0.5">
                無添加食品データベース
              </h2>
              <p className="text-[11px] text-white/80 font-medium leading-normal">
                安全性チェック済みの食品や代替無添加商品を一覧・キーワードから検索できます。
              </p>
            </div>

            <div className="w-full py-2.5 px-4 bg-[#EF4444] text-white swiss-border font-black text-xs lg:text-sm flex items-center justify-center gap-2 group-hover:bg-[#DC2626] transition-colors shadow-sm">
              <Search className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>無添加商品を検索する</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 03. HOW IT WORKS Card */}
          <section className="swiss-card-white p-4 flex flex-col justify-between gap-2 flex-1">
            <h3 className="font-display font-black text-xs text-[#111111] tracking-widest border-b border-black pb-1 flex items-center justify-between">
              <span>03. HOW IT WORKS</span>
              <span className="text-[11px]">アプリの使い方</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 my-auto">
              <div className="flex flex-col gap-1 p-2 bg-[#FAF9F5] swiss-border-sm">
                <div className="flex items-center gap-1">
                  <span className="font-display font-black text-[10px] bg-[#111111] text-[#F5CE42] px-1.5 py-0.2 shrink-0">
                    STEP 01
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-[#111111]">原材料名を撮影・入力</h4>
                <p className="text-[10px] lg:text-[11px] text-[#555555] font-medium leading-tight">
                  裏面ラベルをカメラで撮影、またはテキストを直接入力します。
                </p>
              </div>

              <div className="flex flex-col gap-1 p-2 bg-[#FAF9F5] swiss-border-sm">
                <div className="flex items-center gap-1">
                  <span className="font-display font-black text-[10px] bg-[#111111] text-[#F5CE42] px-1.5 py-0.2 shrink-0">
                    STEP 02
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-[#111111]">AIが添加物を瞬時判定</h4>
                <p className="text-[10px] lg:text-[11px] text-[#555555] font-medium leading-tight">
                  高精度AIが気になる添加物を抽出し、リスク評価と代替案をご提案。
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: 02. SCANNER + 04. INSTALL */}
        <div className="flex flex-col gap-3.5 justify-between h-full min-h-0">
          {/* 02. SCANNER Card */}
          <div className="swiss-card-dark p-4 flex flex-col justify-between gap-2.5 flex-1 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/20 pb-1">
              <span className="font-display font-black text-xs text-[#F5CE42] tracking-widest">
                02. SCANNER
              </span>
              <span className="text-[11px] text-[#F5CE42] font-black">メイン解析機能</span>
            </div>

            <div className="my-auto">
              <h2 className="font-black text-lg lg:text-xl text-white mb-0.5 leading-snug">
                原材料名を撮影・入力する
              </h2>
              <p className="text-[11px] text-white/80 font-medium leading-normal">
                写真をアップロードするか、原材料テキストを貼り付けるだけで自動検出します。
              </p>
            </div>

            {mounted && !usable ? (
              <div className="w-full py-2.5 bg-[#333333] text-white/50 swiss-border text-center font-extrabold text-xs flex items-center justify-center gap-2 cursor-not-allowed">
                <Camera className="w-4 h-4" />
                <span>本日分（10回）の利用上限に達しました</span>
              </div>
            ) : (
              <Link
                href="/scan"
                className="w-full py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white swiss-border swiss-shadow font-black text-sm lg:text-base flex items-center justify-center gap-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 group"
              >
                <Camera className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span>判定スタート ➔</span>
              </Link>
            )}
          </div>

          {/* 04. INSTALL Card */}
          {mounted && !isStandalone && (
            <div className="swiss-card-dark p-3.5 flex flex-col justify-between gap-2 group cursor-pointer block">
              <div className="flex items-center justify-between border-b border-white/20 pb-1">
                <span className="font-display font-black text-[11px] text-[#F5CE42] tracking-widest">
                  04. INSTALL
                </span>
                <span className="text-[10px] text-white/60 font-bold">PWAアプリ化</span>
              </div>
              <p className="text-[11px] text-white/80 font-medium leading-tight">
                ホーム画面に追加してアプリとして起動できます。
              </p>
              <button
                onClick={handleInstallClick}
                className="w-full py-2.5 px-3 bg-[#F5CE42] hover:bg-[#E5BE32] text-[#111111] swiss-border font-black text-xs lg:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer group"
              >
                <span>📱 ホーム画面に追加してアプリとして利用する →</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Footer */}
      <footer className="pt-1 md:pt-1.5 border-t-2 border-black flex items-center justify-between text-xs shrink-0">
        <a
          href="https://gohannavi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display font-black tracking-widest text-[9px] sm:text-[10px] md:text-xs text-[#111111] hover:underline"
        >
          GOHANNAVI.COM
        </a>
        <a
          href="https://gohannavi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#111111] text-white px-2 py-0.5 md:px-3 md:py-1 font-display font-black text-[9px] md:text-xs tracking-wider hover:bg-[#EF4444] transition-colors flex items-center gap-1.5"
        >
          <span>READ BLOG</span>
          <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5" />
        </a>
      </footer>

      {/* PWA / iOS Home Screen Install Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="swiss-card-white p-4 max-w-sm w-full flex flex-col gap-3 relative">
            <button
              onClick={() => setShowIosGuide(false)}
              className="absolute top-2.5 right-2.5 p-1 text-[#111111] hover:bg-black/10 rounded-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-b-2 border-black pb-1.5">
              <Smartphone className="w-4 h-4 text-[#EF4444]" />
              <h3 className="font-display font-black text-xs sm:text-sm text-[#111111]">
                ホーム画面への追加方法
              </h3>
            </div>

            <p className="text-[11px] font-bold text-[#333333] leading-tight">
              アプリのようにワンタップで起動できるよう、ホーム画面に追加できます。
            </p>

            <div className="flex flex-col gap-2 my-0.5">
              <div className="flex items-start gap-2 bg-[#FAF9F5] p-2 swiss-border-sm">
                <span className="font-display font-black text-[10px] bg-[#111111] text-[#F5CE42] w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-[11px] font-bold text-[#111111] leading-snug">
                  ブラウザ下の <Share className="w-3.5 h-3.5 inline mx-0.5 text-[#007AFF]" /> 「共有ボタン」をタップ
                </p>
              </div>

              <div className="flex items-start gap-2 bg-[#FAF9F5] p-2 swiss-border-sm">
                <span className="font-display font-black text-[10px] bg-[#111111] text-[#F5CE42] w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-[11px] font-bold text-[#111111] leading-snug">
                  メニューから <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-[#111111]" /> 「ホーム画面に追加」をタップ
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-1.5 bg-[#111111] text-white swiss-border font-black text-xs hover:bg-[#EF4444] transition-colors"
            >
              とじる
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
