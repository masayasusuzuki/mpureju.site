import Image from "next/image";
import Link from "next/link";
import { InlinePricePanel } from "@/components/sections/InlinePricePanel";
import type { PriceRow } from "@/lib/price-data";
import { SidebarCampaign } from "@/components/sections/SidebarCampaign";
import { FaqAccordion, type FaqItem } from "@/components/sections/FaqAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RichContent } from "@/components/ui/RichContent";
import type { Treatment } from "@/lib/microcms/types";
import type { Campaign } from "@/types/microcms";

const PROSE_STYLE =
  "prose prose-neutral max-w-none prose-headings:font-light prose-headings:tracking-wide prose-headings:text-[var(--color-brand-dark)] prose-p:text-[var(--color-text-secondary)] prose-p:leading-[1.9] prose-li:text-[var(--color-text-secondary)] prose-strong:text-[var(--color-brand-dark)]";

const TOC = [
  { id: "description", label: "施術説明" },
  { id: "doctor", label: "院長より" },
  { id: "flow", label: "施術の流れ" },
  { id: "risks", label: "リスク・副作用" },
  { id: "downtime", label: "ダウンタイム" },
];

export interface PillarInfo {
  slug: string;         // "mouth"
  label: string;        // "口元"
  caseLabel: string;    // "口元の症例をもっと見る"
  sidebarLabel: string; // "口元のその他の施術"
}

interface Props {
  pillar: PillarInfo;
  treatment: Treatment;
  otherTreatments: Treatment[];
  campaigns?: Campaign[];
  faqs?: FaqItem[];
  priceRows?: PriceRow[];
}

export function TreatmentDetailTemplate({ pillar, treatment, otherTreatments, campaigns = [], faqs = [], priceRows = [] }: Props) {

  return (
    <article>
      {/* ── Hero ── */}
      <section className="relative w-full min-h-[200px] md:min-h-[260px] bg-[var(--color-brand-cream)]">
        <div className="absolute inset-0 flex flex-col justify-end pb-10 md:pb-12">
          <div style={{ paddingLeft: "max(1.5rem, calc((100vw - 1200px) / 2 + 2rem))" }}>
            <nav className="flex items-center gap-2 text-xs text-[var(--color-brand-dark)]/50 mb-4 tracking-wider">
              <Link href="/" className="hover:text-[var(--color-brand-dark)] transition-colors">HOME</Link>
              <span>/</span>
              <Link href={`/${pillar.slug}`} className="hover:text-[var(--color-brand-dark)] transition-colors">{pillar.label}</Link>
              <span>/</span>
              <span className="text-[var(--color-brand-dark)]/80">{treatment.title}</span>
            </nav>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--color-brand-dark)] tracking-wide">
              {treatment.title}
            </h1>
            <p className="text-sm md:text-base text-[var(--color-text-secondary)] mt-3 max-w-2xl leading-relaxed">
              {treatment.catch_copy}
            </p>
          </div>
        </div>
      </section>

      {/* ── 概要バー ── */}
      <section className="bg-white border-b border-[var(--color-brand-brown)]/10">
        <div className="section-container py-6 md:py-8">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <dt className="text-xs text-[var(--color-text-secondary)] tracking-wider mb-1">部位</dt>
              <dd className="font-serif text-base text-[var(--color-brand-dark)]">{pillar.label}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-text-secondary)] tracking-wider mb-1">施術名</dt>
              <dd className="font-serif text-base text-[var(--color-brand-dark)]">{treatment.title}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-text-secondary)] tracking-wider mb-1">ダウンタイム（最短）</dt>
              <dd className="font-serif text-xl text-[var(--color-brand-dark)]">
                {treatment.downtime_min_days}<span className="text-xs ml-1">日</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-text-secondary)] tracking-wider mb-1">ダウンタイム（最長）</dt>
              <dd className="font-serif text-xl text-[var(--color-brand-dark)]">
                {treatment.downtime_max_days}<span className="text-xs ml-1">日</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ── 2カラム：メイン + サイドバー ── */}
      <div className="section-container py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* ── メインコンテンツ ── */}
          <div className="flex-1 min-w-0 space-y-14 md:space-y-20">

            {/* こんな方におすすめ */}
            {treatment.recommended_for && (
              <section id="recommended" className="relative bg-[var(--color-brand-cream)] border border-[var(--color-brand-gold)]/30 p-6 md:p-8 rounded-sm">
                <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[var(--color-brand-gold)]" />
                <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[var(--color-brand-gold)]" />

                <div className="flex items-baseline gap-3 mb-6">
                  <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)]">
                    こんな方におすすめ
                  </h2>
                  <p className="font-en text-xs tracking-[0.2em] text-[var(--color-brand-gold)] font-medium">
                    RECOMMENDED
                  </p>
                </div>
                <div
                  className="recommended-checklist space-y-4 text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: treatment.recommended_for }}
                />
              </section>
            )}

            {/* ビフォーアフター */}
            <section>
              <div className="flex items-baseline gap-3 mb-8">
                <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] border-l-4 border-[var(--color-brand-gold)] pl-4">
                  症例写真
                </h2>
                <p className="font-en text-xs tracking-[0.2em] text-[var(--color-brand-gold)] font-medium">
                  BEFORE &amp; AFTER
                </p>
              </div>
              <div className="bg-[var(--color-brand-cream)] p-6 text-center rounded-sm">
                <p className="text-sm text-[var(--color-text-secondary)] font-light">
                  症例写真は準備中です
                </p>
              </div>
              <div className="mt-6 text-center">
                <Link
                  href={`/${pillar.slug}/case`}
                  className="inline-flex items-center gap-2 text-sm tracking-wider text-[var(--color-brand-gold)] hover:opacity-70 transition-opacity"
                >
                  {pillar.caseLabel}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </section>

            {/* 目次 */}
            <nav className="border border-[var(--color-brand-brown)]/15 p-5 md:p-6">
              <p className="text-xs tracking-[0.2em] text-[var(--color-brand-gold)] mb-3 font-medium">
                CONTENTS
              </p>
              <ol className="space-y-2">
                {TOC.map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="flex items-baseline gap-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors"
                    >
                      <span className="text-xs text-[var(--color-brand-gold)]">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* 施術説明 */}
            <section id="description">
              <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] mb-8 border-l-4 border-[var(--color-brand-gold)] pl-4">
                施術説明
              </h2>
              <RichContent html={treatment.description} className={PROSE_STYLE} />
            </section>

            {/* ドクターコメント */}
            <section id="doctor">
              <div className="flex items-start gap-5">
                <div className="shrink-0 flex flex-col items-center gap-1.5 pt-1">
                  <Image
                    src="/staff/hirose.jpg"
                    alt="院長 廣瀬"
                    width={72}
                    height={72}
                    className="w-[72px] h-[72px] rounded-full object-cover ring-2 ring-[var(--color-brand-gold)]/20"
                  />
                  <p className="text-xs font-medium text-[var(--color-brand-dark)]">廣瀬院長</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-en text-xs tracking-[0.2em] text-[var(--color-brand-gold)] mb-2">
                    DOCTOR&apos;S COMMENT
                  </p>
                  <div className="relative bg-[var(--color-brand-cream)]/60 rounded-lg px-6 py-5">
                    <span className="absolute -left-2 top-5 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-[var(--color-brand-cream)]/60" />
                    <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-[1.9] whitespace-pre-wrap">
                      {treatment.doctor_comment}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 施術の流れ */}
            {treatment.procedure_flow && (
              <section id="flow">
                <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] mb-8 border-l-4 border-[var(--color-brand-gold)] pl-4">
                  施術の流れ
                </h2>
                <div
                  className="procedure-timeline"
                  dangerouslySetInnerHTML={{ __html: treatment.procedure_flow }}
                />
              </section>
            )}

            {/* リスク・副作用 */}
            <section id="risks">
              <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] mb-8 border-l-4 border-[var(--color-brand-gold)] pl-4">
                リスク・副作用
              </h2>
              <RichContent html={treatment.risks} className={PROSE_STYLE} />
            </section>

            {/* ダウンタイム */}
            <section id="downtime">
              <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] mb-8 border-l-4 border-[var(--color-brand-gold)] pl-4">
                ダウンタイム目安
              </h2>
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <div className="bg-[var(--color-brand-cream)] px-6 py-5 rounded-sm text-center">
                  <p className="text-xs text-[var(--color-text-secondary)] tracking-wider mb-2">最短</p>
                  <p className="text-3xl font-serif text-[var(--color-brand-dark)]">
                    {treatment.downtime_min_days}<span className="text-sm ml-1">日</span>
                  </p>
                </div>
                <div className="bg-[var(--color-brand-cream)] px-6 py-5 rounded-sm text-center">
                  <p className="text-xs text-[var(--color-text-secondary)] tracking-wider mb-2">最長</p>
                  <p className="text-3xl font-serif text-[var(--color-brand-dark)]">
                    {treatment.downtime_max_days}<span className="text-sm ml-1">日</span>
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* ── サイドバー ── */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* キャンペーン枠 */}
              <SidebarCampaign campaigns={campaigns} />

              {/* 料金 */}
              <InlinePricePanel title={treatment.title} rows={priceRows} />

              {/* 同ピラーの他の施術 */}
              {otherTreatments.length > 0 && (
                <div className="border border-[var(--color-brand-brown)]/10 rounded-sm">
                  <div className="px-4 py-3 border-b border-[var(--color-brand-brown)]/10">
                    <p className="text-xs tracking-[0.15em] text-[var(--color-brand-dark)] font-medium">
                      {pillar.sidebarLabel}
                    </p>
                  </div>
                  <ul className="divide-y divide-[var(--color-brand-brown)]/5">
                    {otherTreatments.map((t) => (
                      <li key={t.id}>
                        <Link
                          href={`/${pillar.slug}/${t.slug}`}
                          className="block px-4 py-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-cream)]/50 transition-colors"
                        >
                          {t.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

        </div>
      </div>

      {/* ── よくある質問 ── */}
      {faqs.length > 0 && (
        <section
          className="py-16 md:py-24"
          style={{ background: "linear-gradient(160deg, #fdfcfa 0%, #f5ede0 100%)" }}
        >
          <div className="section-container">
            <SectionHeading en="FAQ" ja="よくある質問" className="mb-12" />
            <div className="max-w-3xl">
              <FaqAccordion items={faqs} />
            </div>
          </div>
        </section>
      )}

      {/* ── フルワイド CTA ── */}
      <section className="bg-white border-t border-[var(--color-brand-gold)]/20 py-16 md:py-20">
        <div className="section-container text-center">
          <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-4">
            CONSULTATION
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-3">
            ご予約・ご相談はこちら
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-8">
            院長が丁寧にご相談をお伺いし、あなたに最適なプランをご提案いたします。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://reservation.medical-force.com/c/0600773fd2b74afaba1282effeb9644d"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[var(--color-brand-gold)] text-[var(--color-brand-dark)] px-10 py-4 text-sm tracking-widest font-medium hover:opacity-90 transition-opacity"
            >
              Web予約
            </a>
            <a
              href="https://lin.ee/maisonpureju"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-[var(--color-brand-dark)] text-[var(--color-brand-dark)] px-10 py-4 text-sm tracking-widest hover:bg-[var(--color-brand-dark)] hover:text-white transition-colors"
            >
              LINE予約
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
