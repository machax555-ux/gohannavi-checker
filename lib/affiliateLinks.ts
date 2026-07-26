// Amazon Affiliate and Gohannavi Blog Link Generator

export function formatCleanCategory(rawKeyword?: string): string {
  if (!rawKeyword || rawKeyword === "不明" || rawKeyword.includes("不明") || rawKeyword.includes("読み取れ")) {
    return "不明";
  }
  
  let cleaned = rawKeyword
    .replace(/^CATEGORY:\s*/i, "")
    .replace(/無添加/g, "")
    .replace(/ごま/g, "")
    .replace(/有機/g, "")
    .replace(/特選/g, "")
    .replace(/無塩/g, "")
    .trim();

  if (cleaned.includes("加工肉") || cleaned.includes("ソーセージ") || cleaned.includes("ハム") || cleaned.includes("ベーコン")) {
    return "加工肉";
  }
  if (cleaned.includes("菓子") || cleaned.includes("おやつ") || cleaned.includes("スナック")) {
    return "お菓子";
  }
  if (cleaned.includes("醤油") || cleaned.includes("しょうゆ")) {
    return "醤油";
  }
  if (cleaned.includes("ぽん酢") || cleaned.includes("ポン酢")) {
    return "ポン酢";
  }
  if (cleaned.includes("めんつゆ") || cleaned.includes("つゆ")) {
    return "めんつゆ";
  }
  if (cleaned.includes("みそ") || cleaned.includes("味噌")) {
    return "味噌";
  }

  return cleaned || "お菓子";
}

export function generateAmazonLink(rawKeyword: string): string {
  const cleanCat = formatCleanCategory(rawKeyword);
  const query = `無添加 ${cleanCat}`;
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(query)}&tag=gohannavi-22`;
}

export function generateBlogLink(rawKeyword?: string): string {
  if (!rawKeyword || rawKeyword === "不明" || rawKeyword.includes("不明") || rawKeyword.includes("読み取れ")) {
    return "https://gohannavi.com/";
  }
  const cleanCat = formatCleanCategory(rawKeyword);
  return `https://gohannavi.com/?s=${encodeURIComponent(cleanCat)}`;
}
