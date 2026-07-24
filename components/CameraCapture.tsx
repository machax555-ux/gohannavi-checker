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
    <div className="w-full h-full flex flex-col justify-between gap-3 overflow-hidden">
      {/* Mode Switch Tabs (Swiss 70s Segmented Switch) */}
      <div className="grid grid-cols-2 bg-[#121212] p-1 swiss-border shrink-0">
        <button
          type="button"
          onClick={() => {
            setActiveTab("camera");
            if (onError) onError("");
          }}
          className={`py-2 text-[11px] font-black font-display tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === "camera"
              ? "bg-[#F5CE42] text-[#111111]"
              : "bg-transparent text-white hover:text-[#F5CE42]"
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>01. CAMERA</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("text");
            if (onError) onError("");
          }}
          className={`py-2 text-[11px] font-black font-display tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === "text"
              ? "bg-[#F5CE42] text-[#111111]"
              : "bg-transparent text-white hover:text-[#F5CE42]"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>02. TEXT INPUT</span>
        </button>
      </div>

      {/* Camera Mode Area */}
      {activeTab === "camera" && (
        <div className="flex-1 flex flex-col justify-center gap-3 overflow-hidden my-auto">
          {!previewImage ? (
            <div className="flex flex-col gap-2.5">
              {/* Main Camera Dropzone */}
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
                  className={`w-full min-h-[110px] sm:min-h-[130px] swiss-card-white flex flex-col items-center justify-center gap-2 p-4 text-center transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#FAF9F5]"
                  }`}
                >
                  <div className="w-10 h-10 bg-[#121212] text-[#F5CE42] flex items-center justify-center swiss-border">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-extrabold text-base text-[#111111] block">
                      📷 パッケージを撮影する
                    </span>
                    <span className="text-[10px] text-[#555555] font-medium block mt-0.5">
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
                  className={`w-full py-2.5 px-3 bg-[#121212] text-white swiss-border text-center font-extrabold text-xs flex items-center justify-center gap-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#222222]"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#F5CE42]" />
                  <span>ライブラリから画像を選択する</span>
                </div>
              </label>
            </div>
          ) : (
            /* Image Preview Area */
            <div className="swiss-card-white p-3 flex flex-col items-center gap-2">
              <div className="w-full flex justify-between items-center border-b-2 border-black pb-1">
                <span className="font-display font-black text-[10px] text-[#111111] tracking-widest">
                  SELECTED IMAGE
                </span>
                <button
                  type="button"
                  onClick={handleResetImage}
                  className="flex items-center gap-1 text-[11px] text-[#EF4444] font-black hover:underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>撮り直す</span>
                </button>
              </div>
              <div className="w-full max-h-[160px] bg-[#121212] p-1.5 flex items-center justify-center swiss-border">
                <img
                  src={previewImage}
                  alt="撮影した原材料名"
                  className="max-h-[140px] w-auto object-contain"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Text Mode Area */}
      {activeTab === "text" && (
        <div className="flex-1 swiss-card-dark p-3 flex flex-col justify-between gap-1.5 my-auto overflow-hidden">
          <span className="font-display font-black text-[10px] text-[#F5CE42] tracking-widest border-b border-white/20 pb-1 shrink-0">
            INPUT INGREDIENT TEXT
          </span>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value.slice(0, MAX_TEXT_LENGTH))}
            maxLength={MAX_TEXT_LENGTH}
            placeholder={`原材料名をここに貼り付けてください\n例）小麦粉、砂糖、食塩、醤油、ソルビン酸K、着色料（赤102）`}
            rows={5}
            disabled={disabled}
            className="w-full h-full p-2 bg-white text-[#111111] swiss-border-sm focus:outline-none text-xs font-bold leading-relaxed resize-none mt-1"
          />
          <div className="text-right text-[9px] text-white/60 font-mono shrink-0">
            {MAX_TEXT_LENGTH - textInput.length} / {MAX_TEXT_LENGTH} CHARS LEFT
          </div>
        </div>
      )}

      {/* Main Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={
          disabled ||
          (activeTab === "camera" && !previewImage) ||
          (activeTab === "text" && !textInput.trim())
        }
        className="w-full py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white swiss-border swiss-shadow-sm font-black text-base flex items-center justify-center gap-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
      >
        <Sparkles className="w-4 h-4 text-white" />
        <span>判定を実行する</span>
      </button>
    </div>
  );
}
