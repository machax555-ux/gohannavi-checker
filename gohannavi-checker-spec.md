# ごはんなび添加物チェッカー
## アプリ仕様書 & Antigravity 2.0 開発プロンプト集

---

## 📋 アプリ概要

| 項目 | 内容 |
|------|------|
| アプリ名 | ごはんなび添加物チェッカー |
| 対象ユーザー | 食品添加物が気になる方・無添加食品に興味がある方 |
| 利用環境 | スマホブラウザ（PWA対応） |
| 認証 | なし（LocalStorageで利用回数管理） |
| 収益モデル | Google AdSense広告 ＋ Amazonアフィリエイト ＋ ごはんなびブログ誘導 |
| AIエンジン | Gemini 2.5 Flash（Google AI Studio API） |

---

## 🗂️ 画面構成（全5画面）

```
[1] ホーム画面
    └─ [2] 撮影・入力画面
              └─ [3] 判定結果画面
                        ├─ [4] 代替商品提案画面
                        └─ [5] ごはんなびブログ誘導画面
```

---

## 🔧 機能仕様

### 機能1：原材料名の読み取り（OCR）
- スマホカメラで原材料名を撮影 **または** テキスト手入力
- Gemini 2.5 Flash APIに画像を送信しOCR＋添加物判定をワンストップ処理
- 対応フォーマット：JPEG / PNG / WebP

### 機能2：添加物判定
判定カテゴリは以下の3段階：

| 判定 | 表示色 | 意味 |
|------|--------|------|
| ✅ 無添加 | 緑 | 避けるべき添加物なし |
| ⚠️ 要注意 | 黄 | 気になる添加物が少量含まれる |
| ❌ 添加物あり | 赤 | 避けるべき添加物が含まれる |

判定対象の添加物カテゴリ（Geminiプロンプトで指定）：
- 人工甘味料（アスパルテーム、スクラロース、アセスルファムK等）
- 人工着色料（赤色〇号、青色〇号等）
- 保存料（ソルビン酸K、安息香酸Na等）
- 化学調味料（グルタミン酸Na等）
- 亜硝酸塩（亜硝酸Na等）
- 漂白剤（亜硫酸塩等）
- 増粘剤・乳化剤（カラギナン等）※要注意扱い

### 機能3：1日10回制限
- LocalStorageに判定日付と回数を保存
- 10回到達時：「本日の無料判定は終了しました。明日またご利用ください。」と表示
- 日付が変わると自動リセット

### 機能4：代替商品の提案（ハイブリッド）
添加物ありと判定された場合に表示：

**① Amazonアフィリエイトリンク**
- 判定した商品カテゴリに応じた無添加代替商品を3件表示
- リンクにAmazonアソシエイトID（`gohannavi-22`を想定）を付与
- 商品画像・商品名・価格帯を表示

**② ごはんなびブログ誘導バナー**
- 「この商品の詳しい解説はごはんなびで」
- gohannavi.comの関連記事URLへのリンク
- ブログ記事URLはGeminiが商品カテゴリから推定して動的生成

### 機能5：広告表示
- 判定結果画面の下部に1箇所のみ
- Google AdSenseのバナー広告（実装時にAdSenseコードを挿入）
- 判定の邪魔にならない位置に配置

---

## 🎨 デザイン仕様

### カラーパレット
| 役割 | カラー | HEX |
|------|--------|-----|
| メインカラー | 深緑（ごはんなびブランド色） | `#2D6A4F` |
| サブカラー | ライトグリーン | `#95D5B2` |
| 無添加判定色 | グリーン | `#52B788` |
| 要注意判定色 | アンバー | `#F4A261` |
| 添加物あり判定色 | レッド | `#E63946` |
| 背景色 | オフホワイト | `#F8F9FA` |
| テキスト | ダークグレー | `#212529` |

### フォント
- 見出し：Noto Sans JP Bold
- 本文：Noto Sans JP Regular
- 判定結果テキスト：大きめ（24px以上）で視認性重視

### UI方針
- スマホファースト（max-width: 430px想定）
- タップしやすいボタンサイズ（最小44px）
- 判定結果はカードUIで直感的に理解できる表示
- ローディング中はアニメーションスピナー表示

---

## 🛠️ 技術スタック

| レイヤー | 技術 |
|----------|------|
| フロントエンド | Next.js 14（App Router）+ Tailwind CSS |
| AIエンジン | Google Gemini 2.5 Flash API |
| 状態管理 | LocalStorage（判定回数管理） |
| ホスティング | Vercel（無料枠） |
| 収益化 | Google AdSense + Amazonアソシエイト + 楽天アフィリエイト |

---

## 📁 ファイル構成

```
gohannavi-checker/
├── app/
│   ├── page.tsx              # ホーム画面
│   ├── scan/
│   │   └── page.tsx          # 撮影・入力画面
│   ├── result/
│   │   └── page.tsx          # 判定結果画面
│   └── api/
│       └── check/
│           └── route.ts      # Gemini API呼び出し（サーバーサイド）
├── components/
│   ├── CameraCapture.tsx     # カメラ撮影コンポーネント
│   ├── ResultCard.tsx        # 判定結果カード
│   ├── AlternativeProducts.tsx # 代替商品提案
│   ├── AdBanner.tsx          # 広告バナー
│   └── UsageLimit.tsx        # 利用回数管理
├── lib/
│   ├── gemini.ts             # Gemini API設定
│   ├── storage.ts            # LocalStorage管理
│   └── affiliateLinks.ts     # アフィリエイトリンク生成
├── public/
│   └── manifest.json         # PWA設定
└── .env.local                # APIキー（Gemini）
```

---

## 🤖 Antigravity 2.0 開発プロンプト集

以下を**フェーズ順に**Antigravityに貼り付けて実行してください。

---

### ▼ フェーズ1：プロジェクト初期化

```
以下の仕様でNext.jsプロジェクトを新規作成してください。

【プロジェクト名】gohannavi-checker
【技術スタック】
- Next.js 14（App Router）
- TypeScript
- Tailwind CSS
- PWA対応（next-pwa）

【初期設定】
1. `npx create-next-app@latest gohannavi-checker --typescript --tailwind --app` を実行
2. next-pwaをインストール
3. public/manifest.jsonを作成（アプリ名：ごはんなび添加物チェッカー、テーマカラー：#2D6A4F）
4. .env.localを作成し、GEMINI_API_KEYのプレースホルダーを追加
5. Tailwindのカラー設定にブランドカラーを追加：
   - primary: #2D6A4F
   - secondary: #95D5B2
   - safe: #52B788
   - caution: #F4A261
   - danger: #E63946

完了したらファイル構成を確認して報告してください。
```

---

### ▼ フェーズ2：Gemini API連携（心臓部）

```
以下の仕様でGemini 2.5 Flash APIとの連携モジュールを作成してください。

【ファイル】app/api/check/route.ts

【処理フロー】
1. フロントエンドから「画像データ（Base64）またはテキスト」を受け取る
2. Gemini 2.5 Flash APIに以下のシステムプロンプトと共に送信する
3. レスポンスをJSONで返す

【Geminiへのシステムプロンプト（このまま使用）】
---
あなたは日本の食品添加物の専門家です。
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
- danger：人工甘味料・人工着色料・保存料・化学調味料・亜硝酸塩・漂白剤が含まれる
---

【エラーハンドリング】
- APIキーなし：適切なエラーメッセージ
- 原材料名が読み取れない場合：{ "error": "原材料名を読み取れませんでした" }
- レート制限：{ "error": "しばらく時間をおいて再度お試しください" }
```

---

### ▼ フェーズ3：LocalStorage利用回数管理

```
以下の仕様でLocalStorageを使った利用回数管理モジュールを作成してください。

【ファイル】lib/storage.ts

【仕様】
- キー名：gohannavi_usage
- 保存データ：{ date: "YYYY-MM-DD", count: number }
- 1日の上限：10回
- 日付が変わったら自動的にcountを0にリセット

【エクスポートする関数】
1. getUsageCount(): number — 今日の残り回数を返す（0〜10）
2. incrementUsage(): boolean — 使用回数を+1する。上限超えの場合はfalseを返す
3. canUseToday(): boolean — 今日まだ使えるかどうか

【ファイル】components/UsageLimit.tsx
- 残り回数を「本日あと○回使えます」と表示
- 0回の場合は「本日の無料判定は終了しました。明日またご利用ください。」と表示
- デザイン：メインカラー(#2D6A4F)のバッジ形式
```

---

### ▼ フェーズ4：カメラ撮影・入力画面

```
以下の仕様でカメラ撮影＆テキスト入力コンポーネントを作成してください。

【ファイル】components/CameraCapture.tsx

【機能】
1. カメラ撮影ボタン
   - スマホのカメラを起動（input type="file" accept="image/*" capture="environment"）
   - 撮影した画像をプレビュー表示
   - 「この画像で判定する」ボタンで送信

2. テキスト入力エリア
   - プレースホルダー：「原材料名をここに貼り付けてください」
   - 最大2000文字
   - 「判定する」ボタンで送信

【ファイル】app/scan/page.tsx
- CameraCaptureコンポーネントを配置
- 利用回数チェック（UsageLimitコンポーネント）を上部に表示
- 残り0回の場合は判定ボタンをdisabled
- 送信後：ローディングスピナー表示 → /result画面に遷移
- ローディングメッセージ：「原材料を分析中...少々お待ちください」

【デザイン】
- カメラボタン：大きめ（縦120px以上）、深緑(#2D6A4F)背景、カメラアイコン
- テキストエリア：角丸、ボーダー色は#95D5B2
- スマホで片手操作しやすいレイアウト
```

---

### ▼ フェーズ5：判定結果画面

```
以下の仕様で判定結果画面を作成してください。

【ファイル】components/ResultCard.tsx

【表示内容】
1. 判定バナー（画面上部、大きく表示）
   - safe：緑背景「✅ 無添加です！」
   - caution：黄背景「⚠️ 要注意の添加物が含まれます」
   - danger：赤背景「❌ 避けたい添加物が含まれています」

2. 検出された添加物リスト（dangerまたはcautionの場合）
   - 添加物名・カテゴリ・理由をカード形式で表示

3. 安全な原材料リスト
   - コンパクトにタグ形式で表示

4. 判定サマリー文（summary）

【ファイル】components/AlternativeProducts.tsx
danger判定の場合のみ表示：

① Amazonアフィリエイトセクション
   - 見出し：「🛒 無添加の代替商品はこちら」
   - Amazonの検索URLを動的生成：
     `https://www.amazon.co.jp/s?k={blog_keyword}+無添加&tag=gohannavi-22`
   - ボタン：「Amazonで無添加商品を探す →」（オレンジ色）

② ごはんなびブログ誘導バナー
   - 見出し：「📖 ごはんなびで詳しく解説中！」
   - URLを動的生成：
     `https://gohannavi.com/?s={blog_keyword}`
   - ボタン：「ごはんなびで記事を読む →」（深緑色）

【ファイル】components/AdBanner.tsx
- 結果カードの下部に配置
- Google AdSenseのコードを挿入するプレースホルダー
- コメントで「// ここにAdSenseコードを挿入」と明記

【ファイル】app/result/page.tsx
- ResultCardを表示
- dangerの場合：AlternativeProductsを表示
- AdBannerを表示
- 「もう一度判定する」ボタン → /scan画面に戻る
```

---

### ▼ フェーズ6：ホーム画面

```
以下の仕様でホーム画面を作成してください。

【ファイル】app/page.tsx

【表示内容】
1. ヘッダー
   - ロゴ：「🍚 ごはんなび添加物チェッカー」
   - サブタイトル：「原材料を撮るだけで添加物を瞬時に判定」

2. メインビジュアル
   - 大きな「判定スタート」ボタン（/scanへ遷移）
   - 本日の残り回数表示（UsageLimitコンポーネント）

3. 使い方説明（3ステップ）
   - Step1：商品の原材料名を撮影
   - Step2：AIが添加物を自動判定
   - Step3：無添加の代替商品を提案

4. ごはんなびへのリンク
   - 「無添加食品をもっと知りたい方はごはんなびへ」
   - gohannavi.comへのリンク

【デザイン方針】
- ファーストビューで「判定スタート」ボタンが目立つこと
- 深緑(#2D6A4F)をメインに、清潔感のある食品系デザイン
- フォント：Noto Sans JP（Googleフォントから読み込み）
```

---

### ▼ フェーズ7：PWA設定・最終調整

```
以下の仕様でPWA対応と最終調整を行ってください。

【PWA設定】
1. public/manifest.jsonを確認・更新：
{
  "name": "ごはんなび添加物チェッカー",
  "short_name": "添加物チェッカー",
  "description": "原材料を撮るだけで添加物を瞬時に判定",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F8F9FA",
  "theme_color": "#2D6A4F",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}

2. メタタグをapp/layout.tsxに追加：
   - OGP設定（SNSシェア用）
   - viewport設定（スマホ最適化）
   - apple-mobile-web-app-capable

【SEO・OGP設定】
- タイトル：「ごはんなび添加物チェッカー｜原材料を撮るだけで無添加判定」
- description：「食品の原材料名を撮影するだけで、AIが添加物を瞬時に判定。無添加の代替商品も提案します。」
- OGP画像：public/og-image.png（1200×630px）のプレースホルダー

【最終確認チェックリスト】
以下をすべて確認して報告してください：
- [ ] スマホブラウザで正常に動作するか
- [ ] カメラ起動が正常に動作するか
- [ ] Gemini APIへのリクエスト・レスポンスが正常か
- [ ] LocalStorageの利用回数制限が正常に動作するか
- [ ] 判定結果画面が3パターン（safe/caution/danger）すべて表示されるか
- [ ] Amazonアフィリエイトリンクが正しく生成されるか
- [ ] ごはんなびブログへの誘導リンクが正しいか
- [ ] Vercelへのデプロイが成功するか
```

---

### ▼ Vercelデプロイ用プロンプト

```
アプリをVercelにデプロイしてください。

【手順】
1. GitHubリポジトリを作成（リポジトリ名：gohannavi-checker）
2. コードをpush
3. Vercel（vercel.com）でGitHubリポジトリを連携
4. 環境変数を設定：
   - GEMINI_API_KEY：（Maさんが入力）
5. デプロイ実行

【確認事項】
- デプロイ後のURLを確認
- スマホから実際にアクセスして動作確認
- ホーム画面に追加（PWA）できるか確認
```

---

## ⚠️ 注意事項・今後のTODO

### Maさんが別途用意するもの
- [ ] Google AI Studio APIキー（Gemini）→ [aistudio.google.com](https://aistudio.google.com)
- [ ] Amazonアソシエイト登録 → アソシエイトIDを`gohannavi-22`から実際のIDに変更
- [ ] Google AdSense申請 → 審査通過後にAdBanner.tsxにコード挿入
- [ ] OGP画像（og-image.png）の作成
- [ ] アプリアイコン（icon-192.png、icon-512.png）の作成

### フェーズ4以降でやること
- 楽天アフィリエイトリンクの追加
- ごはんなびブログの特定記事URLをマッピング（商品カテゴリ→記事URL）
- Google Analytics 4の導入
- ユーザーフィードバック機能（「この判定は正しいですか？」）

---

*作成日：2026年7月*
*対象ツール：Google Antigravity 2.0*
