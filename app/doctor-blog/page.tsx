import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBlogList } from "@/lib/microcms/client";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { Pagination } from "@/components/ui/Pagination";

export const metadata: Metadata = {
  title: "院長ブログ｜Maison PUREJU 銀座の美容外科・美容皮膚科",
  description:
    "Maison PUREJU院長のブログ。学会発表・施術解説・美容医療の知見など、形成外科専門医の視点からお届けします。",
};

const PER_PAGE = 10;

export default async function DoctorBlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);
  const offset = (currentPage - 1) * PER_PAGE;

  const data = await getBlogList({
    filters: "slug[contains]doctor",
    limit: PER_PAGE,
    offset,
  });
  const posts = data.contents;
  const totalPages = Math.ceil(data.totalCount / PER_PAGE);

  const featured = currentPage === 1 ? posts[0] : null;
  const gridPosts = currentPage === 1 ? posts.slice(1) : posts;

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/doctor-blog${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      {/* ===== Hero ===== */}
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
            <Link href="/" className="hover:text-[var(--color-brand-gold)] transition-colors">HOME</Link>
            <span>/</span>
            <Link href="/doctor" className="hover:text-[var(--color-brand-gold)] transition-colors">院長紹介</Link>
            <span>/</span>
            <span className="text-[var(--color-text-secondary)]">院長ブログ</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">DOCTOR&apos;S BLOG</p>
          <h1 className="font-en text-5xl md:text-6xl tracking-widest text-[var(--color-brand-dark)] mb-4 leading-none">
            院長ブログ
          </h1>
          <p className="text-xs tracking-widest text-[var(--color-text-secondary)]">
            形成外科専門医の視点から、美容医療の知見をお届けします
          </p>
        </div>
      </section>

      {/* ===== コンテンツ ===== */}
      <section className="py-14 md:py-20 bg-[var(--color-brand-white)]">
        <div className="section-container">
          {posts.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-sm text-[var(--color-text-secondary)] font-light tracking-wide">
                現在準備中です。しばらくお待ちください。
              </p>
            </div>
          ) : (
            <>
              {/* フィーチャード記事（1ページ目のみ） */}
              {featured && (
                <Link
                  href={`/doctor-blog/${featured.slug}`}
                  className="group block mb-10 md:mb-14"
                >
                  <div className="md:grid md:grid-cols-[1fr_1fr] gap-0 bg-white border border-[var(--color-brand-brown)]/10 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <div className="relative aspect-square md:aspect-auto md:min-h-[360px] bg-[var(--color-brand-cream)] overflow-hidden">
                      <Image
                        src={featured.thumbnail.url}
                        alt={featured.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                      <div className="absolute top-4 left-4 bg-[var(--color-brand-gold)] text-white text-[0.6rem] tracking-[0.2em] px-2.5 py-1">
                        PICK UP
                      </div>
                    </div>
                    <div className="flex flex-col justify-center px-8 py-10 md:px-12 md:py-12">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-[0.65rem] tracking-[0.2em] text-[var(--color-brand-gold)]">
                          {(Array.isArray(featured.category) ? featured.category : [featured.category]).filter(Boolean).join(" / ")}
                        </span>
                        <time className="text-[0.65rem] text-[var(--color-text-secondary)]/60 tracking-wider">
                          {new Date(featured.published_at).toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }).replace(/\//g, ".")}
                        </time>
                      </div>
                      <h2 className="text-xl md:text-2xl font-light text-[var(--color-brand-dark)] leading-relaxed tracking-wide mb-6 group-hover:text-[var(--color-brand-gold)] transition-colors">
                        {featured.title}
                      </h2>
                      <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-[var(--color-brand-gold)]">
                        READ MORE
                        <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                          <path d="M0 6H18M13 1L18 6L13 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* 記事グリッド */}
              {gridPosts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {gridPosts.map((post) => {
                    const categories = Array.isArray(post.category) ? post.category : [post.category];
                    return (
                      <Link
                        key={post.id}
                        href={`/doctor-blog/${post.slug}`}
                        className="group block bg-white border border-[var(--color-brand-brown)]/10 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                      >
                        <div className="relative aspect-square bg-[var(--color-brand-cream)] overflow-hidden">
                          <Image
                            src={post.thumbnail.url}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <div className="px-5 py-5">
                          <div className="flex items-center gap-2.5 mb-3">
                            <span className="text-[0.6rem] tracking-[0.2em] text-[var(--color-brand-gold)]">
                              {categories.filter(Boolean).join(" / ")}
                            </span>
                            <time className="text-[0.6rem] text-[var(--color-text-secondary)]/50 tracking-wider">
                              {new Date(post.published_at).toLocaleDateString("ja-JP", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }).replace(/\//g, ".")}
                            </time>
                          </div>
                          <p className="text-sm font-light text-[var(--color-brand-dark)] leading-relaxed tracking-wide group-hover:text-[var(--color-brand-gold)] transition-colors line-clamp-2">
                            {post.title}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* ページネーション */}
              <Pagination currentPage={currentPage} totalPages={totalPages} pageHref={pageHref} />
            </>
          )}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <ConsultationCTA />
    </>
  );
}
