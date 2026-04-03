import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseBySlug, getCasesByPillar, getCampaigns } from "@/lib/microcms/client";
import { ArticleDetailLayout } from "@/components/article/ArticleDetailLayout";
import { SidebarList } from "@/components/article/SidebarList";
import { InlinePricePanel } from "@/components/sections/InlinePricePanel";
import { findPriceRowsByName } from "@/lib/supabase/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const caseItem = await getCaseBySlug(slug);
  if (!caseItem) return { title: "症例が見つかりません" };
  return {
    title: `${caseItem.title}｜症例写真｜Maison PUREJU`,
    description: `${caseItem.treatment_label}の症例写真。${caseItem.concern.split(",").slice(0, 3).join("・")}でお悩みの方へ。`,
  };
}

export default async function CaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const caseItem = await getCaseBySlug(slug);
  if (!caseItem) notFound();

  const [relatedData, campaignData, priceRows] = await Promise.all([
    caseItem.pillar[0]
      ? getCasesByPillar(caseItem.pillar[0])
      : Promise.resolve({ contents: [] }),
    getCampaigns(),
    findPriceRowsByName(caseItem.treatment_label),
  ]);

  const relatedCases = relatedData.contents
    .filter((c) => c.id !== caseItem.id)
    .slice(0, 5)
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      thumbnail: c.thumbnail ? { url: c.thumbnail.url } : undefined,
      label: c.treatment_label,
    }));

  const concerns = caseItem.concern.split(/[,、，]/).map((s) => s.trim()).filter(Boolean);

  // バッジ: ピラー + タイミング
  const badges = [
    ...caseItem.pillar.map((p) => ({ label: p })),
    ...(caseItem.timing ? [{ label: caseItem.timing }] : []),
  ];

  return (
    <ArticleDetailLayout
      breadcrumbs={[{ label: "症例一覧", href: "/case" }]}
      badges={badges}
      date={caseItem.published_at}
      title={caseItem.title}
      thumbnail={caseItem.thumbnail}
      thumbnailConfig={{ aspectRatio: "square", fit: "cover", maxWidth: "max-w-lg" }}
      images={caseItem.images}
      tags={caseItem.tags}
      extraBefore={
        <>
          {/* お悩み */}
          {concerns.length > 0 && (
            <div className="bg-[var(--color-brand-cream)] border-l-2 border-[var(--color-brand-gold)] px-5 py-4 mb-10">
              <p className="text-[10px] tracking-[0.25em] text-[var(--color-brand-gold)] font-medium mb-3">こんなお悩みの方の症例です</p>
              <ul className="space-y-1.5">
                {concerns.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-[var(--color-brand-dark)] font-light">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--color-brand-gold)] shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      }
      body={caseItem.content}
      toc={false}
      extraAfter={
        /* リスク・副作用 */
        <div className="bg-[var(--color-brand-cream)] border border-[var(--color-brand-brown)]/10 p-5 rounded-sm mt-10">
          <p className="text-xs tracking-[0.15em] text-[var(--color-brand-gold)] mb-2">リスク・副作用</p>
          <p className="text-xs text-[var(--color-text-secondary)] font-light leading-relaxed">
            {caseItem.risks}
          </p>
        </div>
      }
      instagramUrl={caseItem.instagram_url}
      campaigns={campaignData}
      sidebarExtra={
        <>
          <InlinePricePanel title={caseItem.treatment_label} rows={priceRows} />
          {/* 施術情報 */}
          <div className="border border-[var(--color-brand-brown)]/10 p-5 space-y-4 rounded-sm">
            <p className="text-xs tracking-[0.2em] text-[var(--color-brand-gold)] font-medium">TREATMENT INFO</p>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)] mb-1">施術名</p>
                <p className="text-sm text-[var(--color-brand-dark)] font-light">{caseItem.treatment_label}</p>
              </div>
              {caseItem.timing && (
                <div>
                  <p className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)] mb-1">経過</p>
                  <p className="text-sm text-[var(--color-text-secondary)] font-light">{caseItem.timing}</p>
                </div>
              )}
            </div>
          </div>
          <SidebarList title="関連する症例" items={relatedCases} basePath="/case" />
        </>
      }
      backLink={{ href: "/case", label: "症例一覧に戻る" }}
    />
  );
}
