"use client";

import { useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  { id: "all",   label: "すべて" },
  { id: "目元",   label: "目元" },
  { id: "鼻",     label: "鼻" },
  { id: "口元",   label: "口元" },
  { id: "リフトアップ", label: "リフトアップ" },
  { id: "美容皮膚科",   label: "美容皮膚科" },
];

export type CaseItem = {
  id: string;
  slug: string;
  title: string;
  pillar: string[];
  treatment_label: string;
  timing?: string;
  concern: string;
  thumbnail: { url: string; width: number; height: number };
};

interface Props {
  cases?: CaseItem[];
  defaultCategory?: string;
}

export function CaseCarousel({ cases = [], defaultCategory = "all" }: Props) {
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const handleCategory = (id: string) => {
    setActiveCategory(id);
    emblaApi?.scrollTo(0, true);
  };

  const filtered = activeCategory === "all"
    ? cases
    : cases.filter((c) => c.pillar.includes(activeCategory));

  return (
    <div>
      {/* カテゴリフィルター */}
      <div className="section-container">
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.id)}
              className={`px-5 py-1.5 rounded-full text-sm tracking-wider border transition-colors ${
                activeCategory === cat.id
                  ? "bg-[var(--color-brand-gold)] border-[var(--color-brand-gold)] text-white"
                  : "border-[var(--color-brand-brown)]/30 text-[var(--color-text-secondary)] hover:border-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* カルーセル本体 */}
      {filtered.length > 0 ? (
        <div className="relative">
          {/* 矢印ボタン */}
          <button
            onClick={scrollPrev}
            aria-label="前へ"
            className="absolute left-3 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[var(--color-brand-brown)]/20 shadow-md flex items-center justify-center hover:bg-[var(--color-brand-cream)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="#1a1408" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={scrollNext}
            aria-label="次へ"
            className="absolute right-3 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[var(--color-brand-brown)]/20 shadow-md flex items-center justify-center hover:bg-[var(--color-brand-cream)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2L10 7L5 12" stroke="#1a1408" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Embla ビューポート */}
          <div className="overflow-hidden mx-12" ref={emblaRef}>
            <div className="flex">
              {filtered.map((c) => (
                <div
                  key={`${c.id}-${activeCategory}`}
                  className="flex-none w-[70vw] sm:w-[50vw] md:w-[280px] lg:w-[300px] px-2"
                >
                  <Link href={`/case/${c.slug}`} className="block group">
                    <div className="bg-white border border-[var(--color-brand-brown)]/10 overflow-hidden">
                      {/* サムネイル 1:1 */}
                      <div className="relative w-full aspect-square bg-[var(--color-brand-cream)] overflow-hidden">
                        <Image
                          src={c.thumbnail.url}
                          alt={c.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 70vw, (max-width: 768px) 50vw, 300px"
                        />
                      </div>

                      {/* 施術情報 */}
                      <div className="px-4 py-4 space-y-2 border-t border-[var(--color-brand-brown)]/10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)] shrink-0">施術名</span>
                          <span className="text-sm text-[var(--color-brand-dark)] font-light line-clamp-1">{c.treatment_label}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)] shrink-0">お悩み</span>
                          <span className="text-sm text-[var(--color-text-secondary)] font-light line-clamp-1">
                            {c.concern.split(",").slice(0, 3).join("・")}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)] shrink-0">経過</span>
                          <span className="text-sm text-[var(--color-text-secondary)] font-light">{c.timing ?? ""}</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="px-4 pb-4">
                        <span className="block text-center text-[11px] tracking-[0.18em] border border-[var(--color-brand-dark)] py-2.5 text-[var(--color-brand-dark)] group-hover:bg-[var(--color-brand-dark)] group-hover:text-white transition-colors">
                          この症例を詳しく見る
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="section-container">
          <p className="text-sm text-[var(--color-text-secondary)] py-8 text-center font-light">
            症例は準備中です
          </p>
        </div>
      )}
    </div>
  );
}
