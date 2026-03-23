"use client";

import { useState, useEffect, useRef } from "react";

type FaqCategory = {
  id: string;
  label: string;
};

export function FaqNav({ categories }: { categories: FaqCategory[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // 画面上部に最も近いvisibleセクションをactiveにする
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    const sections = categories
      .map((c) => document.getElementById(c.id))
      .filter(Boolean) as HTMLElement[];

    sections.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [categories]);

  return (
    <div
      className="sticky top-16 md:top-20 z-30 border-y border-[var(--color-brand-gold)]/20"
      style={{ backgroundColor: "#f5f0e8" }}
    >
      <div className="section-container">
        <nav className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className={`flex-shrink-0 px-5 py-2 text-xs tracking-widest whitespace-nowrap border transition-colors ${
                activeId === cat.id
                  ? "border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/5"
                  : "border-[var(--color-brand-brown)]/25 text-[var(--color-brand-brown)] hover:border-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)]"
              }`}
            >
              {cat.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
