"use client";

import { useState } from "react";

export interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-[var(--color-brand-brown)]/10">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-start justify-between py-5 text-left gap-6"
          >
            <span className="flex items-start gap-3">
              <span className="font-en text-xs tracking-wider text-[var(--color-brand-gold)] shrink-0 mt-0.5">
                Q
              </span>
              <span className="text-sm md:text-base text-[var(--color-brand-dark)] font-light leading-relaxed">
                {item.q}
              </span>
            </span>
            <span
              className={`shrink-0 w-6 h-6 flex items-center justify-center border border-[var(--color-brand-brown)]/20 rounded-full transition-transform duration-200 mt-0.5 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            >
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path
                  d="M1 1L5 5L9 1"
                  stroke="#1a1408"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          {openIndex === i && (
            <div className="pb-5 pl-7 text-sm text-[var(--color-text-secondary)] leading-relaxed font-light">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
