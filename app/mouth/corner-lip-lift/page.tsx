import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTreatmentBySlug } from "@/lib/microcms/client";
import { findPriceRowsByTitle } from "@/lib/price-data";
import { InlinePricePanel } from "@/components/sections/InlinePricePanel";

const PROSE_STYLE =
  "prose prose-neutral max-w-none prose-headings:font-serif prose-headings:text-[var(--color-brand-dark)] prose-p:text-[var(--color-text-secondary)] prose-p:leading-[1.9] prose-li:text-[var(--color-text-secondary)] prose-strong:text-[var(--color-brand-dark)]";

const TOC = [
  { id: "description", label: "施術説明" },
  { id: "flow", label: "施術の流れ" },
  { id: "doctor", label: "ドクターコメント" },
  { id: "risks", label: "リスク・副作用" },
  { id: "downtime", label: "ダウンタイム" },
];

export default async function LipLiftPage() {
  const treatment = await getTreatmentBySlug("corner-lip-lift");
  if (!treatment) notFound();

  const priceRows = findPriceRowsByTitle(treatment.title);

  return (
    <article>
      {/* ── Hero ── */}
      <section className="relative w-full min-h-[200px] md:min-h-[260px] bg-[var(--color-brand-cream)]">
        <div className="absolute inset-0 flex flex-col justify-end pb-10 md:pb-12">
          <div style={{ paddingLeft: "max(1.5rem, calc((100vw - 1200px) / 2 + 2rem))" }}>
            <nav className="flex items-center gap-2 text-xs text-[var(--color-brand-dark)]/50 mb-4 tracking-wider">
              <Link href="/" className="hover:text-[var(--color-brand-dark)] transition-colors">HOME</Link>
              <span>/</span>
              <Link href="/mouth" className="hover:text-[var(--color-brand-dark)] transition-colors">口元</Link>
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
              <dd className="font-serif text-base text-[var(--color-brand-dark)]">{treatment.pillar}</dd>
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
                {/* 左上 L字装飾 */}
                <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[var(--color-brand-gold)]" />
                {/* 右下 L字装飾 */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 3, treatment: "口角挙上", concern: "口角の下垂", age: "40代" },
                  { id: 8, treatment: "口角挙上", concern: "口角が下がって見える", age: "30代" },
                ].map((c) => (
                  <div key={c.id} className="bg-white border border-[var(--color-brand-brown)]/10 overflow-hidden">
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
                        href="/mouth/case"
                        className="block text-center text-[11px] tracking-[0.18em] border border-[var(--color-brand-dark)] py-2.5 text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white transition-colors"
                      >
                        この症例を詳しく見る
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/mouth/case"
                  className="inline-flex items-center gap-2 text-sm tracking-wider text-[var(--color-brand-gold)] hover:opacity-70 transition-opacity"
                >
                  口元の症例をもっと見る
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
              <div
                className={PROSE_STYLE}
                dangerouslySetInnerHTML={{ __html: treatment.description }}
              />
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

            {/* ドクターコメント */}
            <section id="doctor" className="bg-[var(--color-brand-cream)] p-6 md:p-10 rounded-sm">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="shrink-0 md:w-[180px]">
                  <Image
                    src="/staff/hirose.jpg"
                    alt="院長 廣瀬"
                    width={180}
                    height={240}
                    className="w-full md:w-[180px] max-w-[220px] aspect-[3/4] object-cover rounded-sm"
                  />
                  <p className="text-xs text-center text-[var(--color-text-secondary)] mt-2 tracking-wider">
                    院長 廣瀬
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-8 bg-[var(--color-brand-gold)] rounded-full" />
                    <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)]">
                      ドクターコメント
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-[1.9] whitespace-pre-wrap">
                    {treatment.doctor_comment}
                  </p>
                </div>
              </div>
            </section>

            {/* リスク・副作用 */}
            <section id="risks">
              <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] mb-8 border-l-4 border-[var(--color-brand-gold)] pl-4">
                リスク・副作用
              </h2>
              <div
                className={PROSE_STYLE}
                dangerouslySetInnerHTML={{ __html: treatment.risks }}
              />
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

              {/* キャンペーン枠（データ未接続） */}
              <div className="border border-[var(--color-brand-gold)]/30 rounded-sm overflow-hidden">
                <div className="bg-[var(--color-brand-gold)]/10 px-4 py-3">
                  <p className="text-xs tracking-[0.15em] text-[var(--color-brand-gold)] font-medium">
                    CAMPAIGN
                  </p>
                </div>
                <div className="p-4">
                  <div className="aspect-video bg-[var(--color-brand-cream)] flex items-center justify-center mb-4 rounded-sm">
                    <span className="text-xs text-[var(--color-text-secondary)]/40 tracking-widest">
                      COMING SOON
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    キャンペーン情報は準備中です
                  </p>
                </div>
              </div>

              {/* 料金を確認（インライン展開） */}
              <InlinePricePanel title={treatment.title} rows={priceRows} />


              {/* 口元の他の施術 */}
              <div className="border border-[var(--color-brand-brown)]/10 rounded-sm">
                <div className="px-4 py-3 border-b border-[var(--color-brand-brown)]/10">
                  <p className="text-xs tracking-[0.15em] text-[var(--color-brand-dark)] font-medium">
                    口元のその他の施術
                  </p>
                </div>
                <ul className="divide-y divide-[var(--color-brand-brown)]/5">
                  {[
                    { name: "M字リップ", slug: "m-lip" },
                    { name: "人中短縮", slug: "philtrum-shortening" },
                    { name: "口唇縮小", slug: "lip-reduction" },
                    { name: "ガミースマイル手術", slug: "gummy-smile" },
                  ].map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/mouth/${t.slug}`}
                        className="block px-4 py-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-cream)]/50 transition-colors"
                      >
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

        </div>
      </div>

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
              href="https://mpureju.com/reservation"
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
