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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onError) onError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPreviewImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetImage = () => {
    setPreviewImage(null);
    if (onError) onError("");
  };

  const handleSubmit = async () => {
    if (disabled) return;

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
        onError(err.message || "エラーが発生しました。しばらく時間をおいて再度お試しください。");
      }
    } finally {
      if (onEndLoading) onEndLoading();
    }
  };

  return (
    <div className="w-full flex flex-col justify-between gap-4">
      {/* Mode Switch Tabs (Full Original Swiss 70s Segmented Switch) */}
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
              {/* Main Camera Dropzone (Full Original Sizing) */}
              <label className="w-full">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  disabled={disabled}
                  className="hidden"
                />
                <div
                  className={`w-full min-h-[160px] swiss-card-white flex flex-col items-center justify-center gap-3 p-6 text-center transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#FAF9F5]"
                  }`}
                >
                  <div className="w-14 h-14 bg-[#121212] text-[#F5CE42] flex items-center justify-center swiss-border">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="font-extrabold text-lg text-[#111111] block">
                      📷 パッケージを撮影する
                    </span>
                    <span className="text-xs text-[#555555] font-medium block mt-0.5">
                      スマホのカメラで原材料表示を撮影
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
                  disabled={disabled}
                  className="hidden"
                />
                <div
                  className={`w-full py-4 px-4 bg-[#121212] text-white swiss-border text-center font-extrabold text-xs flex items-center justify-center gap-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#222222]"
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-[#F5CE42]" />
                  <span>ライブラリから画像を選択する</span>
                </div>
              </label>
            </div>
          ) : (
            /* 撮影後・画像選択後の「写真確認（プレビュー）画面」 */
            <div className="swiss-card-dark p-4 sm:p-5 flex flex-col gap-4 animate-in fade-in duration-200">
              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <span className="font-display font-black text-xs text-[#F5CE42] tracking-widest flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#F5CE42]" />
                  <span>01. PHOTO PREVIEW</span>
                </span>
                <span className="text-[10px] text-white/60 font-bold">写真確認</span>
              </div>

              {/* 撮影画像プレビュー表示エリア */}
              <div className="w-full min-h-[180px] max-h-[260px] bg-[#0A0A0A] p-2 sm:p-3 flex items-center justify-center swiss-border relative overflow-hidden">
                <img
                  src={previewImage}
                  alt="撮影した原材料名"
                  className="max-h-[240px] w-auto object-contain rounded-xs"
                />
              </div>

              {/* メインアクションボタン（再撮影 / 写真を使用） */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleResetImage}
                  className="py-3.5 px-3 bg-[#222222] hover:bg-[#333333] text-white swiss-border font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-[#F5CE42]" />
                  <span>再撮影</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={disabled}
                  className="py-3.5 px-3 bg-[#EF4444] hover:bg-[#DC2626] text-white swiss-border swiss-shadow font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>写真を使用</span>
                </button>
              </div>

              {/* プライバシー注記 */}
              <p className="text-[10px] sm:text-[11px] font-bold text-white/70 text-center leading-tight pt-1 border-t border-white/10">
                ※撮影された画像や解析データはサーバー上に保存・収集されることはありません。
              </p>
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

      {/* Main Submit Button for Text Mode */}
      {activeTab === "text" && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !textInput.trim()}
          className="w-full py-4 bg-[#EF4444] hover:bg-[#DC2626] text-white swiss-border swiss-shadow font-black text-lg flex items-center justify-center gap-3 transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-white" />
          <span>判定を実行する</span>
        </button>
      )}
    </div>
  );
}
