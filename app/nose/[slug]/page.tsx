import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTreatmentBySlug, getTreatmentsByPillar, getCampaigns } from "@/lib/microcms/client";
import { TreatmentDetailTemplate, type PillarInfo } from "@/components/pillar/TreatmentDetailTemplate";

const PILLAR: PillarInfo = {
  slug: "nose",
  label: "鼻",
  caseLabel: "鼻の症例をもっと見る",
  sidebarLabel: "鼻のその他の施術",
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
    title: `${treatment.title}｜鼻の整形`,
    description: treatment.catch_copy,
  };
}

export default async function NoseTreatmentPage({
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

  return (
    <TreatmentDetailTemplate
      pillar={PILLAR}
      treatment={treatment}
      otherTreatments={otherTreatments}
      campaigns={campaigns}
    />
  );
}
