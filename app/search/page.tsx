"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Loader2, ExternalLink, ShoppingBag, AlertCircle } from "lucide-react";

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

  // Helper to parse html string from API
  const parseResponseHtml = (html: string) => {
    if (typeof window === "undefined") return { newProducts: [], article: null };

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Extract Recommend Article Link if present
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

    // Extract Products
    const boxElements = doc.querySelectorAll(".pochipp-box");
    const newProducts: SearchProduct[] = [];

    boxElements.forEach((box, index) => {
      const id = box.getAttribute("data-id") || `product-${index}-${Date.now()}`;

      // Image
      const imgElem = box.querySelector(".pochipp-box__image img") as HTMLImageElement | null;
      const imageUrl = imgElem?.getAttribute("src") || imgElem?.src || "";

      // Title & Link
      const titleAnchor = box.querySelector(".pochipp-box__title a") as HTMLAnchorElement | null;
      const title = titleAnchor?.textContent?.trim() || "無添加商品";
      const titleUrl = titleAnchor?.getAttribute("href") || titleAnchor?.href || "#";

      // Ingredients
      const infoElem = box.querySelector(".pochipp-box__info");
      let ingredients = "";
      if (infoElem) {
        ingredients = infoElem.textContent?.trim().replace(/^【原材料】\s*/, "") || "";
      }

      // Price
      const priceElem = box.querySelector(".pochipp-box__price");
      let price = "";
      if (priceElem) {
        const clone = priceElem.cloneNode(true) as HTMLElement;
        const span = clone.querySelector("span");
        if (span) span.remove();
        price = clone.textContent?.trim() || "";
      }

      // Affiliate links
      const amazonBtn = box.querySelector(".pochipp-box__btnwrap.-amazon a") as HTMLAnchorElement | null;
      const rakutenBtn = box.querySelector(".pochipp-box__btnwrap.-rakuten a") as HTMLAnchorElement | null;
      const yahooBtn = box.querySelector(".pochipp-box__btnwrap.-yahoo a") as HTMLAnchorElement | null;

      newProducts.push({
        id,
        imageUrl,
        title,
        titleUrl,
        ingredients,
        price,
        amazonUrl: amazonBtn?.getAttribute("href") || amazonBtn?.href || undefined,
        rakutenUrl: rakutenBtn?.getAttribute("href") || rakutenBtn?.href || undefined,
        yahooUrl: yahooBtn?.getAttribute("href") || yahooBtn?.href || undefined,
      });
    });

    return { newProducts, article };
  };

  // Perform search (Page 1)
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

  // Load More (Page 2+)
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
    <main className="flex-1 flex flex-col p-4 sm:p-5 pb-10">
      {/* Header Bar */}
      <div className="flex items-center gap-3 mb-3">
        <Link href="/" className="p-2 text-[#78716C] hover:text-[#1C1917] rounded-full hover:bg-white transition shadow-xs border border-transparent hover:border-[#E7E5E4]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base sm:text-lg font-extrabold text-[#1C1917]">無添加商品検索</h1>
      </div>

      {/* 1. Search Box Form */}
      <form onSubmit={handleFormSubmit} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="商品名、メーカー名、お菓子、ラーメンなど..."
            className="w-full pl-4 pr-10 py-3.5 border border-[#D6D3D1] rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-[#1B4332] focus:outline-none bg-white text-[#1C1917] shadow-xs"
          />
          <Search className="w-4 h-4 text-[#78716C] absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="submit"
          disabled={loading || !keyword.trim()}
          className="px-5 py-3.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 shrink-0 border border-[#2D6A4F]"
        >
          検索
        </button>
      </form>

      {/* Recommend Article Banner */}
      {recommendArticle && (
        <a
          href={recommendArticle.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-4 bg-[#E8F5E9] border border-[#A5D6A7] rounded-2xl mb-4 flex items-center justify-between gap-3 shadow-xs hover:bg-[#E8F5E9]/80 transition group"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#1B4332] shrink-0" />
            <span className="text-xs sm:text-sm font-extrabold text-[#1B4332]">
              {recommendArticle.title}
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-[#1B4332] group-hover:translate-x-0.5 transition-transform shrink-0" />
        </a>
      )}

      {/* Error Message Banner */}
      {errorMsg && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl text-xs text-[#991B1B] mb-4 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#991B1B] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20 text-center bg-white border border-[#E7E5E4] rounded-3xl shadow-xs">
          <Loader2 className="w-9 h-9 text-[#1B4332] animate-spin" />
          <p className="text-xs sm:text-sm font-extrabold text-[#1B4332]">無添加商品を検索中...</p>
        </div>
      ) : hasSearched ? (
        <>
          {/* Result Count Status */}
          <div className="flex justify-between items-center mb-3 px-1 text-xs text-[#78716C] font-semibold">
            <span>
              「<strong className="text-[#1C1917]">{activeKeyword}</strong>」の検索結果
            </span>
            <span>
              {products.length} / {total} 件
            </span>
          </div>

          {/* 3. Result Grid */}
          {products.length > 0 ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-[#E7E5E4] rounded-3xl p-4 shadow-xs flex flex-col justify-between gap-3 hover:border-[#D6D3D1] transition"
                  >
                    <div className="flex gap-3">
                      {/* Product Image */}
                      {item.imageUrl ? (
                        <a
                          href={item.titleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-20 h-20 shrink-0 rounded-2xl border border-[#E7E5E4] overflow-hidden bg-[#FAF9F5] flex items-center justify-center p-1"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-contain"
                          />
                        </a>
                      ) : (
                        <div className="w-20 h-20 shrink-0 rounded-2xl bg-[#F5F5F4] border border-[#E7E5E4] flex items-center justify-center text-[#78716C] text-[10px] font-bold">
                          No Image
                        </div>
                      )}

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <a
                            href={item.titleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-extrabold text-xs sm:text-sm text-[#1C1917] line-clamp-2 hover:text-[#1B4332] transition leading-snug"
                          >
                            {item.title}
                          </a>
                          {item.price && (
                            <p className="text-xs sm:text-sm font-black text-[#991B1B] mt-1">
                              {item.price}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ingredients List */}
                    {item.ingredients && (
                      <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-[#E7E5E4] text-[11px] leading-relaxed text-[#78716C]">
                        <span className="font-bold text-[#1C1917] block mb-0.5">【原材料】</span>
                        <p className="line-clamp-3">{item.ingredients}</p>
                      </div>
                    )}

                    {/* Action Buttons (Amazon / Rakuten / Yahoo) */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {item.amazonUrl ? (
                        <a
                          href={item.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-1 bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-[11px] rounded-xl text-center shadow-xs transition active:scale-[0.98]"
                        >
                          Amazon
                        </a>
                      ) : (
                        <div className="py-2 px-1 bg-[#F5F5F4] text-[#A8A29E] font-bold text-[11px] rounded-xl text-center cursor-not-allowed border border-[#E7E5E4]">
                          Amazon
                        </div>
                      )}

                      {item.rakutenUrl ? (
                        <a
                          href={item.rakutenUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-1 bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-bold text-[11px] rounded-xl text-center shadow-xs transition active:scale-[0.98]"
                        >
                          楽天市場
                        </a>
                      ) : (
                        <div className="py-2 px-1 bg-[#F5F5F4] text-[#A8A29E] font-bold text-[11px] rounded-xl text-center cursor-not-allowed border border-[#E7E5E4]">
                          楽天市場
                        </div>
                      )}

                      {item.yahooUrl ? (
                        <a
                          href={item.yahooUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-1 bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-[11px] rounded-xl text-center shadow-xs transition active:scale-[0.98]"
                        >
                          Yahoo
                        </a>
                      ) : (
                        <div className="py-2 px-1 bg-[#F5F5F4] text-[#A8A29E] font-bold text-[11px] rounded-xl text-center cursor-not-allowed border border-[#E7E5E4]">
                          Yahoo
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Pagination */}
              {products.length < total && (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="w-full py-3.5 bg-white hover:bg-[#FAF9F5] border border-[#D6D3D1] text-[#1C1917] font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-xs mt-2 flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#1B4332]" />
                      <span>読み込み中...</span>
                    </>
                  ) : (
                    <span>もっと見る ({products.length} / {total} 件)</span>
                  )}
                </button>
              )}
            </div>
          ) : (
            /* 4. Result 0 items */
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3 bg-white border border-[#E7E5E4] rounded-3xl p-6 shadow-xs">
              <AlertCircle className="w-8 h-8 text-[#78716C]" />
              <p className="text-xs sm:text-sm font-bold text-[#1C1917] leading-relaxed">
                見つかりませんでした。別のキーワードをお試しください。
              </p>
            </div>
          )}
        </>
      ) : (
        /* Initial State Guide */
        <div className="py-16 text-center flex flex-col items-center justify-center gap-3 bg-white border border-[#E7E5E4] rounded-3xl p-6 shadow-xs">
          <div className="p-3 bg-[#E8F5E9] rounded-full border border-[#A5D6A7]">
            <Search className="w-6 h-6 text-[#1B4332]" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-extrabold text-[#1B4332]">無添加食品をキーワードで探す</p>
            <p className="text-xs text-[#78716C]">
              気になる商品名やカテゴリ（無添加ぽん酢、オーガニックお菓子など）を入力してください。
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
