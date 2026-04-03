"use client";

import { useState } from "react";
import Link from "next/link";

export type TreatmentRow = {
  name: string;
  desc: string;
  risks: string;
};

export type TreatmentSubTab = {
  label: string;
  rows: TreatmentRow[];
};

function TreatmentTable({ rows }: { rows: TreatmentRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-[var(--color-brand-brown)] text-[var(--color-brand-cream)]">
            <th className="text-left py-3 px-4 font-medium text-xs tracking-wider w-44">施術名</th>
            <th className="text-left py-3 px-4 font-medium text-xs tracking-wider">概要</th>
            <th className="text-left py-3 px-4 font-medium text-xs tracking-wider w-52">リスク・副作用</th>
            <th className="text-right py-3 px-4 font-medium text-xs tracking-wider w-20">料金</th>
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
              <td className="py-3 px-4 font-medium text-[var(--color-brand-dark)] align-top">
                {row.name.split(" / ").map((part, j) => (
                  <span key={j} className="block">{part}</span>
                ))}
              </td>
              <td className="py-3 px-4 text-[var(--color-text-secondary)] leading-relaxed align-top">{row.desc}</td>
              <td className="py-3 px-4 text-[var(--color-text-secondary)] text-xs leading-relaxed align-top">{row.risks}</td>
              <td className="py-3 px-4 text-right align-top">
                <Link
                  href={`/price?q=${encodeURIComponent(row.name.split(" / ")[0])}`}
                  className="text-xs text-[var(--color-brand-gold)] hover:underline whitespace-nowrap"
                >
                  料金 →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TreatmentSubTabs({ tabs }: { tabs: TreatmentSubTab[] }) {
  const [active, setActive] = useState(0);

  if (!tabs.length) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`px-4 py-1.5 text-sm tracking-wider transition-colors border ${
              i === active
                ? "bg-[var(--color-brand-dark)] text-[var(--color-brand-cream)] border-[var(--color-brand-dark)]"
                : "text-[var(--color-text-secondary)] border-[var(--color-brand-brown)]/20 hover:border-[var(--color-brand-dark)] hover:text-[var(--color-brand-dark)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <TreatmentTable rows={tabs[active].rows} />
    </div>
  );
}
