import Image from "next/image";
import Link from "next/link";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { SidebarCampaign } from "@/components/sections/SidebarCampaign";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import type { MicroCMSImage, Campaign } from "@/types/microcms";
import type { ReactNode } from "react";

const PROSE_STYLE =
  "prose prose-neutral max-w-none prose-headings:font-light prose-headings:tracking-wide prose-headings:text-[var(--color-brand-dark)] prose-p:text-[var(--color-text-secondary)] prose-p:leading-[1.9] prose-li:text-[var(--color-text-secondary)] prose-strong:text-[var(--color-brand-dark)]";

// ── 型定義 ──

interface Breadcrumb {
  label: string;
  href: string;
}

interface Badge {
  label: string;
  href?: string; // あればリンク付きバッジ
}

interface ArticleDetailLayoutProps {
  // Hero
  breadcrumbs: Breadcrumb[];
  badges: Badge[];
  date: string;
  title: string;
  /** 著者名（任意） */
  author?: string;

  // メインコンテンツ
  thumbnail?: MicroCMSImage;
  /** サムネイルの表示設定 */
  thumbnailConfig?: {
    aspectRatio?: "square" | "video" | "4/3";
    fit?: "cover" | "contain";
    maxWidth?: string; // e.g. "max-w-md", "max-w-lg"
  };
  /** サムネ以外の画像（カルーセル表示） */
  images?: MicroCMSImage[];
  /** カンマ区切りタグ */
  tags?: string;
  /** 本文の前に差し込むコンテンツ（例: caseの「お悩み」ボックス） */
  extraBefore?: ReactNode;
  /** Markdown本文 */
  body: string;
  /** TOC表示するか（デフォルト: true、h2が無ければ自動非表示） */
  toc?: boolean;
  /** 本文の後に差し込むコンテンツ（例: caseの「リスク・副作用」） */
  extraAfter?: ReactNode;
  /** Instagram元投稿URL */
  instagramUrl?: string;

  // サイドバー
  campaigns: Campaign[];
  /** サイドバーのキャンペーン下に差し込むウィジェット */
  sidebarExtra?: ReactNode;

  // フッター
  backLink: { href: string; label: string };
}

export function ArticleDetailLayout({
  breadcrumbs,
  badges,
  date,
  title,
  author,
  thumbnail,
  thumbnailConfig,
  images,
  tags,
  extraBefore,
  body,
  toc = true,
  extraAfter,
  instagramUrl,
  campaigns,
  sidebarExtra,
  backLink,
}: ArticleDetailLayoutProps) {
  const formattedDate = new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\//g, ".");

  const tocItems = toc
    ? [...body.matchAll(/^##\s+(.+)$/gm)].map((m, i) => ({ id: `toc-${i}`, text: m[1].trim() }))
    : [];

  const aspect = thumbnailConfig?.aspectRatio ?? "square";
  const fit = thumbnailConfig?.fit ?? "cover";
  const maxW = thumbnailConfig?.maxWidth ?? "max-w-md";
  const aspectClass = aspect === "square" ? "aspect-square" : aspect === "video" ? "aspect-video" : "aspect-[4/3]";

  return (
    <article>
      {/* ===== Hero ===== */}
      <section className="relative w-full bg-[var(--color-brand-cream)] pt-24 md:pt-28 pb-10 md:pb-12">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 90% 10%, rgba(201,169,110,0.12) 0%, transparent 55%)" }}
        />
        <div style={{ paddingLeft: "max(1.5rem, calc((100vw - 1200px) / 2 + 2rem))", paddingRight: "max(1.5rem, calc((100vw - 1200px) / 2 + 2rem))" }}>
          <nav className="flex items-center gap-2 text-xs text-[var(--color-brand-dark)]/50 mb-4 tracking-wider">
            <Link href="/" className="hover:text-[var(--color-brand-dark)] transition-colors">HOME</Link>
            {breadcrumbs.map((bc) => (
              <span key={bc.href} className="contents">
                <span>/</span>
                <Link href={bc.href} className="hover:text-[var(--color-brand-dark)] transition-colors">{bc.label}</Link>
              </span>
            ))}
            <span>/</span>
            <span className="text-[var(--color-brand-dark)]/80 line-clamp-1">{title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {badges.map((badge) =>
              badge.href ? (
                <Link
                  key={badge.label}
                  href={badge.href}
                  className="text-[0.6rem] tracking-[0.2em] text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/40 px-2.5 py-1 hover:bg-[var(--color-brand-gold)]/10 transition-colors"
                >
                  {badge.label}
                </Link>
              ) : (
                <span
                  key={badge.label}
                  className="text-[0.6rem] tracking-[0.2em] text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/40 px-2.5 py-1"
                >
                  {badge.label}
                </span>
              )
            )}
            <time className="text-[0.65rem] text-[var(--color-text-secondary)]/50 tracking-wider ml-1">
              {formattedDate}
            </time>
            {author && (
              <span className="text-[0.65rem] text-[var(--color-text-secondary)]/50 tracking-wider ml-1">
                ｜ {author}
              </span>
            )}
          </div>
          <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[var(--color-brand-dark)] tracking-wide leading-relaxed max-w-3xl">
            {title}
          </h1>
        </div>
      </section>

      {/* ===== 2カラム ===== */}
      <div className="section-container py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* ── メイン ── */}
          <div className="flex-1 min-w-0">

            {/* サムネイル */}
            {thumbnail && (
              <div className={`relative w-full ${aspectClass} ${maxW} overflow-hidden mb-10 bg-[var(--color-brand-cream)]`}>
                <Image
                  src={thumbnail.url}
                  alt={title}
                  fill
                  className={fit === "contain" ? "object-contain" : "object-cover"}
                  sizes="(max-width: 1024px) 100vw, 640px"
                  priority
                />
              </div>
            )}

            {/* 画像カルーセル */}
            {images && images.length > 0 && (
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
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative shrink-0 aspect-square overflow-hidden bg-[var(--color-brand-cream)]"
                      style={{ scrollSnapAlign: "start", width: "65%" }}
                    >
                      <Image
                        src={img.url}
                        alt={`${title} 画像${i + 2}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 65vw, 500px"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center gap-2 mt-3">
                  {images.map((_, i) => (
                    <span key={i} className="block w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)]/30" />
                  ))}
                </div>
              </div>
            )}

            {/* タグ */}
            {tags && (
              <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-[var(--color-brand-brown)]/10">
                {tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[var(--color-text-secondary)]/60 border border-current/20 px-2.5 py-1 tracking-wider"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 本文前の追加コンテンツ */}
            {extraBefore}

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
            <MarkdownContent markdown={body} className={PROSE_STYLE} />

            {/* 本文後の追加コンテンツ */}
            {extraAfter}

            {/* Instagram元投稿 */}
            {instagramUrl && (
              <div className="mt-12 pt-8 border-t border-[var(--color-brand-brown)]/10">
                <p className="text-xs text-[var(--color-text-secondary)]/50 tracking-wider mb-3">この記事のもとになった投稿</p>
                <a
                  href={instagramUrl}
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
                href={backLink.href}
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {backLink.label}
              </Link>
            </div>
          </div>

          {/* ── サイドバー ── */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              <SidebarCampaign campaigns={campaigns} />
              {sidebarExtra}
            </div>
          </aside>

        </div>
      </div>

      {/* ===== CTA ===== */}
      <ConsultationCTA />
    </article>
  );
}
