import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getColumnBySlug, getColumnList, getCampaigns } from "@/lib/microcms/client";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { SidebarCampaign } from "@/components/sections/SidebarCampaign";

const PROSE_STYLE =
  "prose prose-neutral max-w-none prose-headings:font-light prose-headings:tracking-wide prose-headings:text-[var(--color-brand-dark)] prose-p:text-[var(--color-text-secondary)] prose-p:leading-[1.9] prose-li:text-[var(--color-text-secondary)] prose-strong:text-[var(--color-brand-dark)]";

export async function generateStaticParams() {
  const data = await getColumnList({ limit: 100 });
  return data.contents
    .filter((c) => c.slug)
    .map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const col = await getColumnBySlug(slug);
  if (!col) return {};
  return {
    title: `${col.title}｜美容コラム｜Maison PUREJU`,
    description: `${col.category.join("・")}に関するコラム。Maison PUREJU（銀座）の美容コラムです。`,
  };
}

export default async function ColumnDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [col, allData, campaignData] = await Promise.all([
    getColumnBySlug(slug),
    getColumnList({ limit: 100 }),
    getCampaigns(),
  ]);
  if (!col) notFound();

  const formattedDate = new Date(col.published_at).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\//g, ".");

  const tocItems = [...col.content.matchAll(/^##\s+(.+)$/gm)].map(
    (m, i) => ({ id: `toc-${i}`, text: m[1].trim() })
  );

  const related = allData.contents
    .filter(
      (c) =>
        c.slug !== slug &&
        c.category.some((cat) => col.category.includes(cat))
    )
    .slice(0, 4);

  const latestColumns = allData.contents
    .filter((c) => c.slug !== slug)
    .slice(0, 5);

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
              <Link href="/column" className="hover:text-[var(--color-brand-dark)] transition-colors">美容コラム</Link>
              <span>/</span>
              <span className="text-[var(--color-brand-dark)]/80 line-clamp-1">{col.title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {col.category.map((cat) => (
              <Link
                key={cat}
                href={`/column?category=${encodeURIComponent(cat)}`}
                className="text-[0.6rem] tracking-[0.2em] text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/40 px-2.5 py-1 hover:bg-[var(--color-brand-gold)]/10 transition-colors"
              >
                {cat}
              </Link>
            ))}
            <time className="text-[0.65rem] text-[var(--color-text-secondary)]/50 tracking-wider ml-1">
              {formattedDate}
            </time>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[var(--color-brand-dark)] tracking-wide leading-relaxed max-w-3xl">
            {col.title}
          </h1>
        </div>
      </section>

      {/* ===== 2カラム ===== */}
      <div className="section-container py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* ── メイン ── */}
          <div className="flex-1 min-w-0">

            {/* サムネイル */}
            {col.thumbnail && (
              <div className="relative w-full aspect-[16/9] overflow-hidden mb-10 bg-[var(--color-brand-cream)]">
                <Image
                  src={col.thumbnail.url}
                  alt={col.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  priority
                />
              </div>
            )}

            {/* タグ */}
            {col.tags && (
              <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-[var(--color-brand-brown)]/10">
                {col.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[var(--color-text-secondary)]/60 border border-current/20 px-2.5 py-1 tracking-wider"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 記事画像カルーセル */}
            {col.images && col.images.length > 0 && (
              <div className="mb-10">
                <div
                  className="flex overflow-x-auto gap-2.5"
                  style={{
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {col.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative shrink-0 aspect-square overflow-hidden bg-[var(--color-brand-cream)]"
                      style={{ scrollSnapAlign: "start", width: "65%" }}
                    >
                      <Image
                        src={img.url}
                        alt={`${col.title} 画像${i + 2}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 65vw, 500px"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center gap-2 mt-3">
                  {col.images.map((_, i) => (
                    <span
                      key={i}
                      className="block w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)]/30"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 目次 */}
            {tocItems.length > 0 && (
              <nav className="border border-[var(--color-brand-brown)]/15 p-5 md:p-6 mb-10">
                <p className="text-xs tracking-[0.2em] text-[var(--color-brand-gold)] mb-3 font-medium">
                  CONTENTS
                </p>
                <ol className="space-y-2">
                  {tocItems.map((item, i) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="flex items-baseline gap-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors"
                      >
                        <span className="text-xs text-[var(--color-brand-gold)] shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* 本文 */}
            <MarkdownContent markdown={col.content} className={PROSE_STYLE} />

            {/* 元リールリンク */}
            {col.instagram_url && (
              <div className="mt-12 pt-8 border-t border-[var(--color-brand-brown)]/10">
                <p className="text-xs text-[var(--color-text-secondary)]/50 tracking-wider mb-3">この記事のもとになった投稿</p>
                <a
                  href={col.instagram_url}
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
            <div className="mt-12 pt-8 border-t border-[var(--color-brand-brown)]/10">
              <Link
                href="/column"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                美容コラム一覧に戻る
              </Link>
            </div>
          </div>

          {/* ── サイドバー ── */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* キャンペーン */}
              <SidebarCampaign campaigns={campaignData} />

              {/* 最新コラム */}
              {latestColumns.length > 0 && (
                <div className="border border-[var(--color-brand-brown)]/10 rounded-sm">
                  <div className="px-4 py-3 border-b border-[var(--color-brand-brown)]/10">
                    <p className="text-xs tracking-[0.15em] text-[var(--color-brand-dark)] font-medium">
                      最新コラム
                    </p>
                  </div>
                  <ul className="divide-y divide-[var(--color-brand-brown)]/5">
                    {latestColumns.map((c) => (
                      <li key={c.id}>
                        <Link
                          href={`/column/${c.slug}`}
                          className="flex gap-3 px-4 py-3 hover:bg-[var(--color-brand-cream)]/50 transition-colors group"
                        >
                          <div className="relative w-14 h-14 shrink-0 bg-[var(--color-brand-cream)] overflow-hidden">
                            {c.thumbnail ? (
                              <Image
                                src={c.thumbnail.url}
                                alt={c.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="56px"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[0.5rem] text-[var(--color-brand-gold)]/30">PHOTO</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[0.6rem] text-[var(--color-brand-gold)] tracking-wider mb-1">
                              {c.category[0]}
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

              {/* 関連記事 */}
              {related.length > 0 && (
                <div className="border border-[var(--color-brand-brown)]/10 rounded-sm">
                  <div className="px-4 py-3 border-b border-[var(--color-brand-brown)]/10">
                    <p className="text-xs tracking-[0.15em] text-[var(--color-brand-dark)] font-medium">
                      関連コラム
                    </p>
                  </div>
                  <ul className="divide-y divide-[var(--color-brand-brown)]/5">
                    {related.map((r) => (
                      <li key={r.id}>
                        <Link
                          href={`/column/${r.slug}`}
                          className="flex gap-3 px-4 py-3 hover:bg-[var(--color-brand-cream)]/50 transition-colors group"
                        >
                          <div className="relative w-14 h-14 shrink-0 bg-[var(--color-brand-cream)] overflow-hidden">
                            {r.thumbnail ? (
                              <Image
                                src={r.thumbnail.url}
                                alt={r.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="56px"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[0.5rem] text-[var(--color-brand-gold)]/30">PHOTO</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[0.6rem] text-[var(--color-brand-gold)] tracking-wider mb-1">
                              {r.category[0]}
                            </p>
                            <p className="text-xs text-[var(--color-brand-dark)] leading-relaxed line-clamp-2 group-hover:text-[var(--color-brand-gold)] transition-colors">
                              {r.title}
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
          <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-4">CONSULTATION</p>
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
