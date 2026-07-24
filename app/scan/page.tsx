"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import CameraCapture from "@/components/CameraCapture";
import UsageLimit from "@/components/UsageLimit";

export default function ScanPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [canUse, setCanUse] = useState(true);

  return (
    <main className="flex-1 flex flex-col p-5">
      {/* Header Bar */}
      <div className="flex items-center gap-3 mb-2">
        <Link href="/" className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">原材料名の読み取り・入力</h1>
      </div>

      {/* Usage Limit Badge/Alert at top */}
      <UsageLimit onLimitCheck={(valid) => setCanUse(valid)} />

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-[#E63946] my-2 font-medium leading-relaxed">
          {errorMsg}
        </div>
      )}

      {/* Loading State UI */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16 text-center">
          <Loader2 className="w-12 h-12 text-[#2D6A4F] animate-spin" />
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold text-[#2D6A4F]">原材料を分析中...少々お待ちください</p>
            <p className="text-xs text-gray-500">AIが添加物の抽出と安全性を判定しています</p>
          </div>
        </div>
      ) : canUse ? (
        /* Camera / Text Capture Area when allowed */
        <div className="mt-2 flex-1">
          <CameraCapture
            disabled={!canUse}
            onStartLoading={() => setLoading(true)}
            onEndLoading={() => setLoading(false)}
            onError={(msg) => setErrorMsg(msg)}
          />
        </div>
      ) : (
        /* Disabled Message when limit reached */
        <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-2xl text-center flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600">
            本日の無料判定回数（3回）の上限に達しているため、新規撮影・判定はできません。
          </p>
          <Link
            href="/"
            className="mt-2 text-xs font-bold text-[#2D6A4F] underline"
          >
            ホーム画面に戻る
          </Link>
        </div>
      )}
    </main>
  );
}
