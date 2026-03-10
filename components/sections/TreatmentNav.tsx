"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";

export type TreatmentSearchRow = {
  section: string;
  subTab?: string;
  name: string;
  desc: string;
};

const CATEGORIES = [
  { id: "hifuka",  label: "皮膚科" },
  { id: "geka",   label: "外科" },
  { id: "tenteki", label: "点滴" },
  { id: "naifuku", label: "内服薬" },
];

export function TreatmentNav({ allRows }: { allRows: TreatmentSearchRow[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return allRows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.desc.toLowerCase().includes(q) ||
        (row.subTab ?? "").toLowerCase().includes(q)
    );
  }, [query, allRows]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      className="sticky top-16 md:top-20 z-30 border-y border-[var(--color-brand-gold)]/20"
      style={{ backgroundColor: "#f5f0e8" }}
    >
      {/* カテゴリボタン行 */}
      <div className="section-container">
        <div className="flex gap-2 overflow-x-auto py-3">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              onClick={() => setQuery("")}
              className="flex-shrink-0 px-5 py-2 text-xs tracking-widest text-[var(--color-brand-brown)] border border-[var(--color-brand-brown)]/25 hover:border-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)] transition-colors whitespace-nowrap"
            >
              {cat.label}
            </a>
          ))}
        </div>
      </div>

      {/* 検索行 */}
      <div className="relative border-t border-[var(--color-brand-gold)]/10">
        <div className="section-container py-2.5">
          <div className="relative flex items-center max-w-md">
            <svg
              className="absolute left-3 w-3.5 h-3.5 pointer-events-none text-[var(--color-brand-gold)]/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="施術名・キーワードで絞り込む..."
              className="w-full pl-9 pr-8 py-1.5 text-xs tracking-wider bg-white/60 border border-[var(--color-brand-brown)]/20 focus:border-[var(--color-brand-gold)]/50 focus:bg-white focus:outline-none text-[var(--color-brand-dark)] placeholder:text-[var(--color-text-secondary)]/40 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 text-[var(--color-text-secondary)]/50 hover:text-[var(--color-brand-dark)] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 検索結果パネル */}
        {query.trim() && (
          <div
            ref={panelRef}
            className="absolute top-full left-0 w-full z-50 shadow-xl border-b border-[var(--color-brand-gold)]/20 max-h-[60vh] overflow-y-auto"
            style={{ backgroundColor: "#fdfcfa" }}
          >
            {results.length === 0 ? (
              <div className="section-container py-6 text-xs text-[var(--color-text-secondary)]/60 tracking-wider">
                「{query}」に該当する施術が見つかりませんでした
              </div>
            ) : (
              <div className="section-container py-4">
                <p className="text-[10px] text-[var(--color-text-secondary)]/50 tracking-wider mb-3">
                  {results.length}件ヒット
                </p>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    {results.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-[var(--color-brand-brown)]/10 ${
                          i % 2 === 1 ? "bg-[var(--color-brand-cream)]/40" : ""
                        }`}
                      >
                        <td className="py-2.5 px-3 text-[10px] text-[var(--color-text-secondary)]/50 whitespace-nowrap w-28">
                          {row.section}{row.subTab ? ` › ${row.subTab}` : ""}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-[var(--color-brand-dark)] w-40">
                          {row.name.split(" / ").map((part, j) => (
                            <span key={j} className="block">{part}</span>
                          ))}
                        </td>
                        <td className="py-2.5 px-3 text-[var(--color-text-secondary)] leading-relaxed">
                          {row.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
