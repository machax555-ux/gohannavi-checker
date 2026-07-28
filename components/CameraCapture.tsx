"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Image as ImageIcon, RefreshCw, Sparkles, FileText } from "lucide-react";
import { incrementUsage } from "@/lib/storage";

interface CameraCaptureProps {
  onStartLoading?: () => void;
  onEndLoading?: () => void;
  onError?: (msg: string) => void;
  disabled?: boolean;
}

const MAX_TEXT_LENGTH = 2000;

/**
 * スマホ写真（大容量画像）をCanvasで長辺1024px・JPEG品質0.85へ自動リサイズ＆圧縮する関数
 */
const compressImage = (file: File, maxWidth = 1024, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);
        }
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export default function CameraCapture({
  onStartLoading,
  onEndLoading,
  onError,
  disabled = false,
}: CameraCaptureProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"camera" | "text">("camera");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onError) onError("");

    try {
      setIsCompressing(true);
      const compressedBase64 = await compressImage(file, 1024, 0.85);
      setPreviewImage(compressedBase64);
    } catch (err) {
      console.error("Failed to compress image:", err);
      if (onError) onError("画像の読み込みに失敗しました。別の画像でお試しください。");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleResetImage = () => {
    setPreviewImage(null);
    if (onError) onError("");
  };

  const handleSubmit = async () => {
    if (disabled || isCompressing) return;

    if (activeTab === "camera" && !previewImage) {
      if (onError) onError("画像を撮影または選択してください。");
      return;
    }

    if (activeTab === "text" && !textInput.trim()) {
      if (onError) onError("原材料テキストを入力してください。");
      return;
    }

    if (onStartLoading) onStartLoading();
    if (onError) onError("");

    try {
      const payload = activeTab === "camera"
        ? { type: "image", imageData: previewImage, mimeType: "image/jpeg" }
        : { type: "text", text: textInput.trim() };

      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "判定処理に失敗しました");
      }

      incrementUsage();
      sessionStorage.setItem("gohannavi_result", JSON.stringify(data));
      router.push("/result");
    } catch (err: any) {
      console.error(err);
      if (onError) {
        const msg = err?.message;
        if (!msg || /[a-zA-Z]{5,}/.test(msg) || msg.includes("Failed to fetch") || msg.includes("Error")) {
          onError("アクセス集中につき、時間おいて再度お試しください。");
        } else {
          onError(msg);
        }
      }
      if (onEndLoading) onEndLoading();
    }
  };

  return (
    <div className="w-full flex flex-col justify-between gap-4">
      {/* Mode Switch Tabs */}
      <div className="grid grid-cols-2 bg-[#121212] p-1 swiss-border">
        <button
          type="button"
          onClick={() => {
            setActiveTab("camera");
            if (onError) onError("");
          }}
          className={`py-3 text-xs font-black font-display tracking-wider transition-colors flex items-center justify-center gap-2 ${
            activeTab === "camera"
              ? "bg-[#F5CE42] text-[#111111]"
              : "bg-transparent text-white hover:text-[#F5CE42]"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>01. CAMERA</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("text");
            if (onError) onError("");
          }}
          className={`py-3 text-xs font-black font-display tracking-wider transition-colors flex items-center justify-center gap-2 ${
            activeTab === "text"
              ? "bg-[#F5CE42] text-[#111111]"
              : "bg-transparent text-white hover:text-[#F5CE42]"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>02. TEXT INPUT</span>
        </button>
      </div>

      {/* Camera Mode Area */}
      {activeTab === "camera" && (
        <div className="flex flex-col gap-4">
          {!previewImage ? (
            <div className="flex flex-col gap-3">
              {/* Main Camera Dropzone */}
              <label className="w-full">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  disabled={disabled || isCompressing}
                  className="hidden"
                />
                <div
                  className={`w-full min-h-[160px] swiss-card-white flex flex-col items-center justify-center gap-3 p-6 text-center transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                    disabled || isCompressing ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#FAF9F5]"
                  }`}
                >
                  <div className="w-14 h-14 bg-[#121212] text-[#F5CE42] flex items-center justify-center swiss-border">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="font-extrabold text-lg text-[#111111] block">
                      {isCompressing ? "📷 画像を最適化中..." : "📷 パッケージを撮影する"}
                    </span>
                    <span className="text-xs text-[#555555] font-medium block mt-0.5">
                      {isCompressing ? "少々お待ちください" : "スマホのカメラで原材料表示を撮影"}
                    </span>
                  </div>
                </div>
              </label>

              {/* Library File Selector */}
              <label className="w-full">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  disabled={disabled || isCompressing}
                  className="hidden"
                />
                <div
                  className={`w-full py-4 px-4 bg-[#121212] text-white swiss-border text-center font-extrabold text-xs flex items-center justify-center gap-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                    disabled || isCompressing ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#222222]"
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-[#F5CE42]" />
                  <span>ライブラリから画像を選択する</span>
                </div>
              </label>
            </div>
          ) : (
            /* Image Preview Area */
            <div className="swiss-card-white p-4 flex flex-col items-center gap-3">
              <div className="w-full flex justify-between items-center border-b-2 border-black pb-2">
                <span className="font-display font-black text-xs text-[#111111] tracking-widest">
                  SELECTED IMAGE
                </span>
                <button
                  type="button"
                  onClick={handleResetImage}
                  className="flex items-center gap-1 text-xs text-[#EF4444] font-black hover:underline"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>撮り直す</span>
                </button>
              </div>
              <div className="w-full max-h-[220px] bg-[#121212] p-2 flex items-center justify-center swiss-border">
                <img
                  src={previewImage}
                  alt="撮影した原材料名"
                  className="max-h-[200px] w-auto object-contain"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Text Mode Area */}
      {activeTab === "text" && (
        <div className="swiss-card-dark p-4 flex flex-col gap-2">
          <span className="font-display font-black text-xs text-[#F5CE42] tracking-widest border-b border-white/20 pb-1">
            INPUT INGREDIENT TEXT
          </span>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value.slice(0, MAX_TEXT_LENGTH))}
            maxLength={MAX_TEXT_LENGTH}
            placeholder={`原材料名をここに貼り付けてください\n例）小麦粉、砂糖、食塩、醤油、ソルビン酸K、着色料（赤102）`}
            rows={6}
            disabled={disabled}
            className="w-full p-3 bg-white text-[#111111] swiss-border-sm focus:outline-none text-xs font-bold leading-relaxed resize-none mt-1"
          />
          <div className="text-right text-[10px] text-white/60 font-mono">
            {MAX_TEXT_LENGTH - textInput.length} / {MAX_TEXT_LENGTH} CHARS LEFT
          </div>
        </div>
      )}

      {/* Main Submit Button & Privacy Note */}
      <div className="flex flex-col gap-2.5 sm:gap-3 w-full mt-1">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            disabled ||
            isCompressing ||
            (activeTab === "camera" && !previewImage) ||
            (activeTab === "text" && !textInput.trim())
          }
          className="w-full py-3.5 sm:py-4 bg-[#10B981] hover:bg-[#059669] text-white swiss-border swiss-shadow font-black text-base sm:text-lg flex items-center justify-center gap-3 transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>判定を実行する</span>
        </button>

        <p className="text-[9.5px] sm:text-[11px] font-bold text-[#111111]/85 text-center leading-none whitespace-nowrap tracking-tighter pt-0.5">
          ※撮影された画像や解析データはサーバーに保存・収集されることはありません
        </p>
      </div>
    </div>
  );
}
