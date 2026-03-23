import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getStaffBlogList } from "@/lib/microcms/client";
import { ScrollFadeIn } from "@/components/ui/ScrollFadeIn";

export const metadata: Metadata = {
  title: "スタッフブログ",
  description:
    "Maison PUREJU（銀座）のスタッフブログ。スタッフの日常やクリニックの雰囲気をお届けします。",
};

export default async function StaffBlogListPage() {
  const data = await getStaffBlogList({ limit: 50 });
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
            <Link href="/recruit" className="hover:text-[var(--color-brand-gold)] transition-colors">
              採用情報
            </Link>
            <span>/</span>
            <span className="text-[var(--color-text-secondary)]">スタッフブログ</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            STAFF BLOG
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-widest text-[var(--color-brand-dark)] mb-4 leading-tight">
            スタッフブログ
          </h1>
          <p className="text-sm md:text-base tracking-wide text-[var(--color-text-secondary)] leading-relaxed">
            スタッフの日常をのぞいてみませんか？
          </p>
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
                    href={`/recruit/staff-blog/${featured.slug}`}
                    className="group flex flex-col md:flex-row gap-0 bg-[var(--color-brand-cream)] overflow-hidden"
                  >
                    <div className="relative w-full md:w-3/5 aspect-[3/2] md:aspect-auto md:min-h-[360px] overflow-hidden">
                      <Image
                        src={featured.thumbnail.url}
                        alt={featured.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 60vw"
                        priority
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center px-6 py-8 md:px-10 md:py-10">
                      <p className="font-en text-[10px] tracking-[0.3em] text-[var(--color-brand-gold)] mb-3">
                        LATEST
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        {(Array.isArray(featured.category) ? featured.category[0] : featured.category) && (
                          <span className="text-[10px] bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] px-2 py-0.5 tracking-wider">
                            {Array.isArray(featured.category) ? featured.category[0] : featured.category}
                          </span>
                        )}
                        <time className="text-[10px] text-[var(--color-text-secondary)]/50 tracking-wider">
                          {new Date(featured.published_at).toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {rest.map((post, i) => {
                    const category = Array.isArray(post.category)
                      ? post.category[0]
                      : post.category;
                    const dateStr = new Date(post.published_at).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                    return (
                      <ScrollFadeIn key={post.id} delay={i * 0.05}>
                        <Link
                          href={`/recruit/staff-blog/${post.slug}`}
                          className="block bg-white overflow-hidden h-full group"
                        >
                          <div className="aspect-video relative overflow-hidden">
                            <Image
                              src={post.thumbnail.url}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>
                          <div className="px-5 py-4">
                            <div className="flex items-center gap-2 mb-2">
                              {category && (
                                <span className="text-[10px] bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] px-2 py-0.5 tracking-wider">
                                  {category}
                                </span>
                              )}
                              <time className="text-[10px] text-[var(--color-text-secondary)]/50 tracking-wider">
                                {dateStr}
                              </time>
                            </div>
                            <p className="font-serif text-sm text-[var(--color-brand-dark)] leading-relaxed line-clamp-2 group-hover:text-[var(--color-brand-gold)] transition-colors">
                              {post.title}
                            </p>
                          </div>
                        </Link>
                      </ScrollFadeIn>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="py-16 md:py-24 bg-white">
          <div className="section-container">
            <p className="text-center text-sm text-[var(--color-text-secondary)]">
              記事はまだありません。
            </p>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="section-container text-center">
          <p
            className="font-en text-6xl md:text-7xl leading-none text-[var(--color-brand-gold)] select-none mb-4"
            style={{ opacity: 0.12 }}
            aria-hidden="true"
          >
            Join Us
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-4 leading-relaxed tracking-wide">
            一緒に働きませんか？
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-10 leading-relaxed font-light">
            美容医療に情熱を持ち、ともに成長していける仲間をお待ちしています。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/recruit/entry"
              className="inline-flex items-center justify-center gap-4 min-w-[240px] py-4 bg-[var(--color-brand-dark)] text-white text-sm tracking-widest rounded-full hover:opacity-90 transition-opacity"
            >
              エントリーはこちら
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/recruit"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              採用情報に戻る
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
