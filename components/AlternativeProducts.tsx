"use client";

import React from "react";
import { ShoppingBag, BookOpen, ExternalLink } from "lucide-react";
import { generateAmazonLink, generateBlogLink, formatCleanCategory } from "@/lib/affiliateLinks";

interface AlternativeProductsProps {
  blogKeyword?: string;
  productCategory?: string;
}

export default function AlternativeProducts({
  blogKeyword,
  productCategory,
}: AlternativeProductsProps) {
  const rawKey = blogKeyword || productCategory || "お菓子";
  const cleanCategory = formatCleanCategory(rawKey);
  
  const amazonUrl = generateAmazonLink(rawKey);
  const blogUrl = generateBlogLink(rawKey);

  return (
    <div className="w-full flex flex-col gap-4 my-2">
      {/* 03. CLEAN ALTERNATIVES Header Banner (App Green Color Scheme #10B981) */}
      <div className="swiss-card-dark p-5 flex flex-col gap-3">
        <span className="font-display font-black text-xs text-[#F5CE42] tracking-widest border-b border-white/20 pb-1">
          03. CLEAN ALTERNATIVES
        </span>

        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-[#10B981] text-white swiss-border-sm shrink-0">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base leading-tight">
              食品添加物無添加商品をご案内
            </h3>
            <p className="text-xs text-white/80 font-medium mt-1 leading-snug">
              「{cleanCategory}」の無添加商品をAmazonでチェック
            </p>
          </div>
        </div>

        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 bg-[#10B981] hover:bg-[#059669] text-white swiss-border swiss-shadow-sm font-black text-sm text-center flex items-center justify-center gap-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 group mt-1"
        >
          <span>Amazonで「無添加 {cleanCategory}」の商品を探す</span>
          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Blog Link Card */}
      <div className="swiss-card-white p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b-2 border-black pb-1">
          <span className="font-display font-black text-xs text-[#111111] tracking-widest">
            GOHANNAVI BLOG
          </span>
          <BookOpen className="w-4 h-4 text-[#111111]" />
        </div>

        <h4 className="font-extrabold text-sm text-[#111111] leading-snug">
          「{cleanCategory}」に入る食品添加物や無添加商品をごはんなびで詳しく解説中
        </h4>

        <a
          href={blogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 bg-[#121212] hover:bg-[#222222] text-[#F5CE42] swiss-border font-display font-black text-xs text-center flex items-center justify-center gap-2 transition-colors"
        >
          <span>READ ARTICLE / 記事を読む</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
