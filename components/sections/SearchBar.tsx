"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const POPULAR_KEYWORDS = [
  { label: "二重", query: "二重" },
  { label: "糸リフト", query: "糸リフト" },
  { label: "ポテンツァ", query: "ポテンツァ" },
  { label: "口角挙上", query: "口角挙上" },
  { label: "ヒアルロン酸", query: "ヒアルロン酸" },
  { label: "鼻尖形成", query: "鼻尖形成" },
];

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // 検索結果が返ってきたらオーバーレイを消す
  useEffect(() => {
    setIsSearching(false);
  }, [searchParams]);

  const navigate = (q: string) => {
    setIsSearching(true);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(q);
  };

  return (
    <>
      {/* 検索中オーバーレイ */}
      {isSearching && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-brand-white)]">
          <style>{`
            @keyframes sb-swing {
              0%   { transform: rotate(-22deg) translateY(0px); }
              25%  { transform: rotate(0deg)   translateY(-6px); }
              50%  { transform: rotate(22deg)  translateY(0px); }
              75%  { transform: rotate(0deg)   translateY(-6px); }
              100% { transform: rotate(-22deg) translateY(0px); }
            }
            @keyframes sb-scan {
              0%   { transform: translateY(-9px); opacity: 0; }
              15%  { opacity: 0.7; }
              85%  { opacity: 0.7; }
              100% { transform: translateY(9px);  opacity: 0; }
            }
            @keyframes sb-dot {
              0%, 60%, 100% { opacity: 0.2; transform: translateY(0); }
              30%            { opacity: 1;   transform: translateY(-5px); }
            }
            @keyframes sb-ring {
              0%   { transform: scale(0.85); opacity: 0.5; }
              60%  { transform: scale(1.2);  opacity: 0; }
              100% { transform: scale(1.2);  opacity: 0; }
            }
          `}</style>

          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute w-24 h-24 rounded-full border border-[var(--color-brand-gold)]/30"
              style={{ animation: "sb-ring 2s ease-out infinite" }} />
            <div className="absolute w-24 h-24 rounded-full border border-[var(--color-brand-gold)]/20"
              style={{ animation: "sb-ring 2s ease-out infinite", animationDelay: "0.6s" }} />
            <div style={{ animation: "sb-swing 1.6s ease-in-out infinite", transformOrigin: "75% 75%" }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" stroke="var(--color-brand-gold)" strokeWidth="1.4" />
                <line x1="5.5" y1="11" x2="16.5" y2="11"
                  stroke="var(--color-brand-gold)" strokeWidth="1" strokeOpacity="0.45"
                  style={{ animation: "sb-scan 1.6s ease-in-out infinite" }} />
                <path d="M21 21l-4.35-4.35" stroke="var(--color-brand-gold)" strokeWidth="1.4" />
              </svg>
            </div>
          </div>

          <p className="font-serif text-base tracking-[0.2em] text-[var(--color-brand-dark)] mb-3">
            検索しています
          </p>
          <div className="flex items-center gap-1.5">
            {[0, 0.18, 0.36].map((delay, i) => (
              <span
                key={i}
                className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)]"
                style={{ animation: "sb-dot 1.2s ease-in-out infinite", animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 検索フォーム本体 */}
      <div className="w-full max-w-2xl mx-auto text-center">
        <p className="font-serif text-sm tracking-[0.15em] text-[var(--color-brand-gold)] mb-4">
          施術・お悩みから探す
        </p>
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例：二重、ヒアルロン酸、たるみ"
            className="w-full border border-[var(--color-brand-brown)]/20 bg-white px-6 py-4 pr-14 text-base text-[var(--color-brand-dark)] placeholder:text-[var(--color-text-secondary)]/40 focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-brand-gold)] hover:text-[var(--color-brand-dark)] transition-colors"
            aria-label="検索"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </form>
        <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
          <span className="text-xs text-[var(--color-text-secondary)]">人気:</span>
          {POPULAR_KEYWORDS.map((kw) => (
            <button
              key={kw.query}
              type="button"
              onClick={() => navigate(kw.query)}
              className="text-xs text-[var(--color-brand-dark)] border border-[var(--color-brand-brown)]/15 px-3.5 py-1.5 hover:border-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)] transition-colors"
            >
              {kw.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
