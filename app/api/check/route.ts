import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel, AdditiveCheckResult } from "@/lib/gemini";

export const maxDuration = 15;
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `あなたは日本の食品添加物の専門家です。
ユーザーが提示する食品の原材料名を分析し、以下のJSON形式のみで回答してください。
マークダウンや説明文は一切不要です。JSONのみを返してください。

{
  "judgment": "safe" | "danger",
  "detected_additives": [
    {
      "name": "添加物名",
      "category": "カテゴリ名",
      "reason": "避けるべき理由（50文字以内）"
    }
  ],
  "safe_ingredients": ["安全な原材料のリスト"],
  "product_category": "代表的で一般的な商品カテゴリ（重要ルール参照）",
  "summary": "全体の判定サマリー（100文字以内）",
  "blog_keyword": "ブログ・EC検索用一般キーワード（例：無添加せんべい）"
}

【product_categoryおよびblog_keywordの重要ルール】
・「ごま菓子」「落花生菓子」「油菓子」「米菓」「穀物加工品」などの法律上の堅い分類名やニッチ・マイナーな名称は絶対に使用しないでください。
・Amazon等のECサイトで最も一般的に検索されヒット数が多くなる代表的ジャンル名（例：せんべい、ポテトチップス、ビスケット、チョコレート、クッキー、醤油、めんつゆ、ドレッシング、ウインナー・ハム、かまぼこ・ちくわ、だし 等）に必ず丸めて分類してください。
・パッケージの名称が単に「菓子」や抽象的な場合でも、原材料（ごま・米 ➔ せんべい / 馬鈴薯 ➔ ポテトチップス / 小麦粉・砂糖 ➔ クッキー など）から代表的な一般食品カテゴリを推測して割り当ててください。

判定基準：
- safe：食品添加物が含まれていない、または完全無添加
- danger：食品添加物が1つ以上含まれている
※画像から原材料名が読み取れない・食品パッケージでない場合は、product_categoryを "不明" とし、summaryを "画像の原材料名を読み取れませんでした。明るくブレのない画像でもう一度お試しください。" としてください。`;

export async function POST(req: NextRequest) {
  // 1. Check GEMINI_API_KEY
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "アクセス集中につき、時間おいて再度お試しください。" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { type, imageData, mimeType, text } = body;

    if (!type || (type === "image" && !imageData) || (type === "text" && !text)) {
      return NextResponse.json(
        { error: "原材料名を読み取れませんでした" },
        { status: 400 }
      );
    }

    const model = getGeminiModel();
    let promptParts: any[] = [SYSTEM_PROMPT];

    if (type === "image" && imageData) {
      // Remove Base64 prefix if passed full data URL
      const cleanBase64 = imageData.replace(/^data:(image\/\w+);base64,/, "");
      const finalMimeType = mimeType || "image/jpeg";

      promptParts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: finalMimeType,
        },
      });
      promptParts.push("画像の食品原材料名を読み取って分析してください。");
    } else if (type === "text" && text) {
      promptParts.push(`原材料名:\n${text}`);
    }

    const result = await model.generateContent(promptParts);
    const responseText = result.response.text();

    // Clean potential markdown wrap ```json ... ```
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    // Extract JSON object
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "原材料名を読み取れませんでした" },
        { status: 400 }
      );
    }

    const parsed: AdditiveCheckResult = JSON.parse(jsonMatch[0]);

    // サニタイズ（配列・初期値の安全保証）処理
    parsed.detected_additives = Array.isArray(parsed.detected_additives) ? parsed.detected_additives : [];
    parsed.safe_ingredients = Array.isArray(parsed.safe_ingredients) ? parsed.safe_ingredients : [];
    parsed.judgment = parsed.judgment || "safe";
    parsed.product_category = parsed.product_category || "不明";
    parsed.summary = parsed.summary || "判定を完了しました。";
    parsed.blog_keyword = parsed.blog_keyword || "";

    if (!parsed.summary) {
      return NextResponse.json(
        { error: "原材料名を読み取れませんでした" },
        { status: 400 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Gemini API Check Error:", error);

    // 503 (Service Unavailable) or 429 (Rate Limit) / Busy / Overloaded Errors
    const isBusyOrUnavailable =
      error?.status === 503 ||
      error?.statusCode === 503 ||
      error?.status === 429 ||
      error?.statusCode === 429 ||
      (typeof error?.message === "string" &&
        (error.message.includes("503") ||
         error.message.includes("429") ||
         error.message.includes("Service Unavailable") ||
         error.message.includes("Too Many Requests") ||
         error.message.includes("RESOURCE_EXHAUSTED") ||
         error.message.includes("overloaded") ||
         error.message.includes("quota")));

    if (isBusyOrUnavailable) {
      return NextResponse.json(
        { error: "アクセス集中につき、時間おいて再度お試しください。" },
        { status: 503 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "原材料名を読み取れませんでした" },
        { status: 400 }
      );
    }

    // Default Fallback Error Message (No raw English/stack traces exposed to user)
    return NextResponse.json(
      { error: "アクセス集中につき、時間おいて再度お試しください。" },
      { status: 500 }
    );
  }
}
