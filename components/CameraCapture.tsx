"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Image as ImageIcon, RefreshCw, Sparkles } from "lucide-react";
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

  // Handle Image File Selection
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

  // Reset selected image
  const handleResetImage = () => {
    setPreviewImage(null);
    if (onError) onError("");
  };

  // Execute Check API Submission
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

      // Save to LocalStorage limit
      incrementUsage();

      // Save result to sessionStorage key "gohannavi_result"
      sessionStorage.setItem("gohannavi_result", JSON.stringify(data));

      // Navigate to result page
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
    <div className="w-full flex flex-col gap-5">
      {/* Mode Switch Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-2xl">
        <button
          type="button"
          onClick={() => {
            setActiveTab("camera");
            if (onError) onError("");
          }}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === "camera"
              ? "bg-[#2D6A4F] text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <span>📷 カメラで撮影</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("text");
            if (onError) onError("");
          }}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === "text"
              ? "bg-[#2D6A4F] text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <span>✏️ テキストで入力</span>
        </button>
      </div>

      {/* Camera Mode */}
      {activeTab === "camera" && (
        <div className="flex flex-col gap-4">
          {!previewImage ? (
            <div className="flex flex-col gap-3">
              {/* Main Camera Capture Button (>= 120px height) */}
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
                  className={`w-full min-h-[130px] bg-[#2D6A4F] text-white rounded-2xl flex flex-col items-center justify-center gap-2 font-bold text-lg shadow-md transition active:scale-[0.98] ${
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#255740]"
                  }`}
                >
                  <Camera className="w-10 h-10 text-white" />
                  <span>カメラで原材料を撮影する</span>
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
                  className={`w-full py-3.5 px-4 border-2 border-[#2D6A4F] text-[#2D6A4F] bg-white rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm transition active:scale-[0.98] ${
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-emerald-50"
                  }`}
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>ライブラリから画像を選択</span>
                </div>
              </label>
            </div>
          ) : (
            /* Image Preview Area */
            <div className="flex flex-col items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <div className="w-full flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-gray-500">選択した画像</span>
                <button
                  type="button"
                  onClick={handleResetImage}
                  className="flex items-center gap-1 text-xs text-[#E63946] font-bold hover:underline"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>撮り直す</span>
                </button>
              </div>
              <img
                src={previewImage}
                alt="撮影した原材料名"
                className="max-h-[200px] w-auto object-contain rounded-xl border border-gray-200 shadow-sm"
              />
            </div>
          )}
        </div>
      )}

      {/* Text Mode */}
      {activeTab === "text" && (
        <div className="flex flex-col gap-2">
          <div className="relative">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value.slice(0, MAX_TEXT_LENGTH))}
              maxLength={MAX_TEXT_LENGTH}
              placeholder={`原材料名をここに貼り付けてください\n例）小麦粉、砂糖、食塩、醤油（大豆・小麦を含む）`}
              rows={6}
              disabled={disabled}
              className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] focus:outline-none text-sm leading-relaxed resize-none bg-white"
            />
            <div className="text-right text-xs text-gray-400 mt-1 font-mono">
              残り {MAX_TEXT_LENGTH - textInput.length} / {MAX_TEXT_LENGTH} 文字
            </div>
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
        className="w-full py-4 bg-[#2D6A4F] hover:bg-[#255740] text-white rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-5 h-5" />
        <span>添加物を判定する</span>
      </button>
    </div>
  );
}
