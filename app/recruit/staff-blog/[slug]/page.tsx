import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStaffBlogList, getStaffBlogBySlug } from "@/lib/microcms/client";
import { RichContent } from "@/components/ui/RichContent";

export async function generateStaticParams() {
  const data = await getStaffBlogList();
  return data.contents
    .filter((item) => item.slug)
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getStaffBlogBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: `Maison PUREJUスタッフブログ「${post.title}」`,
  };
}

export default async function StaffBlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getStaffBlogBySlug(slug);
  if (!post) notFound();

  const category = Array.isArray(post.category)
    ? post.category[0]
    : post.category;

  const dateStr = new Date(post.published_at).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 他の記事（現在の記事を除く最新3件）
  const allPosts = await getStaffBlogList({ limit: 4 });
  const otherPosts = allPosts.contents.filter((p) => p.id !== post.id).slice(0, 3);

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
            <Link href="/recruit/staff-blog" className="hover:text-[var(--color-brand-gold)] transition-colors">
              スタッフブログ
            </Link>
            <span>/</span>
            <span className="text-[var(--color-text-secondary)]">{post.title}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            {category && (
              <span className="text-xs bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] px-3 py-1 tracking-wider">
                {category}
              </span>
            )}
            <time className="text-xs text-[var(--color-text-secondary)]/60 tracking-wider">
              {dateStr}
            </time>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl tracking-wide text-[var(--color-brand-dark)] leading-relaxed">
            {post.title}
          </h1>
        </div>
      </section>

      {/* ── メインコンテンツ ── */}
      <div className="section-container py-12 md:py-16">
        <div className="max-w-3xl">
          {/* サムネイル */}
          <div className="relative w-full aspect-video mb-10 overflow-hidden">
            <Image
              src={post.thumbnail.url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          {/* 本文 */}
          <RichContent
            html={post.body}
            className="prose prose-neutral max-w-none prose-headings:font-serif prose-headings:text-[var(--color-brand-dark)] prose-p:text-[var(--color-text-secondary)] prose-p:leading-[2] prose-p:font-light prose-img:rounded-sm prose-li:text-[var(--color-text-secondary)]"
          />

          {/* 戻るリンク */}
          <div className="mt-12 pt-8 border-t border-[var(--color-brand-brown)]/10">
            <Link
              href="/recruit/staff-blog"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              スタッフブログ一覧に戻る
            </Link>
          </div>
        </div>
      </div>

      {/* ── 他の記事 ── */}
      {otherPosts.length > 0 && (
        <section className="bg-[var(--color-brand-cream)] py-14 md:py-16">
          <div className="section-container">
            <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] text-center mb-8 tracking-wide">
              他の記事
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherPosts.map((other) => (
                <Link
                  key={other.id}
                  href={`/recruit/staff-blog/${other.slug}`}
                  className="block bg-white overflow-hidden group"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={other.thumbnail.url}
                      alt={other.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="px-5 py-4">
                    <p className="font-serif text-sm text-[var(--color-brand-dark)] leading-relaxed line-clamp-2 group-hover:text-[var(--color-brand-gold)] transition-colors">
                      {other.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
