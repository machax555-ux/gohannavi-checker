// Amazon Affiliate and Gohannavi Blog Link Generator
import { mapCategoryToCommonName } from "./categoryMapping";

export function formatCleanCategory(rawKeyword?: string): string {
  return mapCategoryToCommonName(rawKeyword);
}

export function generateAmazonLink(rawKeyword: string): string {
  const cleanCat = formatCleanCategory(rawKeyword);
  const query = `無添加 ${cleanCat}`;
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(query)}&s=exact-aware-popularity-rank&tag=gohan06-22`;
}

export function generateBlogLink(rawKeyword?: string): string {
  if (!rawKeyword || rawKeyword === "不明" || rawKeyword.includes("不明") || rawKeyword.includes("読み取れ")) {
    return "https://gohannavi.com/";
  }
  const cleanCat = formatCleanCategory(rawKeyword);
  return `https://gohannavi.com/?s=${encodeURIComponent(cleanCat)}`;
}
