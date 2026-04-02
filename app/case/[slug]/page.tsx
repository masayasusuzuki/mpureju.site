import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCaseBySlug, getCasesByPillar, getCampaigns } from "@/lib/microcms/client";
import { SidebarCampaign } from "@/components/sections/SidebarCampaign";
import { InlinePricePanel } from "@/components/sections/InlinePricePanel";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { findPriceRowsByName } from "@/lib/supabase/queries";

const PROSE_STYLE =
  "prose prose-neutral max-w-none prose-headings:font-light prose-headings:tracking-wide prose-headings:text-[var(--color-brand-dark)] prose-p:text-[var(--color-text-secondary)] prose-p:leading-[1.9] prose-li:text-[var(--color-text-secondary)] prose-strong:text-[var(--color-brand-dark)]";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const caseItem = await getCaseBySlug(slug);
  if (!caseItem) return { title: "症例が見つかりません" };
  return {
    title: `${caseItem.title}｜症例写真｜Maison PUREJU`,
    description: `${caseItem.treatment_label}の症例写真。${caseItem.concern.split(",").slice(0, 3).join("・")}でお悩みの方へ。`,
  };
}

export default async function CaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const caseItem = await getCaseBySlug(slug);
  if (!caseItem) notFound();

  const [relatedData, campaignData, priceRows] = await Promise.all([
    caseItem.pillar[0]
      ? getCasesByPillar(caseItem.pillar[0])
      : Promise.resolve({ contents: [] }),
    getCampaigns(),
    findPriceRowsByName(caseItem.treatment_label),
  ]);

  const relatedCases = relatedData.contents
    .filter((c) => c.id !== caseItem.id)
    .slice(0, 5);

  const concerns = caseItem.concern.split(/[,、，]/).map((s) => s.trim()).filter(Boolean);
  const tags = caseItem.tags?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

  return (
    <article>
      {/* ===== Hero ===== */}
      <section className="relative w-full bg-[var(--color-brand-cream)] pt-24 md:pt-28 pb-10 md:pb-12">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 90% 10%, rgba(201,169,110,0.12) 0%, transparent 55%)" }}
        />
        <div style={{ paddingLeft: "max(1.5rem, calc((100vw - 1200px) / 2 + 2rem))", paddingRight: "max(1.5rem, calc((100vw - 1200px) / 2 + 2rem))" }}>
          <nav className="flex items-center gap-2 text-xs text-[var(--color-brand-dark)]/50 mb-4 tracking-wider">
            <Link href="/" className="hover:text-[var(--color-brand-dark)] transition-colors">HOME</Link>
            <span>/</span>
            <Link href="/case" className="hover:text-[var(--color-brand-dark)] transition-colors">症例一覧</Link>
            <span>/</span>
            <span className="text-[var(--color-brand-dark)]/80 line-clamp-1">{caseItem.title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {caseItem.pillar.map((p) => (
              <span
                key={p}
                className="text-[0.6rem] tracking-[0.2em] text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/40 px-2.5 py-1"
              >
                {p}
              </span>
            ))}
            {caseItem.timing && (
              <span className="text-[0.6rem] tracking-[0.15em] text-[var(--color-text-secondary)] border border-[var(--color-brand-brown)]/20 px-2.5 py-1">
                {caseItem.timing}
              </span>
            )}
          </div>
          <h1 className="text-xl md:text-2xl lg:text-3xl text-[var(--color-brand-dark)] font-light leading-relaxed tracking-wide max-w-3xl">
            {caseItem.title}
          </h1>
        </div>
      </section>

      {/* ===== 2カラム ===== */}
      <div className="section-container py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* ── メイン ── */}
          <div className="flex-1 min-w-0 space-y-10">
            {/* サムネイル画像 */}
            <div className="relative w-full max-w-lg aspect-square bg-[var(--color-brand-cream)] overflow-hidden mx-auto">
              <Image
                src={caseItem.thumbnail.url}
                alt={caseItem.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 640px"
                priority
              />
            </div>

            {/* 追加画像カルーセル */}
            {caseItem.images && caseItem.images.length > 0 && (
              <div>
                <div
                  className="flex overflow-x-auto gap-2.5"
                  style={{
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {caseItem.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative shrink-0 aspect-square overflow-hidden bg-[var(--color-brand-cream)]"
                      style={{ scrollSnapAlign: "start", width: "65%" }}
                    >
                      <Image
                        src={img.url}
                        alt={`${caseItem.title} ${i + 2}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 65vw, 500px"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center gap-2 mt-3">
                  {caseItem.images.map((_, i) => (
                    <span
                      key={i}
                      className="block w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)]/30"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* タグ */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-8 border-b border-[var(--color-brand-brown)]/10">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[var(--color-text-secondary)]/60 border border-current/20 px-2.5 py-1 tracking-wider"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* お悩み */}
            {concerns.length > 0 && (
              <div className="bg-[var(--color-brand-cream)] border-l-2 border-[var(--color-brand-gold)] px-5 py-4">
                <p className="text-[10px] tracking-[0.25em] text-[var(--color-brand-gold)] font-medium mb-3">こんなお悩みの方の症例です</p>
                <ul className="space-y-1.5">
                  {concerns.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-[var(--color-brand-dark)] font-light">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--color-brand-gold)] shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 記事本文 */}
            <MarkdownContent markdown={caseItem.content} className={PROSE_STYLE} />

            {/* リスク・副作用 */}
            <div className="bg-[var(--color-brand-cream)] border border-[var(--color-brand-brown)]/10 p-5 rounded-sm">
              <p className="text-xs tracking-[0.15em] text-[var(--color-brand-gold)] mb-2">リスク・副作用</p>
              <p className="text-xs text-[var(--color-text-secondary)] font-light leading-relaxed">
                {caseItem.risks}
              </p>
            </div>

            {/* Instagram元投稿 */}
            {caseItem.instagram_url && (
              <div className="pt-8 border-t border-[var(--color-brand-brown)]/10">
                <p className="text-xs text-[var(--color-text-secondary)]/50 tracking-wider mb-3">この記事のもとになった投稿</p>
                <a
                  href={caseItem.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors"
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                  Instagramで見る
                </a>
              </div>
            )}

            {/* 戻るリンク */}
            <div className="pt-8 border-t border-[var(--color-brand-brown)]/10">
              <Link
                href="/case"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                症例一覧に戻る
              </Link>
            </div>
          </div>

          {/* ── サイドバー ── */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* キャンペーン */}
              <SidebarCampaign campaigns={campaignData} />

              {/* 料金 */}
              <InlinePricePanel title={caseItem.treatment_label} rows={priceRows} />

              {/* 施術情報 */}
              <div className="border border-[var(--color-brand-brown)]/10 p-5 space-y-4 rounded-sm">
                <p className="text-xs tracking-[0.2em] text-[var(--color-brand-gold)] font-medium">TREATMENT INFO</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)] mb-1">施術名</p>
                    <p className="text-sm text-[var(--color-brand-dark)] font-light">{caseItem.treatment_label}</p>
                  </div>
                  {caseItem.timing && (
                    <div>
                      <p className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)] mb-1">経過</p>
                      <p className="text-sm text-[var(--color-text-secondary)] font-light">{caseItem.timing}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 関連症例 */}
              {relatedCases.length > 0 && (
                <div className="border border-[var(--color-brand-brown)]/10 rounded-sm">
                  <div className="px-4 py-3 border-b border-[var(--color-brand-brown)]/10">
                    <p className="text-xs tracking-[0.15em] text-[var(--color-brand-dark)] font-medium">
                      関連する症例
                    </p>
                  </div>
                  <ul className="divide-y divide-[var(--color-brand-brown)]/5">
                    {relatedCases.map((c) => (
                      <li key={c.id}>
                        <Link
                          href={`/case/${c.slug}`}
                          className="flex gap-3 px-4 py-3 hover:bg-[var(--color-brand-cream)]/50 transition-colors group"
                        >
                          <div className="relative w-14 h-14 shrink-0 bg-[var(--color-brand-cream)] overflow-hidden">
                            <Image
                              src={c.thumbnail.url}
                              alt={c.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="56px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[0.6rem] text-[var(--color-brand-gold)] tracking-wider mb-1">
                              {c.treatment_label}
                            </p>
                            <p className="text-xs text-[var(--color-brand-dark)] leading-relaxed line-clamp-2 group-hover:text-[var(--color-brand-gold)] transition-colors">
                              {c.title}
                            </p>
                          </div>
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

      {/* ===== CTA bottom ===== */}
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
