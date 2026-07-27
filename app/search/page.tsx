"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Smartphone, Share, PlusSquare, X } from "lucide-react";
import { resetUsage } from "@/lib/storage";
import SearchResultList from "@/components/SearchResultList";
import AffiliateNoticeFooter from "@/components/AffiliateNoticeFooter";

export default function SearchPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [submittedKeyword, setSubmittedKeyword] = useState<string>("");
  const [devResetMessage, setDevResetMessage] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);

  const tapCountRef = useRef<number>(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);

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

  const handleHeaderBadgeClick = () => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

    if (tapCountRef.current >= 5) {
      resetUsage();
      tapCountRef.current = 0;
      setDevResetMessage("開発者モード: 本日の利用回数をリセットしました！");
      setTimeout(() => setDevResetMessage(""), 3500);
      return;
    }

    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      setSubmittedKeyword(keyword.trim());
    }
  };

  return (
    <main ref={mainRef} className="flex-1 flex flex-col justify-start overflow-y-auto py-2 gap-3 pb-6 max-w-full md:max-w-[1200px] md:mx-auto w-full">
      {/* Header Bar */}
      <header className="flex flex-col gap-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="bg-[#121212] text-white px-3 py-1.5 md:px-4 md:py-2 swiss-border text-xs md:text-sm font-black font-display tracking-wider flex items-center gap-1.5 hover:bg-[#EF4444] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span>HOME</span>
          </Link>
          <button
            type="button"
            onClick={handleHeaderBadgeClick}
            className="font-display font-black text-xs md:text-sm text-[#111111] bg-white px-3 py-1.5 md:px-4 md:py-2 swiss-border hover:bg-[#F5CE42] transition-colors cursor-pointer select-none"
          >
            SEARCH DATABASE
          </button>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <span className="font-display font-black text-xs md:text-sm text-[#111111] tracking-widest">
            01. DATABASE
          </span>
          <h1 className="font-display font-black text-3xl md:text-4xl text-[#111111] leading-none">
            無添加商品検索
          </h1>
        </div>

        <div className="w-full h-[3px] bg-[#111111]" />
      </header>

      {/* Dev Reset Toast Message */}
      {devResetMessage && (
        <div className="swiss-card-dark p-3 text-xs md:text-sm font-black text-[#F5CE42] text-center border-2 border-black shrink-0 animate-bounce">
          ⚡ {devResetMessage}
        </div>
      )}

      {/* Search Input Box */}
      <div className="swiss-card-white p-4 sm:p-5 flex flex-col gap-2.5 shrink-0">
        <span className="font-display font-black text-xs md:text-sm text-[#111111] tracking-widest border-b-2 border-black pb-1.5">
          SEARCH KEYWORD
        </span>
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="醤油・めんつゆ・お菓子・ラーメン・・・・"
              className="w-full pl-3.5 pr-9 py-3 bg-white text-[#111111] swiss-border-sm text-xs md:text-sm font-extrabold focus:outline-none placeholder:text-[#777777]"
            />
            <Search className="w-4 h-4 md:w-5 md:h-5 text-[#111111] absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            disabled={!keyword.trim()}
            className="px-5 py-3 bg-[#10B981] hover:bg-[#059669] text-white swiss-border swiss-shadow-sm font-black text-xs md:text-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
          >
            検索
          </button>
        </form>
      </div>

      {/* Embedded Search Results Component */}
      {submittedKeyword ? (
        <SearchResultList key={submittedKeyword} keyword={submittedKeyword} autoFetch={true} />
      ) : (
        /* Initial State Guide + Install Card Container */
        <div className="flex flex-col gap-3 shrink-0">
          {/* Initial State Guide Card */}
          <div className="swiss-card-white p-5 md:p-8 text-center flex flex-col items-center justify-center gap-3 shrink-0 mt-1">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#121212] text-[#F5CE42] swiss-border flex items-center justify-center">
              <Search className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm md:text-lg font-black text-[#111111]">無添加食品をキーワードで探す</p>
              <p className="text-xs md:text-sm text-[#444444] font-bold leading-relaxed">
                気になる商品やカテゴリー（ぽん酢・めんつゆ・おやつ・塩など）を入力してください
              </p>
            </div>
          </div>

          {/* INSTALL Card (Directly below initial guide card, hidden in PWA standalone mode) */}
          {mounted && !isStandalone && (
            <div className="swiss-card-dark p-3.5 sm:p-4 flex flex-col gap-2.5 group cursor-pointer block shrink-0">
              <div className="flex items-center justify-between border-b border-white/20 pb-1">
                <span className="font-display font-black text-[11px] sm:text-xs text-[#F5CE42] tracking-widest">
                  INSTALL
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-white/80 font-medium leading-tight">
                ホーム画面に追加してワンタップで簡単起動できます。
              </p>
              <button
                onClick={handleInstallClick}
                className="w-full py-2.5 sm:py-3 px-3 bg-[#F5CE42] hover:bg-[#E5BE32] text-[#111111] swiss-border-sm font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer group"
              >
                <span>📱 スマホのホーム画面に追加する →</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      {submittedKeyword ? (
        <AffiliateNoticeFooter />
      ) : (
        <footer className="pt-2 border-t-3 border-black text-center shrink-0 mt-auto">
          <a
            href="https://gohannavi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-black tracking-widest text-[10px] md:text-xs text-[#111111] hover:underline inline-block"
          >
            GOHANNAVI.COM
          </a>
        </footer>
      )}

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
