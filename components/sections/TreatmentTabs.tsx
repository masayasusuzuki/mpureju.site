"use client";

import { useState } from "react";
import Link from "next/link";
import type { Pillar } from "@/lib/microcms/types";

type TabItem = {
  id: Pillar;
  label: string;
  pillarHref: string;
  treatments: { name: string; desc: string; href: string }[];
};

const PILLAR_META: Record<Pillar, { label: string; href: string }> = {
  mouth: { label: "口元", href: "/mouth" },
  eye:   { label: "目元", href: "/eye" },
  nose:  { label: "鼻",   href: "/nose" },
  lift:  { label: "リフトアップ", href: "/lift" },
  skin:  { label: "美容皮膚科",  href: "/skin" },
};

const PILLAR_ORDER: Pillar[] = ["mouth", "eye", "nose", "lift", "skin"];

export type TreatmentTabsProps = {
  treatments: {
    title: string;
    slug: string;
    pillar: Pillar[];
    catch_copy: string;
  }[];
};

export function TreatmentTabs({ treatments }: TreatmentTabsProps) {
  const tabs: TabItem[] = PILLAR_ORDER.map((id) => {
    const meta = PILLAR_META[id];
    const items = treatments
      .filter((t) => t.pillar.includes(id))
      .map((t) => ({
        name: t.title,
        desc: t.catch_copy || "",
        href: `${meta.href}/${t.slug}`,
      }));
    return { id, label: meta.label, pillarHref: meta.href, treatments: items };
  });

  const [activeId, setActiveId] = useState<string>("mouth");
  const current = tabs.find((t) => t.id === activeId)!;

  return (
    <div>
      {/* タブ */}
      <div className="flex flex-wrap border-b border-[var(--color-brand-brown)]/20 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={`relative px-4 md:px-6 py-3 text-sm tracking-wider transition-colors ${
              activeId === tab.id
                ? "text-[var(--color-brand-gold)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-brand-dark)]"
            }`}
          >
            {tab.label}
            {activeId === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-brand-gold)]" />
            )}
          </button>
        ))}
      </div>

      {/* 施術リスト */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 mb-10">
        {current.treatments.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group flex items-start gap-3 hover:opacity-80 transition-opacity"
          >
            <span className="text-[var(--color-brand-gold)] shrink-0 mt-0.5">—</span>
            <span>
              <span className="block text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-gold)] transition-colors">
                {item.name}
              </span>
              <span className="block text-xs text-[var(--color-text-secondary)] font-light mt-0.5 leading-relaxed">
                {item.desc}
              </span>
            </span>
          </Link>
        ))}
      </div>

      {/* ピラーページへ */}
      <div className="flex justify-end">
        <Link
          href={current.pillarHref}
          className="text-xs tracking-widest text-[var(--color-text-secondary)] border-b border-current pb-0.5 hover:text-[var(--color-brand-gold)] transition-colors"
        >
          {current.label}の施術をすべて見る →
        </Link>
      </div>
    </div>
  );
}
