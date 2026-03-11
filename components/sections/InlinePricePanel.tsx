"use client";

import { useState } from "react";
import type { PriceRow } from "@/lib/price-data";

export function InlinePricePanel({
  title,
  rows,
}: {
  title: string;
  rows: PriceRow[];
}) {
  const [open, setOpen] = useState(false);
  const hasOption = rows.some((r) => r.option);

  if (rows.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-full bg-white border border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] py-4 text-sm tracking-widest font-medium hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-brand-dark)] transition-colors"
      >
        {title}の料金を確認する
        <svg
          className={`ml-2 w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-3 border border-[var(--color-brand-brown)]/15 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--color-brand-brown)] text-[var(--color-brand-cream)]">
                  <th className="text-left py-2.5 px-4 font-medium text-xs tracking-wider">
                    施術内容
                  </th>
                  {hasOption && (
                    <th className="text-left py-2.5 px-4 font-medium text-xs tracking-wider">
                      オプション
                    </th>
                  )}
                  <th className="text-right py-2.5 px-4 font-medium text-xs tracking-wider">
                    価格（税込）
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-[var(--color-brand-brown)]/10 ${
                      i % 2 === 1 ? "bg-[var(--color-brand-cream)]/40" : ""
                    }`}
                  >
                    <td className="py-2.5 px-4 text-[var(--color-text-primary)] leading-relaxed">
                      {row.category}
                    </td>
                    {hasOption && (
                      <td className="py-2.5 px-4 text-[var(--color-text-secondary)] text-xs">
                        {row.option ?? ""}
                      </td>
                    )}
                    <td className="py-2.5 px-4 text-right font-medium text-[var(--color-brand-dark)] tabular-nums whitespace-nowrap">
                      {row.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-4 py-2 text-[10px] text-[var(--color-text-secondary)]/60 tracking-wider">
            ※ 詳細はカウンセリング時にご確認ください
          </p>
        </div>
      )}
    </div>
  );
}
