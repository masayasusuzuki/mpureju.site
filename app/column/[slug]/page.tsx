import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getColumnBySlug, getColumnList, getCampaigns } from "@/lib/microcms/client";
import { ArticleDetailLayout } from "@/components/article/ArticleDetailLayout";
import { SidebarList } from "@/components/article/SidebarList";

export async function generateStaticParams() {
  const data = await getColumnList({ limit: 100 });
  return data.contents
    .filter((c) => c.slug)
    .map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const col = await getColumnBySlug(slug);
  if (!col) return {};
  return {
    title: `${col.title}｜美容コラム｜Maison PUREJU`,
    description: `${col.category.join("・")}に関するコラム。Maison PUREJU（銀座）の美容コラムです。`,
  };
}

export default async function ColumnDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [col, allData, campaignData] = await Promise.all([
    getColumnBySlug(slug),
    getColumnList({ limit: 100 }),
    getCampaigns(),
  ]);
  if (!col) notFound();

  const latestColumns = allData.contents
    .filter((c) => c.slug !== slug)
    .slice(0, 5)
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      thumbnail: c.thumbnail,
      label: c.category?.[0] ?? "",
    }));

  const related = allData.contents
    .filter(
      (c) =>
        c.slug !== slug &&
        c.category.some((cat) => col.category.includes(cat))
    )
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      thumbnail: c.thumbnail,
      label: c.category?.[0] ?? "",
    }));

  return (
    <ArticleDetailLayout
      breadcrumbs={[{ label: "美容コラム", href: "/column" }]}
      badges={col.category.map((cat) => ({
        label: cat,
        href: `/column?category=${encodeURIComponent(cat)}`,
      }))}
      date={col.published_at}
      title={col.title}
      thumbnail={col.thumbnail}
      thumbnailConfig={{ aspectRatio: "square", fit: "contain" }}
      images={col.images}
      tags={col.tags}
      body={col.content}
      instagramUrl={col.instagram_url}
      campaigns={campaignData}
      sidebarExtra={
        <>
          <SidebarList title="最新コラム" items={latestColumns} basePath="/column" />
          <SidebarList title="関連コラム" items={related} basePath="/column" />
        </>
      }
      backLink={{ href: "/column", label: "美容コラム一覧に戻る" }}
    />
  );
}
