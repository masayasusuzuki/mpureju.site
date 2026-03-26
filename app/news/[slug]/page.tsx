import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getNewsBySlug, getNewsList } from "@/lib/microcms/client";

export async function generateStaticParams() {
  const data = await getNewsList();
  return data.contents
    .filter((item) => item.slug)
    .map((item) => ({ slug: item.slug }));
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  const category = Array.isArray(item.category) ? item.category[0] : item.category;

  return (
    <article>
      {/* ── Hero ── */}
      <section className="relative w-full min-h-[200px] md:min-h-[260px] bg-[var(--color-brand-cream)]">
        <div className="absolute inset-0 flex flex-col justify-end pb-10 md:pb-12">
          <div style={{ paddingLeft: "max(1.5rem, calc((100vw - 1200px) / 2 + 2rem))" }}>
            <nav className="flex items-center gap-2 text-xs text-[var(--color-brand-dark)]/50 mb-4 tracking-wider">
              <Link href="/" className="hover:text-[var(--color-brand-dark)] transition-colors">HOME</Link>
              <span>/</span>
              <span className="text-[var(--color-brand-dark)]/80">{category}</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <time className="text-sm text-[var(--color-text-secondary)]">
                {new Date(item.published_at).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }).replace(/\//g, ".")}
              </time>
              <span className="text-xs bg-white/60 text-[var(--color-brand-dark)] px-2 py-0.5 tracking-wider">
                {category}
              </span>
            </div>
            <h1 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] leading-relaxed max-w-3xl">
              {item.title}
            </h1>
          </div>
        </div>
      </section>

      {/* ── 2カラム：メイン + サイドバー ── */}
      <div className="section-container py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* ── メインコンテンツ ── */}
          <div className="flex-1 min-w-0 space-y-10">
            {/* サムネイル */}
            {item.thumbnail && (
              <div className="relative w-full aspect-video">
                <Image
                  src={item.thumbnail.url}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}

            {/* 本文 */}
            {item.description && (
              <div
                className="prose prose-neutral max-w-none prose-headings:font-light prose-headings:tracking-wide prose-headings:text-[var(--color-brand-dark)] prose-p:text-[var(--color-text-secondary)] prose-p:leading-[1.9] prose-li:text-[var(--color-text-secondary)] prose-strong:text-[var(--color-brand-dark)]"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            )}

            {/* 戻るリンク */}
            <div className="pt-8 border-t border-[var(--color-brand-brown)]/10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                トップページに戻る
              </Link>
            </div>
          </div>

          {/* ── サイドバー ── */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* キャンペーン枠 */}
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

              {/* CTA */}
              <div className="space-y-3">
                <a
                  href="https://reservation.medical-force.com/c/0600773fd2b74afaba1282effeb9644d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-[var(--color-brand-gold)] text-[var(--color-brand-dark)] px-6 py-3 text-sm tracking-widest font-medium hover:opacity-90 transition-opacity"
                >
                  Web予約
                </a>
                <a
                  href="https://lin.ee/maisonpureju"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center border border-[var(--color-brand-dark)] text-[var(--color-brand-dark)] px-6 py-3 text-sm tracking-widest hover:bg-[var(--color-brand-dark)] hover:text-white transition-colors"
                >
                  LINE予約
                </a>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </article>
  );
}
