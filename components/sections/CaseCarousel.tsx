"use client";

import { useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";

const CATEGORIES = [
  { id: "all",   label: "すべて" },
  { id: "eye",   label: "目元" },
  { id: "nose",  label: "鼻" },
  { id: "mouth", label: "口元" },
  { id: "lift",  label: "リフトアップ" },
  { id: "skin",  label: "美容皮膚科" },
];

// TODO: Phase 2 で microCMS cases から取得に切り替え
const CASES = [
  { id: 1,  category: "eye",   treatment: "二重埋没法",        concern: "一重まぶた",        age: "20代" },
  { id: 2,  category: "nose",  treatment: "鼻尖形成",          concern: "丸い鼻先",          age: "30代" },
  { id: 3,  category: "mouth", treatment: "口角挙上",          concern: "口角の下垂",        age: "40代" },
  { id: 4,  category: "lift",  treatment: "糸リフト",          concern: "頬のたるみ",        age: "50代" },
  { id: 5,  category: "skin",  treatment: "ポテンツァ",        concern: "毛穴・ニキビ跡",   age: "20代" },
  { id: 6,  category: "eye",   treatment: "眼瞼下垂",          concern: "目が開きにくい",    age: "30代" },
  { id: 7,  category: "nose",  treatment: "プロテーゼ",        concern: "低い鼻",            age: "20代" },
  { id: 8,  category: "mouth", treatment: "人中短縮",          concern: "人中が長い",        age: "30代" },
  { id: 9,  category: "lift",  treatment: "MACSフェイスリフト", concern: "フェイスラインの緩み", age: "50代" },
  { id: 10, category: "skin",  treatment: "ボトックス注射",    concern: "額のシワ",          age: "40代" },
];

interface Props {
  defaultCategory?: string;
}

export function CaseCarousel({ defaultCategory = "all" }: Props) {
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
    ? CASES
    : CASES.filter((c) => c.category === activeCategory);

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
                className="flex-none w-[80vw] sm:w-[60vw] md:w-[300px] lg:w-[340px] px-2"
              >
                <div className="bg-white border border-[var(--color-brand-brown)]/10 overflow-hidden">

                  {/* Before */}
                  <div className="relative w-full bg-[#e8e4dc]" style={{ paddingBottom: "75%" }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[var(--color-text-secondary)]/40 text-xs tracking-[0.25em]">PHOTO</span>
                    </div>
                    <span className="absolute top-2 left-2 text-[10px] tracking-[0.2em] text-[var(--color-text-secondary)] bg-white/80 px-2 py-0.5">
                      Before
                    </span>
                  </div>

                  {/* 仕切り */}
                  <div className="h-px bg-[var(--color-brand-brown)]/10" />

                  {/* After */}
                  <div className="relative w-full bg-[#ddd8cf]" style={{ paddingBottom: "75%" }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[var(--color-text-secondary)]/40 text-xs tracking-[0.25em]">PHOTO</span>
                    </div>
                    <span className="absolute top-2 left-2 text-[10px] tracking-[0.2em] text-[var(--color-text-secondary)] bg-white/80 px-2 py-0.5">
                      After
                    </span>
                  </div>

                  {/* 施術情報 */}
                  <div className="px-4 py-4 space-y-2 border-t border-[var(--color-brand-brown)]/10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)] shrink-0">施術名</span>
                      <span className="text-sm text-[var(--color-brand-dark)] font-light">{c.treatment}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)] shrink-0">お悩み</span>
                      <span className="text-sm text-[var(--color-text-secondary)] font-light">{c.concern}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)] shrink-0">年代</span>
                      <span className="text-sm text-[var(--color-text-secondary)] font-light">{c.age}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="px-4 pb-4">
                    <Link
                      href="/case"
                      className="block text-center text-[11px] tracking-[0.18em] border border-[var(--color-brand-dark)] py-2.5 text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white transition-colors"
                    >
                      この症例を詳しく見る
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
