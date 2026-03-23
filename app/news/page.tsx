import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getNewsList } from "@/lib/microcms/client";
import { ScrollFadeIn } from "@/components/ui/ScrollFadeIn";

export const metadata: Metadata = {
  title: "お知らせ｜Maison PUREJU 銀座の美容外科・美容皮膚科",
  description:
    "Maison PUREJU（銀座）からのお知らせ。クリニックの最新情報・キャンペーン・休診情報などをお届けします。",
};

export default async function NewsListPage() {
  const data = await getNewsList({ limit: 50 });
  const posts = data.contents;
  const [featured, ...rest] = posts;

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
            <span className="text-[var(--color-text-secondary)]">お知らせ</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            NEWS
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-widest text-[var(--color-brand-dark)] leading-tight">
            お知らせ
          </h1>
        </div>
      </section>

      {posts.length > 0 ? (
        <>
          {/* ── 最新記事ピックアップ ── */}
          {featured && (
            <section className="py-16 md:py-24 bg-white">
              <div className="section-container">
                <ScrollFadeIn>
                  <Link
                    href={`/news/${featured.slug}`}
                    className="group flex flex-col md:flex-row gap-0 bg-[var(--color-brand-cream)] overflow-hidden"
                  >
                    {featured.thumbnail ? (
                      <div className="relative w-full md:w-3/5 aspect-[3/2] md:aspect-auto md:min-h-[320px] overflow-hidden">
                        <Image
                          src={featured.thumbnail.url}
                          alt={featured.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 60vw"
                          priority
                        />
                      </div>
                    ) : (
                      <div className="w-full md:w-3/5 aspect-[3/2] md:aspect-auto md:min-h-[320px] bg-[var(--color-brand-cream)] flex items-center justify-center">
                        <span className="font-en text-6xl text-[var(--color-brand-dark)]/5 select-none">NEWS</span>
                      </div>
                    )}
                    <div className="flex-1 flex flex-col justify-center px-6 py-8 md:px-10 md:py-10">
                      <p className="font-en text-[10px] tracking-[0.3em] text-[var(--color-brand-gold)] mb-3">
                        LATEST
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <NewsCategory category={featured.category} />
                        <time className="text-[10px] text-[var(--color-text-secondary)]/50 tracking-wider">
                          {formatDate(featured.published_at)}
                        </time>
                      </div>
                      <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] leading-relaxed tracking-wide mb-4 group-hover:text-[var(--color-brand-gold)] transition-colors">
                        {featured.title}
                      </h2>
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--color-brand-gold)] tracking-wider mt-auto">
                        READ MORE
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </Link>
                </ScrollFadeIn>
              </div>
            </section>
          )}

          {/* ── 記事一覧 ── */}
          {rest.length > 0 && (
            <section className="py-16 md:py-24 bg-[var(--color-brand-cream)]">
              <div className="section-container">
                <div className="max-w-3xl space-y-0">
                  {rest.map((post, i) => (
                    <ScrollFadeIn key={post.id} delay={i * 0.03}>
                      <Link
                        href={`/news/${post.slug}`}
                        className="group flex items-start gap-5 py-6 border-b border-[var(--color-brand-brown)]/10"
                      >
                        {/* サムネイル */}
                        {post.thumbnail ? (
                          <div className="relative w-24 md:w-32 aspect-[4/3] shrink-0 overflow-hidden bg-white">
                            <Image
                              src={post.thumbnail.url}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="128px"
                            />
                          </div>
                        ) : (
                          <div className="w-24 md:w-32 aspect-[4/3] shrink-0 bg-white flex items-center justify-center">
                            <span className="font-en text-xs text-[var(--color-brand-dark)]/10 select-none">NEWS</span>
                          </div>
                        )}
                        {/* テキスト */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <NewsCategory category={post.category} />
                            <time className="text-[10px] text-[var(--color-text-secondary)]/50 tracking-wider">
                              {formatDate(post.published_at)}
                            </time>
                          </div>
                          <p className="font-serif text-sm md:text-base text-[var(--color-brand-dark)] leading-relaxed line-clamp-2 group-hover:text-[var(--color-brand-gold)] transition-colors">
                            {post.title}
                          </p>
                        </div>
                      </Link>
                    </ScrollFadeIn>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="py-16 md:py-24 bg-white">
          <div className="section-container">
            <p className="text-center text-sm text-[var(--color-text-secondary)]">
              お知らせはまだありません。
            </p>
          </div>
        </section>
      )}
    </>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function NewsCategory({ category }: { category: string[] | string }) {
  const label = Array.isArray(category) ? category[0] : category;
  if (!label) return null;
  return (
    <span className="text-[10px] bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] px-2 py-0.5 tracking-wider">
      {label}
    </span>
  );
}
