"use client";

import React from "react";
import { ShoppingBag, BookOpen } from "lucide-react";
import { generateAmazonLink, generateBlogLink } from "@/lib/affiliateLinks";

interface AlternativeProductsProps {
  blogKeyword?: string;
  productCategory?: string;
}

export default function AlternativeProducts({
  blogKeyword,
  productCategory,
}: AlternativeProductsProps) {
  const keyword = blogKeyword || productCategory || "食品";

  const amazonUrl = generateAmazonLink(keyword);
  const blogUrl = generateBlogLink(keyword);

  return (
    <div className="w-full flex flex-col gap-4 my-4">
      {/* ① Amazonアフィリエイトセクション */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 shadow-sm flex flex-col gap-3">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#F4A261]" />
          🛒 無添加の代替商品はこちら
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          「{keyword}」の添加物が気になる方へ。Amazonで購入可能な安心・安全の無添加アイテムをご紹介します。
        </p>
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 bg-[#F4A261] hover:bg-[#e7924e] text-white rounded-2xl font-bold text-sm text-center shadow-md transition active:scale-[0.98] block"
        >
          Amazonで無添加商品を探す →
        </a>
      </div>

      {/* ② ごはんなびブログ誘導バナー */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 shadow-sm flex flex-col gap-3">
        <h3 className="font-bold text-[#2D6A4F] text-base flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#2D6A4F]" />
          📖 ごはんなびで詳しく解説中！
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          「{keyword}」に含まれる添加物の安全性や選び方のポイントをごはんなびブログで詳しく紹介しています。
        </p>
        <a
          href={blogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 bg-[#2D6A4F] hover:bg-[#255740] text-white rounded-2xl font-bold text-sm text-center shadow-md transition active:scale-[0.98] block"
        >
          ごはんなびで記事を読む →
        </a>
      </div>
    </div>
  );
}
