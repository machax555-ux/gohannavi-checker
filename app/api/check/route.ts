import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel, AdditiveCheckResult } from "@/lib/gemini";

const SYSTEM_PROMPT = `あなたは日本の食品添加物の専門家です。
ユーザーが提示する食品の原材料名を分析し、以下のJSON形式のみで回答してください。
マークダウンや説明文は一切不要です。JSONのみを返してください。

{
  "judgment": "safe" | "caution" | "danger",
  "detected_additives": [
    {
      "name": "添加物名",
      "category": "カテゴリ名",
      "reason": "避けるべき理由（50文字以内）"
    }
  ],
  "safe_ingredients": ["安全な原材料のリスト"],
  "product_category": "商品カテゴリ（例：醤油、スナック菓子、飲料など）",
  "summary": "全体の判定サマリー（100文字以内）",
  "blog_keyword": "ごはんなびブログで検索すべきキーワード（例：無添加醤油）"
}

判定基準：
- safe：避けるべき添加物が含まれていない
- caution：増粘剤・乳化剤・香料など要注意添加物が少量含まれる  
- danger：人工甘味料・人工着色料・保存料・化学調味料・亜硝酸塩・漂白剤が含まれる`;

export async function POST(req: NextRequest) {
  // 1. Check GEMINI_API_KEY
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEYが設定されていません" },
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

    if (error.message === "GEMINI_API_KEY_MISSING") {
      return NextResponse.json(
        { error: "GEMINI_API_KEYが設定されていません" },
        { status: 500 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "原材料名を読み取れませんでした" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "しばらく時間をおいて再度お試しください" },
      { status: 500 }
    );
  }
}
