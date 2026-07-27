import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel, AdditiveCheckResult } from "@/lib/gemini";

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
  "product_category": "商品カテゴリ（例：醤油、スナック菓子、飲料など。画像から原材料名が判別できない場合は 不明）",
  "summary": "全体の判定サマリー（100文字以内）",
  "blog_keyword": "ごはんなびブログで検索すべきキーワード（例：無添加醤油）"
}

判定基準：
- safe：食品添加物が含まれていない、または完全無添加
- danger：食品添加物が1つ以上含まれている
※画像から原材料名が読み取れない・食品パッケージでない場合は、product_categoryを "不明" とし、summaryを "画像の原材料名を読み取れませんでした。明るくブレのない画像でもう一度お試しください。" としてください。`;

export async function POST(req: NextRequest) {
  // 1. Check GEMINI_API_KEY
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "ただいまAIが混み合っています。しばらく時間をおいて再度お試しください。" },
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

    if (!parsed.judgment || !parsed.summary) {
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
        { error: "ただいまAIが混み合っています。しばらく時間をおいて再度お試しください。" },
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
      { error: "ただいまAIが混み合っています。しばらく時間をおいて再度お試しください。" },
      { status: 500 }
    );
  }
}
