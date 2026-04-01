import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTreatmentBySlug, getTreatmentsByPillar, getCampaigns, getCasesByTreatment } from "@/lib/microcms/client";
import { TreatmentDetailTemplate, type PillarInfo } from "@/components/pillar/TreatmentDetailTemplate";
import { getFaqsBySlug } from "@/lib/faq-data";
import { findPriceRowsByName } from "@/lib/supabase/queries";

const PILLAR: PillarInfo = {
  slug: "skin",
  label: "美容皮膚科",
  caseLabel: "美容皮膚科の症例をもっと見る",
  sidebarLabel: "美容皮膚科のその他の施術",
};

export async function generateStaticParams() {
  const data = await getTreatmentsByPillar(PILLAR.slug);
  return data.contents.filter((t) => t.slug).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const treatment = await getTreatmentBySlug(slug);
  if (!treatment) return {};
  return {
    title: `${treatment.title}｜美容皮膚科`,
    description: treatment.catch_copy,
  };
}

export default async function SkinTreatmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const treatment = await getTreatmentBySlug(slug);
  if (!treatment) notFound();

  const [all, campaigns, priceRows, caseData] = await Promise.all([
    getTreatmentsByPillar(PILLAR.slug),
    getCampaigns(),
    findPriceRowsByName(treatment.title),
    getCasesByTreatment(treatment.title),
  ]);
  const otherTreatments = all.contents.filter((t) => t.slug !== slug);
  const faqs = getFaqsBySlug(slug);

  return (
    <TreatmentDetailTemplate
      pillar={PILLAR}
      treatment={treatment}
      otherTreatments={otherTreatments}
      campaigns={campaigns}
      faqs={faqs}
      priceRows={priceRows}
      cases={caseData.contents}
    />
  );
}
