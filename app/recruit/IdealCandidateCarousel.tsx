"use client";

import { useState } from "react";

interface Item {
  en: string;
  ja: string;
  text: string;
  icon: string;
}

export function IdealCandidateCarousel({ items }: { items: Item[] }) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? items.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));

  const getIndex = (offset: number) => (current + offset + items.length) % items.length;

  return (
    <div className="max-w-5xl mx-auto">
      {/* カルーセル本体 */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* 左ボタン */}
        <button
          onClick={prev}
          className="shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-[var(--color-brand-gold)]/25 text-[var(--color-brand-gold)] hover:bg-white transition-colors z-10"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* 3カード表示 */}
        <div className="flex-1 min-w-0 flex items-stretch gap-3 md:gap-4">
          {[-1, 0, 1].map((offset) => {
            const idx = getIndex(offset);
            const item = items[idx];
            const isCenter = offset === 0;

            return (
              <div
                key={`${idx}-${offset}`}
                onClick={() => !isCenter && setCurrent(idx)}
                className={`transition-all duration-300 rounded-lg border overflow-hidden ${
                  isCenter
                    ? "flex-[2] bg-white border-[var(--color-brand-gold)]/20 shadow-sm"
                    : "flex-[0.6] bg-white/60 border-[var(--color-brand-brown)]/6 cursor-pointer hover:bg-white/80 hidden md:block"
                }`}
              >
                <div className={`text-center ${isCenter ? "px-8 py-8" : "px-4 py-6 opacity-40"}`}>
                  {/* SVG */}
                  <div className="flex justify-center mb-3">
                    <div
                      className={isCenter ? "w-44 h-44 md:w-52 md:h-52" : "w-20 h-20"}
                      dangerouslySetInnerHTML={{ __html: item.icon }}
                    />
                  </div>

                  {/* テキスト */}
                  {isCenter ? (
                    <>
                      <p className="font-en text-[0.625rem] tracking-[0.3em] text-[var(--color-brand-gold)] mb-1">
                        {String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                      </p>
                      <p className="font-en text-sm tracking-[0.2em] text-[var(--color-brand-gold)] mb-1">
                        {item.en}
                      </p>
                      <p className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] mb-4 tracking-wider">
                        {item.ja}
                      </p>
                      <div className="w-10 h-px bg-[var(--color-brand-gold)]/40 mx-auto mb-4" />
                      <p className="text-sm text-[var(--color-text-secondary)] leading-[2] font-light max-w-md mx-auto">
                        {item.text}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-en text-xs tracking-[0.15em] text-[var(--color-brand-gold)] mb-0.5">
                        {item.en}
                      </p>
                      <p className="text-sm text-[var(--color-brand-dark)]">
                        {item.ja}
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 右ボタン */}
        <button
          onClick={next}
          className="shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-[var(--color-brand-gold)]/25 text-[var(--color-brand-gold)] hover:bg-white transition-colors z-10"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ドットインジケーター */}
      <div className="flex justify-center gap-2 mt-6">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current
                ? "bg-[var(--color-brand-gold)] w-5"
                : "bg-[var(--color-brand-brown)]/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
