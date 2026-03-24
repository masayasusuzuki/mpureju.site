import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMachineList } from "@/lib/microcms/client";

export const metadata: Metadata = {
  title: "医療機器一覧（マシンリスト）｜Maison PUREJU 銀座の美容外科・美容皮膚科",
  description:
    "Maison PUREJUで導入している美容医療機器の一覧。HIFU、RF、ニードルRF、レーザー、光治療、LED、エレクトロポレーションなど、当院の美容医療機器をご紹介します。",
};

const PER_PAGE = 6;

export default async function MachinePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const data = await getMachineList();
  const allMachines = data.contents;
  const totalPages = Math.ceil(allMachines.length / PER_PAGE);
  const machines = allMachines.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

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
            <span className="text-[var(--color-text-secondary)]">医療機器一覧</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            MACHINE LIST
          </p>
          <h1 className="font-en text-5xl md:text-6xl tracking-widest text-[var(--color-brand-dark)] mb-4 leading-none">
            医療機器一覧
          </h1>
          <p className="text-xs tracking-widest text-[var(--color-text-secondary)]">
            当院で導入している美容医療機器のご案内
          </p>
        </div>
      </section>

      {/* ===== フラットグリッド ===== */}
      <section className="py-16 md:py-24 bg-[var(--color-brand-white)]">
        <div className="section-container">
          {machines.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-6">
              {machines.map((m) => (
                <Link
                  key={m.id}
                  href={`/machine/${m.slug}`}
                  className="group block bg-white border border-[var(--color-brand-brown)]/10 rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  {/* サムネイル */}
                  <div className="relative aspect-video bg-[var(--color-brand-cream)] overflow-hidden">
                    {m.thumbnail ? (
                      <Image
                        src={m.thumbnail.url}
                        alt={m.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs text-[var(--color-text-secondary)]/30 tracking-widest">NO IMAGE</span>
                      </div>
                    )}
                  </div>
                  {/* テキスト */}
                  <div className="px-3 py-3 md:px-4 md:py-4">
                    <p className="text-[0.65rem] tracking-wider text-[var(--color-brand-gold)] mb-1 uppercase">
                      {m.type}
                    </p>
                    <p className="font-en text-xs tracking-wider text-[var(--color-brand-dark)]/40 mb-0.5">
                      {m.name_en}
                    </p>
                    <p className="text-sm font-medium text-[var(--color-brand-dark)] group-hover:text-[var(--color-brand-gold)] transition-colors">
                      {m.name}
                    </p>
                    {m.target_concerns && (
                      <p className="text-[0.65rem] text-[var(--color-text-secondary)] mt-1.5">
                        {m.target_concerns}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-[var(--color-brand-cream)]/50 p-6 rounded-sm text-center">
              <p className="text-sm text-[var(--color-text-secondary)] font-light">準備中</p>
            </div>
          )}

          {/* ページネーション */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-14">
              {currentPage > 1 && (
                <Link
                  href={currentPage === 2 ? "/machine" : `/machine?page=${currentPage - 1}`}
                  scroll={false}
                  className="flex items-center justify-center w-10 h-10 border border-[var(--color-brand-brown)]/15 rounded-sm text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={p === 1 ? "/machine" : `/machine?page=${p}`}
                  scroll={false}
                  className={`flex items-center justify-center w-10 h-10 rounded-sm text-sm font-en tracking-wider transition-colors ${
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
                  href={`/machine?page=${currentPage + 1}`}
                  scroll={false}
                  className="flex items-center justify-center w-10 h-10 border border-[var(--color-brand-brown)]/15 rounded-sm text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 md:py-20 border-t border-[var(--color-brand-gold)]/20 bg-white">
        <div className="section-container">
          <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-4">CONSULTATION</p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-3 leading-relaxed">
            ご予約・ご相談はこちら
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-10 leading-relaxed">
            マシン治療の詳細・ダウンタイムなど、<br className="md:hidden" />
            ご不明な点はカウンセリングにてご確認ください。
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
            <a
              href="https://mpureju.com/reservation"
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
