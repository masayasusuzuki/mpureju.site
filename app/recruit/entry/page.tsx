import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { EntryForm } from "./EntryForm";

export const metadata: Metadata = {
  title: "採用応募フォーム｜Maison PUREJU",
  description:
    "Maison PUREJU（銀座）の採用応募フォーム。看護師・受付カウンセラー・広報の求人にエントリーいただけます。",
};

export default function RecruitEntryPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-16 bg-white">
        <div className="section-container text-center">
          <nav className="flex items-center justify-center gap-2 text-xs mb-12 tracking-wider text-[var(--color-text-secondary)]/60">
            <Link href="/" className="hover:text-[var(--color-brand-gold)] transition-colors">
              HOME
            </Link>
            <span>/</span>
            <Link href="/recruit" className="hover:text-[var(--color-brand-gold)] transition-colors">
              採用情報
            </Link>
            <span>/</span>
            <span className="text-[var(--color-text-secondary)]">エントリー</span>
          </nav>

          <p
            className="font-en text-7xl md:text-8xl lg:text-9xl leading-none text-[var(--color-brand-gold)] select-none mb-4"
            style={{ opacity: 0.12 }}
            aria-hidden="true"
          >
            Entry Form
          </p>
          <h1 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] tracking-wide">
            採用応募フォーム
          </h1>
        </div>
      </section>

      {/* ── フォーム ── */}
      <section className="pb-16 md:pb-24 bg-white">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            <div className="border border-[var(--color-brand-brown)]/15 p-8 md:p-12">
              <Suspense>
                <EntryForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* ── メール応募 ── */}
      <section className="pb-20 md:pb-28 bg-white">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-[var(--color-brand-cream)] p-8 md:p-12">
              <p className="font-en text-[10px] tracking-[0.3em] text-[var(--color-brand-gold)] mb-4">EMAIL</p>
              <h2 className="font-serif text-lg md:text-xl text-[var(--color-brand-dark)] mb-6 tracking-wide">
                メールでも応募できます
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-[2] mb-6">
                上記フォームの代わりに、メールでの応募も受け付けております。<br />
                写真付き履歴書・職務経歴書を下記アドレスまでお送りください。<br />
                SNS広報に応募される方は、ポートフォリオまたは実績動画もお願いいたします。
              </p>
              <a
                href="mailto:info@mpureju.com"
                className="inline-flex items-center gap-3 text-base text-[var(--color-brand-dark)] tracking-wider hover:text-[var(--color-brand-gold)] transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                info@mpureju.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
