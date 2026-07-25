"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Loader2, ExternalLink, ShoppingBag, AlertCircle, MessageSquare, ArrowUp } from "lucide-react";

export interface SearchProduct {
  id: string;
  imageUrl: string;
  title: string;
  titleUrl: string;
  ingredients: string;
  price: string;
  amazonUrl?: string;
  rakutenUrl?: string;
  yahooUrl?: string;
}

export interface RecommendArticle {
  title: string;
  url: string;
}

export default function SearchPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [activeKeyword, setActiveKeyword] = useState<string>("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [recommendArticle, setRecommendArticle] = useState<RecommendArticle | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const parseResponseHtml = (html: string) => {
    if (typeof window === "undefined") return { newProducts: [], article: null };

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    let article: RecommendArticle | null = null;
    const recommendElem = doc.querySelector(".gh-search-recommend-link");
    if (recommendElem) {
      const linkAnchor = recommendElem.querySelector("a") as HTMLAnchorElement | null;
      if (linkAnchor) {
        article = {
          title: recommendElem.childNodes[0]?.textContent?.trim() || "おすすめ・まとめ記事はこちら",
          url: linkAnchor.getAttribute("href") || linkAnchor.href,
        };
      }
    }

    const boxElements = doc.querySelectorAll(".pochipp-box");
    const newProducts: SearchProduct[] = [];

    boxElements.forEach((box, index) => {
      const id = box.getAttribute("data-id") || `product-${index}-${Date.now()}`;

      const imgElem = box.querySelector(".pochipp-box__image img") as HTMLImageElement | null;
      const imageUrl = imgElem?.getAttribute("src") || imgElem?.src || "";

      const titleAnchor = box.querySelector(".pochipp-box__title a") as HTMLAnchorElement | null;
      const title = titleAnchor?.textContent?.trim() || "無添加商品";
      const titleUrl = titleAnchor?.getAttribute("href") || titleAnchor?.href || "#";

      const infoElem = box.querySelector(".pochipp-box__info");
      let ingredients = "";
      if (infoElem) {
        ingredients = infoElem.textContent?.trim().replace(/^【原材料】\s*/, "") || "";
      }

      const amazonBtn = box.querySelector(".pochipp-box__btnwrap.-amazon a") as HTMLAnchorElement | null;
      const rakutenBtn = box.querySelector(".pochipp-box__btnwrap.-rakuten a") as HTMLAnchorElement | null;
      const yahooBtn = box.querySelector(".pochipp-box__btnwrap.-yahoo a") as HTMLAnchorElement | null;

      newProducts.push({
        id,
        imageUrl,
        title,
        titleUrl,
        ingredients,
        price: "",
        amazonUrl: amazonBtn?.getAttribute("href") || amazonBtn?.href || undefined,
        rakutenUrl: rakutenBtn?.getAttribute("href") || rakutenBtn?.href || undefined,
        yahooUrl: yahooBtn?.getAttribute("href") || yahooBtn?.href || undefined,
      });
    });

    return { newProducts, article };
  };

  const executeSearch = async (targetKeyword: string) => {
    const trimmed = targetKeyword.trim();
    if (!trimmed) return;

    setLoading(true);
    setErrorMsg("");
    setHasSearched(true);
    setActiveKeyword(trimmed);
    setPage(1);

    try {
      const url = `https://gohannavi.com/wp-json/gohannavi/v1/search?keyword=${encodeURIComponent(
        trimmed
      )}&per_page=12&page=1`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("検索処理に失敗しました。");
      }

      const data = await res.json();
      const { newProducts, article } = parseResponseHtml(data.html || "");

      setProducts(newProducts);
      setRecommendArticle(article);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error("Search API Error:", err);
      setErrorMsg(err.message || "検索中にエラーが発生しました。");
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !activeKeyword) return;

    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      const url = `https://gohannavi.com/wp-json/gohannavi/v1/search?keyword=${encodeURIComponent(
        activeKeyword
      )}&per_page=12&page=${nextPage}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("追加読み込みに失敗しました。");
      }

      const data = await res.json();
      const { newProducts } = parseResponseHtml(data.html || "");

      setProducts((prev) => [...prev, ...newProducts]);
      setPage(nextPage);
    } catch (err: any) {
      console.error("Load More Error:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(keyword);
  };

  return (
    <main ref={mainRef} className="flex-1 flex flex-col justify-start overflow-y-auto py-2 gap-3 pb-6">
      {/* Header Bar */}
      <header className="flex flex-col gap-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="bg-[#121212] text-white px-3 py-1.5 swiss-border text-xs font-black font-display tracking-wider flex items-center gap-1.5 hover:bg-[#EF4444] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>HOME</span>
          </Link>
          <span className="font-display font-black text-xs text-[#111111] bg-white px-3 py-1.5 swiss-border">
            SEARCH DATABASE
          </span>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <span className="font-display font-black text-xs text-[#111111] tracking-widest">
            02. DATABASE
          </span>
          <h1 className="font-display font-black text-3xl text-[#111111] leading-none">
            無添加商品検索
          </h1>
        </div>

        <div className="w-full h-[3px] bg-[#111111]" />
      </header>

      {/* Search Input Box */}
      <div className="swiss-card-white p-4 sm:p-5 flex flex-col gap-2.5 shrink-0">
        <span className="font-display font-black text-xs text-[#111111] tracking-widest border-b-2 border-black pb-1.5">
          SEARCH KEYWORD
        </span>
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="醤油・めんつゆ・お菓子・ラーメン・・・・"
              className="w-full pl-3.5 pr-9 py-3 bg-white text-[#111111] swiss-border-sm text-xs font-extrabold focus:outline-none placeholder:text-[#777777]"
            />
            <Search className="w-4 h-4 text-[#111111] absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            disabled={loading || !keyword.trim()}
            className="px-4 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white swiss-border swiss-shadow-sm font-black text-xs transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            検索
          </button>
        </form>
      </div>

      {/* Recommend Article Link */}
      {recommendArticle && (
        <a
          href={recommendArticle.url}
          target="_blank"
          rel="noopener noreferrer"
          className="swiss-card-dark p-3.5 flex items-center justify-between gap-2 shrink-0 group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <ShoppingBag className="w-5 h-5 text-[#F5CE42] shrink-0" />
            <span className="text-xs font-black text-white truncate group-hover:text-[#F5CE42] transition-colors">
              {recommendArticle.title}
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-[#F5CE42] shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </a>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="swiss-card-coral p-3.5 text-xs font-extrabold flex items-start gap-2 shrink-0">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Results / Loading / Guide Section */}
      {loading ? (
        <div className="swiss-card-dark p-7 flex flex-col items-center justify-center gap-3.5 text-center shrink-0 mt-1">
          <Loader2 className="w-8 h-8 text-[#F5CE42] animate-spin" />
          <p className="text-xs font-black text-white">無添加商品をデータベースから検索中...</p>
        </div>
      ) : hasSearched ? (
        <div className="flex-1 flex flex-col gap-3.5 mt-1">
          {/* Status Counter */}
          <div className="flex justify-between items-center px-1 text-xs font-black text-[#111111] shrink-0">
            <span>
              「<strong>{activeKeyword}</strong>」の検索結果
            </span>
            <span className="font-display">
              {products.length} / {total} 件
            </span>
          </div>

          {/* Product Cards List */}
          {products.length > 0 ? (
            <div className="flex flex-col gap-3.5">
              {products.map((item) => (
                <div key={item.id} className="swiss-card-white p-4 flex flex-col gap-3">
                  {/* Top Image & Title + 口コミを見る (Aligned with bottom line of product image border frame) */}
                  <div className="flex gap-3 items-start">
                    {item.imageUrl ? (
                      <a
                        href={item.titleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-20 h-20 shrink-0 bg-white p-1.5 swiss-border flex items-center justify-center"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-contain bg-white"
                        />
                      </a>
                    ) : (
                      <div className="w-20 h-20 shrink-0 bg-white swiss-border flex items-center justify-center text-[#111111] text-xs font-black">
                        NO IMAGE
                      </div>
                    )}

                    <div className="flex-1 flex flex-col justify-between h-20 min-w-0">
                      <a
                        href={item.titleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-extrabold text-xs sm:text-sm text-[#111111] line-clamp-2 hover:underline leading-snug"
                      >
                        {item.title}
                      </a>

                      {/* 口コミを見る (Aligned with bottom line of product image's black border frame) */}
                      <div className="flex items-center gap-1.5 text-[#3B7A87] pb-0.5">
                        <MessageSquare className="w-4 h-4 fill-[#3B7A87] text-[#3B7A87]" />
                        <span className="font-extrabold text-xs tracking-wide text-[#3B7A87]">
                          口コミを見る
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 【原材料名】 (Ingredients Box) */}
                  {item.ingredients && (
                    <div className="bg-[#F5CE42]/20 p-2.5 swiss-border-sm text-xs leading-relaxed text-[#333333] font-bold">
                      <span className="text-[#111111] block mb-0.5 font-extrabold">【原材料名】</span>
                      <p className="line-clamp-2">{item.ingredients}</p>
                    </div>
                  )}

                  {/* Pochipp Affiliate Buttons (Amazon: Orange, 楽天市場: Red, Yahoo!: Sky Blue) */}
                  <div className="grid grid-cols-3 gap-2 pt-0.5">
                    {/* 1st: Amazon */}
                    {item.amazonUrl ? (
                      <a
                        href={item.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-1 bg-[#FA9E2C] hover:bg-[#E08A1E] text-white swiss-border-sm rounded-full text-center font-extrabold text-xs transition-transform active:translate-x-0.5 active:translate-y-0.5 shadow-xs"
                      >
                        Amazon
                      </a>
                    ) : (
                      <div className="py-2.5 px-1 bg-gray-200 text-gray-400 swiss-border-sm rounded-full text-center font-bold text-xs cursor-not-allowed">
                        Amazon
                      </div>
                    )}

                    {/* 2nd: 楽天市場 */}
                    {item.rakutenUrl ? (
                      <a
                        href={item.rakutenUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-1 bg-[#E52E2E] hover:bg-[#C92222] text-white swiss-border-sm rounded-full text-center font-extrabold text-xs transition-transform active:translate-x-0.5 active:translate-y-0.5 shadow-xs"
                      >
                        楽天市場
                      </a>
                    ) : (
                      <div className="py-2.5 px-1 bg-gray-200 text-gray-400 swiss-border-sm rounded-full text-center font-bold text-xs cursor-not-allowed">
                        楽天市場
                      </div>
                    )}

                    {/* 3rd: Yahoo!ショッピング */}
                    {item.yahooUrl ? (
                      <a
                        href={item.yahooUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-1 bg-[#3485E9] hover:bg-[#256ECB] text-white swiss-border-sm rounded-full text-center font-extrabold text-xs transition-transform active:translate-x-0.5 active:translate-y-0.5 shadow-xs truncate"
                      >
                        Yahoo!
                      </a>
                    ) : (
                      <div className="py-2.5 px-1 bg-gray-200 text-gray-400 swiss-border-sm rounded-full text-center font-bold text-xs cursor-not-allowed">
                        Yahoo!
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Load More & Back to Top Buttons */}
              <div className="flex flex-col gap-2 mt-1">
                {products.length < total && (
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="w-full py-3.5 bg-white hover:bg-[#FAF9F5] text-[#111111] swiss-border font-black text-xs transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>読み込み中...</span>
                      </>
                    ) : (
                      <span>もっと見る ({products.length} / {total} 件)</span>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={scrollToTop}
                  className="w-full py-3 bg-[#121212] hover:bg-[#222222] text-[#F5CE42] swiss-border font-black text-xs transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-1.5"
                >
                  <ArrowUp className="w-4 h-4" />
                  <span>最初に戻る</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="swiss-card-white p-6 text-center flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-8 h-8 text-[#111111]" />
              <p className="text-xs font-extrabold text-[#111111]">
                見つかりませんでした。別のキーワードをお試しください。
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Initial State Guide */
        <div className="swiss-card-white p-5 text-center flex flex-col items-center justify-center gap-3 shrink-0 mt-1">
          <div className="w-12 h-12 bg-[#121212] text-[#F5CE42] swiss-border flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-black text-[#111111]">無添加食品をキーワードで探す</p>
            <p className="text-xs text-[#444444] font-bold leading-relaxed">
              気になる商品やカテゴリー（ぽん酢・めんつゆ・おやつ・塩など）を入力してください
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="pt-2 border-t-3 border-black text-center shrink-0 mt-auto">
        <a
          href="https://gohannavi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display font-black tracking-widest text-[10px] text-[#111111] hover:underline inline-block"
        >
          GOHANNAVI.COM
        </a>
      </footer>
    </main>
  );
}
