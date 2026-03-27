import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTreatmentBySlug, getTreatmentsByPillar, getCampaigns } from "@/lib/microcms/client";
import { TreatmentDetailTemplate, type PillarInfo } from "@/components/pillar/TreatmentDetailTemplate";
import { getFaqsBySlug } from "@/lib/faq-data";

const PILLAR: PillarInfo = {
  slug: "lift",
  label: "糸・リフト",
  caseLabel: "糸・リフトの症例をもっと見る",
  sidebarLabel: "糸・リフトのその他の施術",
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
    title: `${treatment.title}｜糸リフト・リフトアップ`,
    description: treatment.catch_copy,
  };
}

export default async function LiftTreatmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const treatment = await getTreatmentBySlug(slug);
  if (!treatment) notFound();

  const [all, campaigns] = await Promise.all([
    getTreatmentsByPillar(PILLAR.slug),
    getCampaigns(),
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
    />
  );
}
