/**
 * 食品表示の「名称」欄（法律上の分類名）から「一般的な検索カテゴリー名」への自動変換マッピング辞書
 * 
 * 今後新しい変換ペアを追加・編集する際は、以下の dictionary オブジェクトに
 * "法律上の名称": "検索用カテゴリー名" の形式で追記してください。
 */
export const CATEGORY_DICTIONARY: Record<string, string> = {
  // 菓子類・和洋菓子
  "米菓": "せんべい",
  "ごま菓子": "せんべい",
  "落花生菓子": "せんべい",
  "豆菓子": "せんべい",
  "穀物加工品": "せんべい",
  "油菓子": "ポテトチップス",
  "スナック菓子": "ポテトチップス",
  "製菓用ミックス粉": "ホットケーキミックス",
  "菓子": "お菓子",

  // 調味料・つゆ・だし
  "しょうゆ加工品": "しょうゆ",
  "醤油加工品": "しょうゆ",
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
  "魚肉すり身加工品": "かまぼこ",
  "魚肉練り製品": "かまぼこ",
  "食肉製品": "ウインナー",
  "そうざいの素": "中華の素",
  "料理の素": "中華の素",
};

/**
 * 原材料表示の「名称」欄から法律上の堅い分類名や複合語を、単一の基本大分類カテゴリー名へ完全正規化する共通処理
 * @param rawCategory 読み取った「名称」文字列
 * @returns 変換・削ぎ落とし後の単一基本カテゴリー名
 */
export function mapCategoryToCommonName(rawCategory?: string): string {
  if (!rawCategory || rawCategory === "不明" || rawCategory.includes("不明") || rawCategory.includes("読み取れ")) {
    return "不明";
  }

  // Unicode正規化 (NFKC) により全角数字・英数・記号を半角標準化し、余分な修飾語を除去
  let cleaned = rawCategory
    .normalize("NFKC")
    .replace(/^CATEGORY:\s*/i, "")
    .replace(/無添加/g, "")
    .replace(/有機/g, "")
    .replace(/特選/g, "")
    .replace(/無塩/g, "")
    .replace(/淡口/g, "")
    .replace(/濃口/g, "")
    .trim();

  // 1. 強力な基本大分類への一律削ぎ落とし（修飾語を除去して単一の基本単語へ丸める）
  if (
    cleaned.includes("せんべい") ||
    cleaned.includes("煎餅") ||
    cleaned.includes("あられ") ||
    cleaned.includes("おかき")
  ) {
    return "せんべい";
  }
  if (
    cleaned.includes("ポテト") ||
    cleaned.includes("ポテトチップス") ||
    cleaned.includes("油菓子") ||
    cleaned.includes("スナック")
  ) {
    return "ポテトチップス";
  }
  if (cleaned.includes("クッキー") || cleaned.includes("ビスケット") || cleaned.includes("サブレ")) {
    return "クッキー";
  }
  if (cleaned.includes("チョコレート") || cleaned.includes("チョコ")) {
    return "チョコレート";
  }
  if (cleaned.includes("しょうゆ") || cleaned.includes("醤油")) {
    return "しょうゆ";
  }
  if (cleaned.includes("めんつゆ") || cleaned.includes("つゆ")) {
    return "めんつゆ";
  }
  if (cleaned.includes("ぽん酢") || cleaned.includes("ポン酢")) {
    return "ポン酢";
  }
  if (cleaned.includes("ドレッシング")) {
    return "ドレッシング";
  }
  if (cleaned.includes("マヨネーズ")) {
    return "マヨネーズ";
  }
  if (
    cleaned.includes("ウインナー") ||
    cleaned.includes("ソーセージ") ||
    cleaned.includes("ハム") ||
    cleaned.includes("ベーコン") ||
    cleaned.includes("加工肉")
  ) {
    return "ウインナー";
  }
  if (cleaned.includes("かまぼこ") || cleaned.includes("ちくわ") || cleaned.includes("練り物")) {
    return "かまぼこ";
  }
  if (cleaned.includes("だし") || cleaned.includes("出汁")) {
    return "だし";
  }
  if (cleaned.includes("みそ") || cleaned.includes("味噌")) {
    return "味噌";
  }

  // 2. 辞書オブジェクトとの完全一致チェック
  if (CATEGORY_DICTIONARY[cleaned]) {
    return CATEGORY_DICTIONARY[cleaned];
  }

  // 3. 辞書オブジェクトのキーが含まれているか部分一致チェック
  for (const key of Object.keys(CATEGORY_DICTIONARY)) {
    if (cleaned.includes(key)) {
      return CATEGORY_DICTIONARY[key];
    }
  }

  // 4. 末尾に「菓子」が付く複合語に対するパターンマッチング
  if (/菓子$/.test(cleaned) || cleaned.includes("菓子")) {
    if (
      cleaned.includes("ごま") ||
      cleaned.includes("米") ||
      cleaned.includes("豆") ||
      cleaned.includes("あられ") ||
      cleaned.includes("落花生") ||
      cleaned.includes("ピーナッツ")
    ) {
      return "せんべい";
    }
    return "お菓子";
  }

  return cleaned || "お菓子";
}
