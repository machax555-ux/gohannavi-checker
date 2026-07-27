"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { resetUsage } from "@/lib/storage";
import SearchResultList from "@/components/SearchResultList";
import AffiliateNoticeFooter from "@/components/AffiliateNoticeFooter";

export default function SearchPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [submittedKeyword, setSubmittedKeyword] = useState<string>("");
  const [devResetMessage, setDevResetMessage] = useState<string>("");
  const tapCountRef = useRef<number>(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

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
            02. DATABASE
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
            className="px-5 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white swiss-border swiss-shadow-sm font-black text-xs md:text-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
          >
            検索
          </button>
        </form>
      </div>

      {/* Embedded Search Results Component */}
      {submittedKeyword ? (
        <SearchResultList key={submittedKeyword} keyword={submittedKeyword} autoFetch={true} />
      ) : (
        /* Initial State Guide */
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
    </main>
  );
}
