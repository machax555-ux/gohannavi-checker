import React from "react";

export default function AffiliateNoticeFooter() {
  return (
    <footer className="pt-2 border-t-3 border-black text-center shrink-0 mt-auto flex flex-col items-center gap-1">
      <p className="text-[9.5px] sm:text-[10.5px] text-[#555555] font-bold leading-tight text-center px-2">
        当アプリは広告を利用しています。Amazonアソシエイトとして適格販売により収入を得ています。（
        <a
          href="https://gohannavi.com/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#111111]"
        >
          プライバシーポリシー
        </a>
        ）
      </p>
      <a
        href="https://gohannavi.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-display font-black tracking-widest text-[10px] md:text-xs text-[#111111] hover:underline inline-block mt-0.5"
      >
        GOHANNAVI.COM
      </a>
    </footer>
  );
}
