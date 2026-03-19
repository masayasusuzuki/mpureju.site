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
    </>
  );
}
