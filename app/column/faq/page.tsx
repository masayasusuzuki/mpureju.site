import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ScrollFadeIn } from "@/components/ui/ScrollFadeIn";
import { FaqNav } from "@/components/sections/FaqNav";
import { FAQ_CATEGORIES } from "@/lib/faq-page-data";
import { FaqHashOpener } from "@/components/ui/FaqHashOpener";

export const metadata: Metadata = {
  title: "よくあるご質問（FAQ）｜Maison PUREJU 銀座の美容外科・美容皮膚科",
  description:
    "Maison PUREJU（銀座）のよくあるご質問。口元・目元・鼻・リフトアップ・美容皮膚科の施術に関する疑問にお答えします。",
};

export default function FaqPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(150deg, #fdfcfa 0%, #f0e8d8 60%, #e8dcc8 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 90% 10%, rgba(201,169,110,0.12) 0%, transparent 55%)" }}
        />
        <div className="relative section-container py-12 md:py-16">
          <nav className="flex items-center gap-2 text-xs mb-8 tracking-wider text-[var(--color-text-secondary)]/60">
            <Link href="/" className="hover:text-[var(--color-brand-gold)] transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span className="text-[var(--color-text-secondary)]">よくあるご質問</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            FAQ
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-widest text-[var(--color-brand-dark)] leading-tight">
            よくあるご質問
          </h1>
        </div>
      </section>

      {/* ── ハッシュによる自動スクロール＋開閉 ── */}
      <FaqHashOpener />

      {/* ── カテゴリナビ（スクロール追従 + アクティブ表示） ── */}
      <Suspense fallback={null}>
        <FaqNav categories={FAQ_CATEGORIES.map((c) => ({ id: c.id, label: c.label }))} />
      </Suspense>

      {/* ── FAQ セクション ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-container max-w-3xl space-y-20">
          {FAQ_CATEGORIES.map((cat, catIdx) => (
            <div key={cat.id} id={cat.id} className="scroll-mt-20">
              <ScrollFadeIn>
                <div className="flex items-end gap-3 mb-8">
                  <span
                    className="font-en text-5xl leading-none text-[var(--color-brand-dark)] select-none"
                    style={{ opacity: 0.06 }}
                    aria-hidden="true"
                  >
                    {String(catIdx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-en text-[10px] tracking-[0.3em] text-[var(--color-brand-gold)] mb-1">
                      {cat.en}
                    </p>
                    <h2 className="font-serif text-lg md:text-xl text-[var(--color-brand-dark)] tracking-wide">
                      {cat.label}
                    </h2>
                  </div>
                </div>
              </ScrollFadeIn>

              <div className="space-y-0">
                {cat.items.map((item, i) => (
                  <ScrollFadeIn key={i} delay={i * 0.03}>
                    <details id={`faq-${cat.id}-${i}`} className="group border-b border-[var(--color-brand-brown)]/10 scroll-mt-24">
                      <summary className="flex items-start gap-4 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        <span className="shrink-0 font-en text-sm font-medium text-[var(--color-brand-gold)] mt-0.5">
                          Q.
                        </span>
                        <span className="flex-1 text-sm md:text-base text-[var(--color-brand-dark)] leading-relaxed tracking-wide">
                          {item.q}
                        </span>
                        <span className="shrink-0 w-5 h-5 mt-0.5 flex items-center justify-center text-[var(--color-brand-gold)] transition-transform group-open:rotate-45">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </span>
                      </summary>
                      <div className="flex items-start gap-4 pb-6 pl-0">
                        <span className="shrink-0 font-en text-sm font-medium text-[var(--color-brand-dark)]/30 mt-0.5">
                          A.
                        </span>
                        <p className="flex-1 text-sm text-[var(--color-text-secondary)] leading-[2.2] font-light">
                          {item.a}
                        </p>
                      </div>
                    </details>
                  </ScrollFadeIn>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 bg-[var(--color-brand-cream)]">
        <div className="section-container text-center">
          <p
            className="font-en text-6xl md:text-7xl leading-none text-[var(--color-brand-gold)] select-none mb-4"
            style={{ opacity: 0.12 }}
            aria-hidden="true"
          >
            Contact
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-4 leading-relaxed tracking-wide">
            解決しないお悩みはお気軽にご相談ください
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-10 leading-relaxed font-light">
            カウンセリングは無料です。施術内容やダウンタイムなど、どんなことでもお聞きください。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://reservation.medical-force.com/c/0600773fd2b74afaba1282effeb9644d"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-4 min-w-[240px] py-4 bg-[var(--color-brand-dark)] text-white text-sm tracking-widest rounded-full hover:opacity-90 transition-opacity"
            >
              無料カウンセリング予約
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors"
            >
              お問い合わせフォーム
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
