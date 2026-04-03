import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStaffBlogList, getStaffBlogBySlug, getCampaigns } from "@/lib/microcms/client";
import { ArticleDetailLayout } from "@/components/article/ArticleDetailLayout";
import { SidebarList } from "@/components/article/SidebarList";

export async function generateStaticParams() {
  const data = await getStaffBlogList({ limit: 100 });
  return data.contents
    .filter((item) => item.slug)
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getStaffBlogBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title}｜スタッフブログ｜Maison PUREJU`,
    description: `Maison PUREJUスタッフブログ「${post.title}」`,
  };
}

export default async function StaffBlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, allData, campaignData] = await Promise.all([
    getStaffBlogBySlug(slug),
    getStaffBlogList({ limit: 100 }),
    getCampaigns(),
  ]);
  if (!post) notFound();

  const categories = Array.isArray(post.category) ? post.category : [post.category];

  const latestPosts = allData.contents
    .filter((p) => p.slug !== slug)
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      thumbnail: p.thumbnail,
      label: (Array.isArray(p.category) ? p.category[0] : p.category) ?? "",
    }));

  return (
    <ArticleDetailLayout
      breadcrumbs={[
        { label: "スタッフブログ", href: "/staff-blog" },
      ]}
      badges={categories.filter(Boolean).map((c) => ({ label: c }))}
      date={post.published_at}
      title={post.title}
      author={post.author}
      thumbnail={post.thumbnail}
      thumbnailConfig={{ aspectRatio: "square", fit: "cover", maxWidth: "max-w-md" }}
      images={post.images}
      tags={post.tags}
      body={post.body}
      instagramUrl={post.instagram_url}
      campaigns={campaignData}
      sidebarExtra={
        <SidebarList title="最新記事" items={latestPosts} basePath="/staff-blog" />
      }
      backLink={{ href: "/staff-blog", label: "スタッフブログ一覧に戻る" }}
    />
  );
}
