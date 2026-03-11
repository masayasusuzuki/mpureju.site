"use client";

import { useState } from "react";
import type { PriceRow, SubTab } from "@/lib/price-data";

export function PriceSubTabs({ tabs }: { tabs: SubTab[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = tabs[activeIdx];
  const hasOption = current.rows.some((r) => r.option);

  return (
    <div>
      {/* サブタブ */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveIdx(i)}
            className={`px-4 py-1.5 text-xs tracking-wider rounded-full border transition-colors ${
              i === activeIdx
                ? "border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10"
                : "border-[var(--color-brand-brown)]/30 text-[var(--color-text-secondary)] hover:border-[var(--color-brand-gold)]/50 hover:text-[var(--color-brand-dark)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 価格テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[420px] border-collapse">
          <thead>
            <tr className="bg-[var(--color-brand-brown)] text-[var(--color-brand-cream)]">
              <th className="text-left py-3 px-4 font-medium text-xs tracking-wider w-64">
                カテゴリー
              </th>
              {hasOption && (
                <th className="text-left py-3 px-4 font-medium text-xs tracking-wider w-40">
                  オプション
                </th>
              )}
              <th className="text-right py-3 px-4 font-medium text-xs tracking-wider w-32">
                価格（税込）
              </th>
            </tr>
          </thead>
          <tbody>
            {current.rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-[var(--color-brand-brown)]/10 ${
                  i % 2 === 1 ? "bg-[var(--color-brand-cream)]/40" : ""
                }`}
              >
                <td className="py-3 px-4 text-[var(--color-text-primary)] leading-relaxed">
                  {row.category}
                </td>
                {hasOption && (
                  <td className="py-3 px-4 text-[var(--color-text-secondary)] text-xs">
                    {row.option ?? ""}
                  </td>
                )}
                <td className="py-3 px-4 text-right font-medium text-[var(--color-brand-dark)] tabular-nums">
                  {row.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
