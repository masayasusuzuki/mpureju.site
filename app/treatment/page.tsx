import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TreatmentNav, type TreatmentSearchRow } from "@/components/sections/TreatmentNav";
import { TreatmentSubTabs, type TreatmentRow, type TreatmentSubTab } from "@/components/sections/TreatmentSubTabs";
import { getTreatmentRowsBySection, getTreatmentSubTabs } from "@/lib/supabase/queries";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";

export const revalidate = 3600; // 1時間キャッシュ

export const metadata: Metadata = {
  title: "施術一覧｜Maison PUREJU 銀座の美容外科・美容皮膚科",
  description:
    "Maison PUREJUの全施術一覧。皮膚科・外科・点滴・内服薬の施術内容・リスク・副作用をカテゴリ別に掲載しています。",
};

// ============================================================
// SEARCH DATA（全データをフラット化して TreatmentNav に渡す）
// ============================================================
function flattenSubTabs(section: string, tabs: TreatmentSubTab[]): TreatmentSearchRow[] {
  return tabs.flatMap((tab) =>
    tab.rows.map((row) => ({ section, subTab: tab.label, name: row.name, desc: row.desc }))
  );
}

function flattenRows(section: string, rows: TreatmentRow[]): TreatmentSearchRow[] {
  return rows.map((row) => ({ section, name: row.name, desc: row.desc }));
}

// ============================================================
// SIMPLE TABLE（皮膚科・点滴・内服薬用）
// ============================================================
function TreatmentTable({ rows }: { rows: TreatmentRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-[var(--color-brand-brown)] text-[var(--color-brand-cream)]">
            <th className="text-left py-3 px-4 font-medium text-xs tracking-wider w-44">施術名</th>
            <th className="text-left py-3 px-4 font-medium text-xs tracking-wider">概要</th>
            <th className="text-left py-3 px-4 font-medium text-xs tracking-wider w-52">リスク・副作用</th>
            <th className="text-right py-3 px-4 font-medium text-xs tracking-wider w-20">料金</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-[var(--color-brand-brown)]/10 ${
                i % 2 === 1 ? "bg-[var(--color-brand-cream)]/40" : ""
              }`}
            >
              <td className="py-3 px-4 font-medium text-[var(--color-brand-dark)] align-top">
                {row.name.split(" / ").map((part, j) => (
                  <span key={j} className="block">{part}</span>
                ))}
              </td>
              <td className="py-3 px-4 text-[var(--color-text-secondary)] leading-relaxed align-top">{row.desc}</td>
              <td className="py-3 px-4 text-[var(--color-text-secondary)] text-xs leading-relaxed align-top">{row.risks}</td>
              <td className="py-3 px-4 text-right align-top">
                <Link
                  href={`/price?q=${encodeURIComponent(row.name.split(" / ")[0])}`}
                  className="text-xs text-[var(--color-brand-gold)] hover:underline whitespace-nowrap"
                >
                  料金 →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================
export default async function TreatmentPage() {
  const [hifukaRows, gekaTabs, tentekiRows, naifukuRows] = await Promise.all([
    getTreatmentRowsBySection("皮膚科"),
    getTreatmentSubTabs("外科"),
    getTreatmentRowsBySection("点滴"),
    getTreatmentRowsBySection("内服薬"),
  ]);

  const allRows: TreatmentSearchRow[] = [
    ...flattenRows("皮膚科", hifukaRows),
    ...flattenSubTabs("外科", gekaTabs),
    ...flattenRows("点滴", tentekiRows),
    ...flattenRows("内服薬", naifukuRows),
  ];

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
            <span className="text-[var(--color-text-secondary)]">施術一覧</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            TREATMENT MENU
          </p>
          <h1 className="font-en text-5xl md:text-6xl tracking-widest text-[var(--color-brand-dark)] mb-4 leading-none">
            施術一覧
          </h1>
          <p className="text-xs tracking-widest text-[var(--color-text-secondary)]">
            当院で提供する全施術のご案内
          </p>
        </div>
      </section>

      {/* ===== スティッキーナビ + 検索 ===== */}
      <Suspense fallback={null}>
        <TreatmentNav allRows={allRows} />
      </Suspense>

      {/* ===== 皮膚科 ===== */}
      <section
        id="hifuka"
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #fdfcfa 0%, #f5ede0 100%)" }}
      >
        <div className="section-container">
          <SectionHeading number="01" en="Dermatology" ja="皮膚科" />
          <div className="mt-10">
            <TreatmentTable rows={hifukaRows} />
          </div>
        </div>
      </section>

      {/* ===== 外科 ===== */}
      <section
        id="geka"
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #f7f0e6 0%, #fdfcfa 100%)" }}
      >
        <div className="section-container">
          <SectionHeading number="02" en="Surgery" ja="外科" />
          <div className="mt-10">
            <TreatmentSubTabs tabs={gekaTabs} />
          </div>
        </div>
      </section>

      {/* ===== 点滴 ===== */}
      <section
        id="tenteki"
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #fdfcfa 0%, #f5ede0 100%)" }}
      >
        <div className="section-container">
          <SectionHeading number="03" en="IV Drip" ja="点滴" />
          <div className="mt-10">
            <TreatmentTable rows={tentekiRows} />
          </div>
        </div>
      </section>

      {/* ===== 内服薬 ===== */}
      <section
        id="naifuku"
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #f7f0e6 0%, #fdfcfa 100%)" }}
      >
        <div className="section-container">
          <SectionHeading number="04" en="Oral Medication" ja="内服薬" />
          <div className="mt-10">
            <TreatmentTable rows={naifukuRows} />
          </div>
        </div>
      </section>

      {/* ===== 注意事項 ===== */}
      <section className="py-12 md:py-16 border-t border-[var(--color-brand-gold)]/20 bg-white">
        <div className="section-container">
          <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-6">NOTES</p>
          <ul className="space-y-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              当院の施術はすべて自由診療です。
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              診察の結果、施術の適応がない場合も診察料を頂戴いたします。
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              記載のリスク・副作用はすべての方に起こるわけではありません。詳細はカウンセリングにてご確認ください。
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              未承認医療機器・医薬品については、個人輸入にて提供しております。
            </li>
          </ul>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <ConsultationCTA variant="left" subtitle={<>施術内容・ダウンタイムなど、<br className="md:hidden" />ご不明な点はカウンセリングにてご確認ください。</>} />
    </>
  );
}
