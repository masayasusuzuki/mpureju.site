import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCaseList, searchCases } from "@/lib/microcms/client";
import type { CasePillar } from "@/types/microcms";

export const metadata: Metadata = {
  title: "症例写真｜Maison PUREJU 銀座の美容外科・美容皮膚科",
  description:
    "Maison PUREJUの症例写真ギャラリー。口元・目元・鼻・リフトアップ・美容皮膚科など、実際の施術結果をご覧いただけます。",
};

const PILLARS: { label: string; value: CasePillar | "すべて" }[] = [
  { label: "すべて", value: "すべて" },
  { label: "口元", value: "口元" },
  { label: "目元", value: "目元" },
  { label: "鼻", value: "鼻" },
  { label: "リフトアップ", value: "リフトアップ" },
  { label: "美容皮膚科", value: "美容皮膚科" },
];

const PER_PAGE = 10;

export default async function CasePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pillar?: string; q?: string }>;
}) {
  const { page, pillar, q } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const currentPillar = pillar || "すべて";
  const keyword = q?.trim() ?? "";

  let cases: Awaited<ReturnType<typeof getCaseList>>["contents"];
  let totalPages: number;

  if (keyword) {
    const offset = (currentPage - 1) * PER_PAGE;
    const data = await searchCases(keyword, PER_PAGE + offset);
    cases = data.contents.slice(offset, offset + PER_PAGE);
    totalPages = Math.ceil(data.totalCount / PER_PAGE);
  } else {
    const filters = currentPillar !== "すべて" ? `pillar[contains]${currentPillar}` : undefined;
    const offset = (currentPage - 1) * PER_PAGE;
    const data = await getCaseList({ limit: PER_PAGE, offset, ...(filters ? { filters } : {}) });
    cases = data.contents;
    totalPages = Math.ceil(data.totalCount / PER_PAGE);
  }

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (currentPillar !== "すべて" && !keyword) params.set("pillar", currentPillar);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/case${qs ? `?${qs}` : ""}`;
  }

  function pillarHref(v: string) {
    return v === "すべて" ? "/case" : `/case?pillar=${encodeURIComponent(v)}`;
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
            <span className="text-[var(--color-text-secondary)]">症例写真</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">CASE GALLERY</p>
          <h1 className="font-en text-5xl md:text-6xl tracking-widest text-[var(--color-brand-dark)] mb-4 leading-none">
            症例写真
          </h1>
          {keyword ? (
            <p className="text-xs tracking-widest text-[var(--color-text-secondary)]">
              「{keyword}」の検索結果
            </p>
          ) : (
            <p className="text-xs tracking-widest text-[var(--color-text-secondary)]">
              実際の施術結果をご確認いただけます
            </p>
          )}
        </div>
      </section>

      {/* ===== 部位フィルタータブ ===== */}
      <div className="sticky top-16 md:top-20 z-30 bg-[var(--color-brand-white)] border-b border-[var(--color-brand-cream)]">
        <div className="section-container">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            {PILLARS.map(({ label, value }) => (
              <Link
                key={value}
                href={pillarHref(value)}
                scroll={false}
                className={`shrink-0 px-4 py-1.5 text-xs tracking-wider rounded-full transition-colors whitespace-nowrap ${
                  currentPillar === value
                    ? "bg-[var(--color-brand-dark)] text-white"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-brand-dark)]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

{/* ===== グリッド ===== */}
      <section className="py-14 md:py-20 bg-[var(--color-brand-white)]">
        <div className="section-container">
          {cases.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-sm text-[var(--color-text-secondary)] font-light tracking-wide">
                現在準備中です。しばらくお待ちください。
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {cases.map((c) => (
                  <Link key={c.id} href={`/case/${c.slug}`} className="block group">
                    <div className="bg-white border border-[var(--color-brand-brown)]/10 overflow-hidden">
                      <div className="relative w-full aspect-square bg-[var(--color-brand-cream)] overflow-hidden">
                        <Image
                          src={c.thumbnail.url}
                          alt={c.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                      </div>
                      <div className="px-4 py-4 space-y-2 border-t border-[var(--color-brand-brown)]/10 h-[108px]">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)] shrink-0">施術名</span>
                          <span className="text-sm text-[var(--color-brand-dark)] font-light line-clamp-1">{c.treatment_label}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)] shrink-0">お悩み</span>
                          <span className="text-sm text-[var(--color-text-secondary)] font-light line-clamp-1">
                            {c.concern.split(/[,、，]/).slice(0, 3).join("・")}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)] shrink-0">経過</span>
                          <span className="text-sm text-[var(--color-text-secondary)] font-light">{c.timing ?? "—"}</span>
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <span className="block text-center text-[11px] tracking-[0.18em] border border-[var(--color-brand-dark)] py-2.5 text-[var(--color-brand-dark)] group-hover:bg-[var(--color-brand-dark)] group-hover:text-white transition-colors">
                          この症例を詳しく見る
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

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
    </>
  );
}
