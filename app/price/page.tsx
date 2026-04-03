import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PriceSubTabs } from "@/components/sections/PriceSubTabs";
import { PriceNav, type SearchRow } from "@/components/sections/PriceNav";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import type { PriceRow, SubTab } from "@/lib/price-data";
import { getPriceSubTabs, getPriceRows } from "@/lib/supabase/queries";

export const revalidate = 3600; // 1時間キャッシュ

export const metadata: Metadata = {
  title: "料金一覧｜Maison PUREJU 銀座の美容外科・美容皮膚科",
  description:
    "Maison PUREJUの施術料金一覧。皮膚科・外科・点滴・内服薬・化粧品の税込価格をカテゴリ別に掲載しています。",
};

// ============================================================
// SEARCH DATA（全データをフラット化して PriceNav に渡す）
// ============================================================
function flattenTabs(section: string, tabs: SubTab[]): SearchRow[] {
  const rows: SearchRow[] = [];
  for (const tab of tabs) {
    let lastCategory = "";
    for (const row of tab.rows) {
      const cat = row.category || lastCategory;
      if (row.category) lastCategory = row.category;
      rows.push({ section, subTab: tab.label, category: cat, option: row.option, price: row.price });
    }
  }
  return rows;
}

function flattenRows(section: string, sourceRows: PriceRow[]): SearchRow[] {
  let lastCategory = "";
  return sourceRows.map((row) => {
    const cat = row.category || lastCategory;
    if (row.category) lastCategory = row.category;
    return { section, category: cat, option: row.option, price: row.price };
  });
}

// ALL_ROWS はページコンポーネント内で動的に構築

// ============================================================
// SIMPLE TABLE COMPONENT（サーバーサイドレンダリング可）
// ============================================================
function SimpleTable({ rows }: { rows: PriceRow[] }) {
  const hasOption = rows.some((r) => r.option);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[420px] border-collapse">
        <thead>
          <tr className="bg-[var(--color-brand-brown)] text-[var(--color-brand-cream)]">
            <th className="text-left py-3 px-4 font-medium text-xs tracking-wider w-64">
              カテゴリー
            </th>
            {hasOption && (
              <th className="text-left py-3 px-4 font-medium text-xs tracking-wider w-40">
                オプション
              </th>
            )}
            <th className="text-right py-3 px-4 font-medium text-xs tracking-wider w-32">
              価格（税込）
            </th>
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
              <td className="py-3 px-4 text-[var(--color-text-primary)] leading-relaxed">
                {row.category}
              </td>
              {hasOption && (
                <td className="py-3 px-4 text-[var(--color-text-secondary)] text-xs">
                  {row.option ?? ""}
                </td>
              )}
              <td className="py-3 px-4 text-right font-medium text-[var(--color-brand-dark)] tabular-nums">
                {row.price}
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
export default async function PricePage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const tab = (await searchParams)?.tab ?? "";
  const [hifukaTabs, gekaTabs, tentekiRows, naifukuRows, keshouhinTabs, sonotaTabs] =
    await Promise.all([
      getPriceSubTabs("皮膚科"),
      getPriceSubTabs("外科"),
      getPriceRows("点滴"),
      getPriceRows("内服薬"),
      getPriceSubTabs("化粧品"),
      getPriceSubTabs("その他"),
    ]);

  const ALL_ROWS: SearchRow[] = [
    ...flattenTabs("皮膚科", hifukaTabs),
    ...flattenTabs("外科", gekaTabs),
    ...flattenRows("点滴", tentekiRows),
    ...flattenRows("内服薬", naifukuRows),
    ...flattenTabs("化粧品", keshouhinTabs),
    ...flattenTabs("その他", sonotaTabs),
  ];

  return (
    <>
      {/* ===== Hero ===== */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(150deg, #fdfcfa 0%, #f0e8d8 60%, #e8dcc8 100%)" }}
      >
        {/* ゴールドの光彩（淡く） */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 90% 10%, rgba(201,169,110,0.12) 0%, transparent 55%)" }}
        />
        <div className="relative section-container py-12 md:py-16">
          <nav className="flex items-center gap-2 text-xs mb-8 tracking-wider text-[var(--color-text-secondary)]/60">
            <Link href="/" className="hover:text-[var(--color-brand-gold)] transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-[var(--color-text-secondary)]">料金一覧</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            PRICE LIST
          </p>
          <h1 className="font-en text-5xl md:text-6xl tracking-widest text-[var(--color-brand-dark)] mb-4 leading-none">
            料金一覧
          </h1>
          <p className="text-xs tracking-widest text-[var(--color-text-secondary)]">
            表示価格はすべて税込総額です
          </p>
        </div>
      </section>

      {/* ===== スティッキーカテゴリナビ + 検索 ===== */}
      <Suspense fallback={null}>
        <PriceNav allRows={ALL_ROWS} />
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
            <PriceSubTabs tabs={hifukaTabs} initialTab={tab} />
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
            <PriceSubTabs tabs={gekaTabs} initialTab={tab} />
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
            <SimpleTable rows={tentekiRows} />
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
            <SimpleTable rows={naifukuRows} />
          </div>
        </div>
      </section>

      {/* ===== 化粧品 ===== */}
      <section
        id="keshouhin"
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #fdfcfa 0%, #f5ede0 100%)" }}
      >
        <div className="section-container">
          <SectionHeading number="05" en="Cosmetics" ja="化粧品" />
          <div className="mt-10">
            <PriceSubTabs tabs={keshouhinTabs} initialTab={tab} />
          </div>
        </div>
      </section>

      {/* ===== その他 ===== */}
      <section
        id="sonota"
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #f7f0e6 0%, #fdfcfa 100%)" }}
      >
        <div className="section-container">
          <SectionHeading number="06" en="Others" ja="その他" />
          <div className="mt-10">
            <PriceSubTabs tabs={sonotaTabs} initialTab={tab} />
          </div>
        </div>
      </section>

      {/* ===== 注意事項 ===== */}
      <section className="py-12 md:py-16 border-t border-[var(--color-brand-gold)]/20 bg-white">
        <div className="section-container">
          <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-6">
            NOTES
          </p>
          <ul className="space-y-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              料金表の価格はすべて税込総額での表示となっております。
            </li>
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
              お支払いは現金・各種クレジットカード・医療用ローンにてお承りしております。詳しくはカウンセリング時にご確認ください。
            </li>
          </ul>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <ConsultationCTA variant="left" subtitle={<>料金・施術内容・ダウンタイムなど、<br className="md:hidden" />ご不明な点はカウンセリングにてご確認ください。</>} />
    </>
  );
}
