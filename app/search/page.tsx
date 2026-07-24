"use client";

import React, { useState, useEffect, useCallback } from "react";
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
      <div className="flex items-center gap-3 mb-4">
        <Link href="/" className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">無添加商品検索</h1>
      </div>

      {/* 1. Search Box Form */}
      <form onSubmit={handleFormSubmit} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="商品名、メーカー名、お菓子、ラーメンなど..."
            className="w-full pl-4 pr-10 py-3.5 border border-gray-300 rounded-2xl text-sm focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] focus:outline-none bg-white shadow-sm"
          />
          <Search className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="submit"
          disabled={loading || !keyword.trim()}
          className="px-5 py-3.5 bg-[#2D6A4F] hover:bg-[#255740] text-white font-bold text-sm rounded-2xl shadow-md transition active:scale-[0.98] disabled:opacity-50 shrink-0"
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
          className="w-full p-4 bg-emerald-50 border border-emerald-200 rounded-2xl mb-4 flex items-center justify-between gap-3 shadow-sm hover:bg-emerald-100/70 transition"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#2D6A4F] shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-[#2D6A4F]">
              {recommendArticle.title}
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-[#2D6A4F] shrink-0" />
        </a>
      )}

      {/* Error Message Banner */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-[#E63946] mb-4 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Loader2 className="w-10 h-10 text-[#2D6A4F] animate-spin" />
          <p className="text-sm font-bold text-[#2D6A4F]">無添加商品を検索中...</p>
        </div>
      ) : hasSearched ? (
        <>
          {/* Result Count Status */}
          <div className="flex justify-between items-center mb-3 px-1 text-xs text-gray-500 font-medium">
            <span>
              「<strong className="text-gray-900">{activeKeyword}</strong>」の検索結果
            </span>
            <span>
              {products.length} / {total} 件
            </span>
          </div>

          {/* 3. Result Grid */}
          {products.length > 0 ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-100 rounded-3xl p-4 shadow-md flex flex-col justify-between gap-3"
                  >
                    <div className="flex gap-3">
                      {/* Product Image */}
                      {item.imageUrl ? (
                        <a
                          href={item.titleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-24 h-24 shrink-0 rounded-2xl border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center p-1"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-contain"
                          />
                        </a>
                      ) : (
                        <div className="w-24 h-24 shrink-0 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
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
                            className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 hover:text-[#2D6A4F] transition leading-snug"
                          >
                            {item.title}
                          </a>
                          {item.price && (
                            <p className="text-sm font-extrabold text-[#E63946] mt-1">
                              {item.price}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ingredients List */}
                    {item.ingredients && (
                      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-[11px] leading-relaxed text-gray-600">
                        <span className="font-bold text-gray-700 block mb-0.5">【原材料】</span>
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
                          className="py-2 px-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] rounded-xl text-center shadow-sm transition active:scale-[0.98]"
                        >
                          Amazon
                        </a>
                      ) : (
                        <div className="py-2 px-1 bg-gray-100 text-gray-400 font-bold text-[11px] rounded-xl text-center cursor-not-allowed">
                          Amazon
                        </div>
                      )}

                      {item.rakutenUrl ? (
                        <a
                          href={item.rakutenUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] rounded-xl text-center shadow-sm transition active:scale-[0.98]"
                        >
                          楽天市場
                        </a>
                      ) : (
                        <div className="py-2 px-1 bg-gray-100 text-gray-400 font-bold text-[11px] rounded-xl text-center cursor-not-allowed">
                          楽天市場
                        </div>
                      )}

                      {item.yahooUrl ? (
                        <a
                          href={item.yahooUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-1 bg-red-500 hover:bg-red-600 text-white font-bold text-[11px] rounded-xl text-center shadow-sm transition active:scale-[0.98]"
                        >
                          Yahoo
                        </a>
                      ) : (
                        <div className="py-2 px-1 bg-gray-100 text-gray-400 font-bold text-[11px] rounded-xl text-center cursor-not-allowed">
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
                  className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm rounded-2xl transition shadow-sm mt-2 flex items-center justify-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#2D6A4F]" />
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
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3 bg-gray-50 border border-gray-100 rounded-3xl p-6">
              <AlertCircle className="w-10 h-10 text-gray-400" />
              <p className="text-sm font-bold text-gray-700 leading-relaxed">
                見つかりませんでした。別のキーワードをお試しください。
              </p>
            </div>
          )}
        </>
      ) : (
        /* Initial State Guide */
        <div className="py-16 text-center flex flex-col items-center justify-center gap-3 bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6">
          <Search className="w-10 h-10 text-[#2D6A4F]" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-[#2D6A4F]">無添加食品をキーワードで探す</p>
            <p className="text-xs text-gray-500">
              気になる商品名やカテゴリ（無添加ぽん酢、オーガニックお菓子など）を入力してください。
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
