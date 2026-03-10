import { Suspense } from "react";
import type { Metadata } from "next";
import { SimulatorClient } from "@/components/simulator/SimulatorClient";
import { parseSlugsParam } from "@/lib/simulator/logic";

export const metadata: Metadata = {
  title: "ダウンタイムシミュレーター | Maison PUREJU 銀座",
  description:
    "施術を選択し希望日を入力すると、ダウンタイムの目安をカレンダーで確認できます。",
};

type Props = {
  searchParams: Promise<{ t?: string }>;
};

export default async function SimulatorPage({ searchParams }: Props) {
  const { t } = await searchParams;
  const initialSlugs = parseSlugsParam(t ?? null);

  return (
    <main>
      {/* Hero */}
      <section
        className="relative py-20 md:py-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, var(--color-brand-dark) 0%, #2a1e10 60%, #3d2b1a 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 70% 60%, rgba(201,169,110,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="section-container relative z-10">
          <p className="text-[var(--color-brand-gold)] text-[10px] tracking-[0.4em] mb-3 font-light">
            DOWNTIME SIMULATOR
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-white font-light tracking-wider mb-4">
            ダウンタイム<br className="md:hidden" />シミュレーター
          </h1>
          <p className="text-[var(--color-brand-cream)]/70 text-sm leading-relaxed max-w-lg font-light">
            気になる施術を選択し、希望日を入力してください。
            ダウンタイムの目安とマイルストーンをカレンダーで確認できます。
          </p>
        </div>
      </section>

      {/* シミュレーター本体 */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "var(--color-brand-cream)" }}>
        <div className="section-container">
          <Suspense fallback={<div className="text-sm text-[var(--color-text-secondary)]">読み込み中...</div>}>
            <SimulatorClient initialSlugs={initialSlugs} />
          </Suspense>
        </div>
      </section>

      {/* 注意事項 */}
      <section className="py-10 bg-white border-t border-[var(--color-brand-brown)]/10">
        <div className="section-container">
          <p className="text-[10px] tracking-widest text-[var(--color-text-secondary)] mb-3 uppercase">
            Notes
          </p>
          <ul className="text-xs text-[var(--color-text-secondary)] space-y-1.5 leading-relaxed">
            <li>・ 表示されるダウンタイムはあくまで目安です。個人差があります。</li>
            <li>・ 複数施術を同時に行う場合、ダウンタイムは各施術の最大日数を採用しています。</li>
            <li>・ カレンダー上の日程は確認用のシミュレーションです。実際の予約可否はカウンセリングにてご確認ください。</li>
            <li>・ 施術の適応・安全性については必ず医師の診察を受けてください。</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
