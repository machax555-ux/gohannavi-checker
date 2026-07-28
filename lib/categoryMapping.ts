/**
 * 食品表示の「名称」欄（法律上の分類名）から「一般的な検索カテゴリー名」への自動変換マッピング辞書
 * 
 * 今後新しい変換ペアを追加・編集する際は、以下の dictionary オブジェクトに
 * "法律上の名称": "検索用カテゴリー名" の形式で追記してください。
 */
export const CATEGORY_DICTIONARY: Record<string, string> = {
  // 菓子類
  "米菓": "せんべい",
  "油菓子": "ポテトチップス",
  "スナック菓子": "ポテトチップス",
  "製菓用ミックス粉": "ホットケーキミックス",

  // 調味料・つゆ・だし
  "しょうゆ加工品": "めんつゆ",
  "つゆ類": "めんつゆ",
  "つゆ（希釈用）": "めんつゆ",
  "風味調味料": "だし",
  "風味がんも": "だし",
  "和風だし": "だし",

  // ドレッシング・マヨネーズ
  "乳化液状ドレッシング": "ドレッシング",
  "分離液状ドレッシング": "ドレッシング",
  "半固体状ドレッシング": "マヨネーズ",

  // 水産・肉加工品・惣菜の素
  "魚肉すり身加工品": "かまぼこ・ちくわ",
  "魚肉練り製品": "かまぼこ・ちくわ",
  "食肉製品": "ウインナー・ハム",
  "そうざいの素": "中華の素",
  "料理の素": "中華の素",
};

/**
 * 原材料表示の「名称」欄から法律上の堅い分類名を一般的な商品カテゴリー名へ変換する共通処理
 * @param rawCategory 読み取った「名称」文字列
 * @returns 変換後の一般カテゴリー名（辞書にない場合は元の文字列をクリーンにしてそのまま返却）
 */
export function mapCategoryToCommonName(rawCategory?: string): string {
  if (!rawCategory || rawCategory === "不明" || rawCategory.includes("不明") || rawCategory.includes("読み取れ")) {
    return "不明";
  }

  // 余分なプレフィックスや飾りの除去
  let cleaned = rawCategory
    .replace(/^CATEGORY:\s*/i, "")
    .replace(/無添加/g, "")
    .replace(/有機/g, "")
    .replace(/特選/g, "")
    .replace(/無塩/g, "")
    .trim();

  // 1. 辞書オブジェクトとの完全一致チェック
  if (CATEGORY_DICTIONARY[cleaned]) {
    return CATEGORY_DICTIONARY[cleaned];
  }

  // 2. 辞書オブジェクトのキーが含まれているか部分一致チェック
  for (const key of Object.keys(CATEGORY_DICTIONARY)) {
    if (cleaned.includes(key)) {
      return CATEGORY_DICTIONARY[key];
    }
  }

  // 3. 辞書に含まれない名称のフォールバック（文字列調整）
  if (cleaned.includes("加工肉") || cleaned.includes("ソーセージ") || cleaned.includes("ハム") || cleaned.includes("ベーコン")) {
    return "ウインナー・ハム";
  }
  if (cleaned.includes("醤油") || cleaned.includes("しょうゆ")) {
    return "醤油";
  }
  if (cleaned.includes("ぽん酢") || cleaned.includes("ポン酢")) {
    return "ポン酢";
  }
  if (cleaned.includes("みそ") || cleaned.includes("味噌")) {
    return "味噌";
  }

  return cleaned || "食品";
}
