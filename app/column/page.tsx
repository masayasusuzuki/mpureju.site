import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getColumnList } from "@/lib/microcms/client";

export const metadata: Metadata = {
  title: "美容コラム｜Maison PUREJU 銀座の美容外科・美容皮膚科",
  description:
    "Maison PUREJUの美容コラム。スキンケア、美容アイテム、施術ガイドなど、銀座の美容外科・美容皮膚科が発信する美容情報をお届けします。",
};

const CATEGORIES = [
  "すべて",
  "施術ガイド",
  "肌悩み・ケア",
  "美容アイテム",
  "美容知識",
  "ライフスタイル",
] as const;

const PER_PAGE = 9;

export default async function ColumnPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { page, category } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const currentCategory = category || "すべて";

  const queries =
    currentCategory !== "すべて"
      ? { filters: `category[contains]${currentCategory}`, limit: 100 }
      : { limit: 100 };

  const data = await getColumnList(queries);
  const allColumns = data.contents;
  const totalPages = Math.ceil(allColumns.length / PER_PAGE);
  const columns = allColumns.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const featured = currentPage === 1 ? columns[0] : null;
  const rest = currentPage === 1 ? columns.slice(1) : columns;

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (currentCategory !== "all") params.set("category", currentCategory);
    if (p > 1) params.set("page", String(p));
    const q = params.toString();
    return `/column${q ? `?${q}` : ""}`;
  }

  function categoryHref(cat: string) {
    return cat === "すべて" ? "/column" : `/column?category=${encodeURIComponent(cat)}`;
  }

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
            <span className="text-[var(--color-text-secondary)]">美容コラム</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">BEAUTY COLUMN</p>
          <h1 className="font-en text-5xl md:text-6xl tracking-widest text-[var(--color-brand-dark)] mb-4 leading-none">
            美容コラム
          </h1>
          <p className="text-xs tracking-widest text-[var(--color-text-secondary)]">
            銀座の美容クリニックがお届けする、美容と健康の読みもの
          </p>
        </div>
      </section>

      {/* ===== カテゴリタブ ===== */}
      <div className="sticky top-16 md:top-20 z-30 bg-[var(--color-brand-white)] border-b border-[var(--color-brand-cream)]">
        <div className="section-container">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={categoryHref(cat)}
                scroll={false}
                className={`shrink-0 px-4 py-1.5 text-xs tracking-wider rounded-full transition-colors whitespace-nowrap ${
                  currentCategory === cat
                    ? "bg-[var(--color-brand-dark)] text-white"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-brand-dark)]"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ===== コンテンツ ===== */}
      <section className="py-14 md:py-20 bg-[var(--color-brand-white)]">
        <div className="section-container">
          {columns.length === 0 ? (
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
                  href={`/column/${featured.slug}`}
                  className="group block mb-10 md:mb-14"
                >
                  <div className="md:grid md:grid-cols-[1fr_1fr] gap-0 bg-white border border-[var(--color-brand-brown)]/10 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    {/* サムネイル */}
                    <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px] bg-[var(--color-brand-cream)] overflow-hidden">
                      {featured.thumbnail ? (
                        <Image
                          src={featured.thumbnail.url}
                          alt={featured.title}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)]/40">PHOTO</span>
                        </div>
                      )}
                      {/* NEW バッジ */}
                      <div className="absolute top-4 left-4 bg-[var(--color-brand-gold)] text-white text-[0.6rem] tracking-[0.2em] px-2.5 py-1">
                        PICK UP
                      </div>
                    </div>
                    {/* テキスト */}
                    <div className="flex flex-col justify-center px-8 py-10 md:px-12 md:py-12">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-[0.65rem] tracking-[0.2em] text-[var(--color-brand-gold)]">
                          {featured.category.join(" / ")}
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
                      {featured.tags && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {featured.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                            <span
                              key={tag}
                              className="text-[0.6rem] tracking-wider text-[var(--color-text-secondary)]/60 border border-current/20 px-2 py-0.5"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
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
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {rest.map((col) => (
                    <Link
                      key={col.id}
                      href={`/column/${col.slug}`}
                      className="group block bg-white border border-[var(--color-brand-brown)]/10 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                    >
                      {/* サムネイル */}
                      <div className="relative aspect-square bg-[var(--color-brand-cream)] overflow-hidden">
                        {col.thumbnail ? (
                          <Image
                            src={col.thumbnail.url}
                            alt={col.title}
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-en text-[0.6rem] tracking-[0.3em] text-[var(--color-brand-gold)]/30">PHOTO</span>
                          </div>
                        )}
                      </div>
                      {/* テキスト */}
                      <div className="px-5 py-5">
                        <div className="flex items-center gap-2.5 mb-3">
                          <span className="text-[0.6rem] tracking-[0.2em] text-[var(--color-brand-gold)]">
                            {col.category.join(" / ")}
                          </span>
                          <time className="text-[0.6rem] text-[var(--color-text-secondary)]/50 tracking-wider">
                            {new Date(col.published_at).toLocaleDateString("ja-JP", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }).replace(/\//g, ".")}
                          </time>
                        </div>
                        <p className="text-sm font-light text-[var(--color-brand-dark)] leading-relaxed tracking-wide group-hover:text-[var(--color-brand-gold)] transition-colors line-clamp-2">
                          {col.title}
                        </p>
                        {col.tags && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {col.tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[0.55rem] tracking-wider text-[var(--color-text-secondary)]/50 border border-current/20 px-1.5 py-0.5"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* ページネーション */}
              {totalPages > 1 && (
                <nav className="flex items-center justify-center gap-2 mt-14">
                  {currentPage > 1 && (
                    <Link
                      href={pageHref(currentPage - 1)}
                      className="flex items-center justify-center w-10 h-10 border border-[var(--color-brand-brown)]/15 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)] transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={pageHref(p)}
                      className={`flex items-center justify-center w-10 h-10 text-sm font-en tracking-wider transition-colors ${
                        p === currentPage
                          ? "bg-[var(--color-brand-gold)] text-white"
                          : "border border-[var(--color-brand-brown)]/15 text-[var(--color-text-secondary)] hover:border-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)]"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {currentPage < totalPages && (
                    <Link
                      href={pageHref(currentPage + 1)}
                      className="flex items-center justify-center w-10 h-10 border border-[var(--color-brand-brown)]/15 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)] transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  )}
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 md:py-20 border-t border-[var(--color-brand-gold)]/20 bg-white">
        <div className="section-container">
          <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-4">CONSULTATION</p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-3 leading-relaxed">
            気になることはカウンセリングへ
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-10 leading-relaxed font-light">
            記事に関するご質問や施術についてのご相談は、<br className="hidden md:block" />
            無料カウンセリングにてお気軽にどうぞ。
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
            <a
              href="https://reservation.medical-force.com/c/0600773fd2b74afaba1282effeb9644d"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[var(--color-brand-gold)] text-[var(--color-brand-dark)] px-10 py-4 text-sm tracking-widest font-medium hover:opacity-90 transition-opacity"
            >
              無料カウンセリング予約
            </a>
            <a
              href="https://lin.ee/maisonpureju"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-[var(--color-brand-dark)] text-[var(--color-brand-dark)] px-10 py-4 text-sm tracking-widest hover:bg-[var(--color-brand-dark)] hover:text-white transition-colors"
            >
              LINE相談
            </a>
          </div>
          <Link
            href="/contact"
            className="text-xs tracking-wider text-[var(--color-text-secondary)] underline underline-offset-4 hover:text-[var(--color-brand-gold)] transition-colors"
          >
            メールでのお問い合わせはこちら
          </Link>
        </div>
      </section>
    </>
  );
}
