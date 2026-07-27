"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2, ExternalLink, ShoppingBag, AlertCircle, MessageSquare, ArrowUp } from "lucide-react";
import { generateAmazonLink, formatCleanCategory } from "@/lib/affiliateLinks";
import AdBanner from "@/components/AdBanner";

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

interface SearchResultListProps {
  keyword: string;
  autoFetch?: boolean;
  showAmazonBanner?: boolean;
}

export default function SearchResultList({
  keyword,
  autoFetch = true,
  showAmazonBanner = true,
}: SearchResultListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [recommendArticle, setRecommendArticle] = useState<RecommendArticle | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [fetchedKeyword, setFetchedKeyword] = useState<string>("");

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

      const getCleanUrl = (btn: HTMLAnchorElement | null): string | undefined => {
        if (!btn) return undefined;
        const href = (btn.getAttribute("href") || btn.href || "").trim();
        if (
          !href ||
          href === "#" ||
          href.includes("404") ||
          href.toLowerCase().includes("not-found") ||
          href.toLowerCase().includes("notfound")
        ) {
          return undefined;
        }
        return href;
      };

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
        amazonUrl: getCleanUrl(amazonBtn),
        rakutenUrl: getCleanUrl(rakutenBtn),
        yahooUrl: getCleanUrl(yahooBtn),
      });
    });

    return { newProducts, article };
  };

  const fetchSearch = async (targetKeyword: string) => {
    const trimmed = targetKeyword.trim();
    if (!trimmed) return;

    setLoading(true);
    setErrorMsg("");
    setFetchedKeyword(trimmed);
    setPage(1);

    try {
      const params = new URLSearchParams({
        keyword: trimmed,
        per_page: "12",
        page: "1",
      });
      const url = `https://gohannavi.com/wp-json/gohannavi/v1/search?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("商品の取得に失敗しました。");
      }

      const data = await res.json();
      const { newProducts, article } = parseResponseHtml(data.html || "");

      setProducts(newProducts);
      setRecommendArticle(article);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error("Search API Error:", err);
      setErrorMsg(err.message || "商品の取得中にエラーが発生しました。");
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && keyword && keyword !== "不明" && !keyword.includes("不明")) {
      fetchSearch(keyword);
    }
  }, [keyword, autoFetch]);

  const handleLoadMore = async () => {
    if (loadingMore || !fetchedKeyword) return;

    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      const params = new URLSearchParams({
        keyword: fetchedKeyword,
        per_page: "12",
        page: String(nextPage),
      });
      const url = `https://gohannavi.com/wp-json/gohannavi/v1/search?${params.toString()}`;

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

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!keyword || keyword === "不明" || keyword.includes("不明")) return null;

  const currentKeyword = fetchedKeyword || keyword;
  const cleanDisplayCategory = formatCleanCategory(currentKeyword);
  const amazonSearchUrl = generateAmazonLink(currentKeyword);

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-3 my-0.5">
      {/* Dynamic Amazon Ranking Banner Card */}
      {showAmazonBanner && (
        <div className="swiss-card-white p-3.5 sm:p-4 my-0.5">
          <a
            href={amazonSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[#FF9900] hover:bg-[#E68A00] text-white swiss-border swiss-shadow-sm flex items-center justify-between gap-3 transition-transform active:translate-x-0.5 active:translate-y-0.5 group"
          >
            <div className="flex flex-col text-left min-w-0">
              <span className="font-black text-xs sm:text-sm tracking-tight leading-snug">
                Amazonの売れ筋ランキング
              </span>
              <span className="font-bold text-[11px] sm:text-xs text-white/90 leading-snug mt-0.5">
                「無添加 {cleanDisplayCategory}」の商品を探す
              </span>
            </div>
            <ExternalLink className="w-5 h-5 text-white shrink-0 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="swiss-card-coral p-3.5 text-xs md:text-sm font-extrabold flex items-start gap-2 shrink-0">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="swiss-card-dark p-7 md:p-10 flex flex-col items-center justify-center gap-3.5 text-center shrink-0">
          <Loader2 className="w-8 h-8 text-[#F5CE42] animate-spin" />
          <p className="text-xs md:text-sm font-black text-white">「{fetchedKeyword}」の無添加商品をロード中...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="flex flex-col gap-3.5">
          {/* 2. Status Counter */}
          <div className="flex justify-between items-center px-1 text-xs md:text-sm font-black text-[#111111] shrink-0">
            <span>
              「<strong>{fetchedKeyword}</strong>」の検索結果
            </span>
            <span className="font-display">
              {products.length} / {total} 件
            </span>
          </div>

          {/* 3. Product Cards List */}
          <div className="flex flex-col gap-3.5">
            <div className="grid grid-cols-1 gap-3.5">
              {products.map((item) => (
                <div key={item.id} className="swiss-card-white p-4 flex flex-col justify-between gap-3 h-full">
                  <div className="flex flex-col gap-3">
                    {/* Top Image & Title + 口コミを見る */}
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
                  </div>

                  {/* Pochipp Affiliate Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-0.5 mt-auto">
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
            </div>

            {/* 4 & 5. Load More & Back to Top Buttons */}
            <div className="flex flex-col gap-2 mt-2">
              {products.length < total && (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="w-full py-3.5 bg-white hover:bg-[#FAF9F5] text-[#111111] swiss-border font-black text-xs sm:text-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
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
                className="w-full py-3.5 bg-[#121212] hover:bg-[#222222] text-[#F5CE42] swiss-border font-black text-xs sm:text-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowUp className="w-4 h-4" />
                <span>最初に戻る</span>
              </button>

              {/* AdBanner placed directly below "最初に戻る" button */}
              <div className="w-full max-w-[360px] mx-auto shrink-0 my-1">
                <AdBanner />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
