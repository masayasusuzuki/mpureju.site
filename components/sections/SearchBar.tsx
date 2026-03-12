"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
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
            onClick={() => router.push(`/search?q=${encodeURIComponent(kw.query)}`)}
            className="text-xs text-[var(--color-brand-dark)] border border-[var(--color-brand-brown)]/15 px-3.5 py-1.5 hover:border-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)] transition-colors"
          >
            {kw.label}
          </button>
        ))}
      </div>
    </div>
  );
}
