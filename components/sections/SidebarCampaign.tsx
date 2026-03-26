"use client";

import { useState, useEffect, useCallback } from "react";
import type { Campaign } from "@/types/microcms";

interface Props {
  campaigns: Campaign[];
}

export function SidebarCampaign({ campaigns }: Props) {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  const hasMultiple = campaigns.length > 1;

  const goTo = useCallback((next: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(next);
      setFade(true);
    }, 300);
  }, []);

  const prev = () => goTo(current === 0 ? campaigns.length - 1 : current - 1);
  const next = () => goTo(current === campaigns.length - 1 ? 0 : current + 1);

  useEffect(() => {
    if (!hasMultiple) return;
    const id = setInterval(() => {
      goTo(current === campaigns.length - 1 ? 0 : current + 1);
    }, 5000);
    return () => clearInterval(id);
  }, [current, hasMultiple, campaigns.length, goTo]);

  if (campaigns.length === 0) return null;

  const campaign = campaigns[current];

  const banner = (
    <div
      className="aspect-video overflow-hidden rounded-sm transition-opacity duration-300"
      style={{ opacity: fade ? 1 : 0 }}
    >
      <img
        src={campaign.image.url}
        alt={campaign.title}
        className="w-full h-full object-cover"
      />
    </div>
  );

  return (
    <div className="border border-[var(--color-brand-gold)]/30 rounded-sm overflow-hidden">
      <div className="bg-[var(--color-brand-gold)]/10 px-4 py-3">
        <p className="text-xs tracking-[0.15em] text-[var(--color-brand-gold)] font-medium">
          CAMPAIGN
        </p>
      </div>
      <div className="p-3">
        {campaign.link_url ? (
          <a href={campaign.link_url} target="_blank" rel="noopener noreferrer" className="block">
            {banner}
          </a>
        ) : (
          banner
        )}
        {hasMultiple && (
          <div className="flex items-center justify-center gap-4 mt-2.5">
            <button
              onClick={prev}
              aria-label="前のキャンペーン"
              className="w-7 h-7 flex items-center justify-center rounded-full border border-[var(--color-brand-gold)]/30 text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-cream)] transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <p className="text-[0.625rem] text-[var(--color-text-secondary)] tabular-nums">
              {current + 1} / {campaigns.length}
            </p>
            <button
              onClick={next}
              aria-label="次のキャンペーン"
              className="w-7 h-7 flex items-center justify-center rounded-full border border-[var(--color-brand-gold)]/30 text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-cream)] transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
