import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMachineBySlug, getMachineList, getCampaigns } from "@/lib/microcms/client";
import { RichContent } from "@/components/ui/RichContent";
import { SidebarCampaign } from "@/components/sections/SidebarCampaign";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";

const PROSE_STYLE =
  "prose prose-neutral max-w-none prose-headings:font-light prose-headings:tracking-wide prose-headings:text-[var(--color-brand-dark)] prose-p:text-[var(--color-text-secondary)] prose-p:leading-[1.9] prose-li:text-[var(--color-text-secondary)] prose-strong:text-[var(--color-brand-dark)]";

export async function generateStaticParams() {
  const data = await getMachineList();
  return data.contents
    .filter((m) => m.slug)
    .map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const machine = await getMachineBySlug(slug);
  if (!machine) return {};
  return {
    title: `${machine.name}（${machine.name_en}）｜医療機器｜Maison PUREJU`,
    description: machine.catch_copy,
  };
}

export default async function MachineDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const machine = await getMachineBySlug(slug);
  if (!machine) notFound();

  // サイドバー: 他のマシン + キャンペーン
  const [allMachines, campaigns] = await Promise.all([
    getMachineList(),
    getCampaigns(),
  ]);
  const otherMachines = allMachines.contents.filter(
    (m) => m.slug !== slug
  );

  return (
    <article>
      {/* ── Hero ── */}
      <section className="relative w-full min-h-[200px] md:min-h-[260px] bg-[var(--color-brand-cream)]">
        <div className="absolute inset-0 flex flex-col justify-end pb-10 md:pb-12">
          <div style={{ paddingLeft: "max(1.5rem, calc((100vw - 1200px) / 2 + 2rem))" }}>
            <nav className="flex items-center gap-2 text-xs text-[var(--color-brand-dark)]/50 mb-4 tracking-wider">
              <Link href="/" className="hover:text-[var(--color-brand-dark)] transition-colors">HOME</Link>
              <span>/</span>
              <Link href="/machine" className="hover:text-[var(--color-brand-dark)] transition-colors">医療機器一覧</Link>
              <span>/</span>
              <span className="text-[var(--color-brand-dark)]/80">{machine.name}</span>
            </nav>
            <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-2">
              {machine.name_en}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--color-brand-dark)] tracking-wide">
              {machine.name}
            </h1>
            <p className="text-sm md:text-base text-[var(--color-text-secondary)] mt-3 max-w-4xl leading-relaxed">
              {machine.catch_copy}
            </p>
          </div>
        </div>
      </section>

      {/* ── 概要バー ── */}
      <section className="bg-white border-b border-[var(--color-brand-brown)]/10">
        <div className="section-container py-6 md:py-8">
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            <div>
              <dt className="text-xs text-[var(--color-text-secondary)] tracking-wider mb-1">マシン名</dt>
              <dd className="font-serif text-base text-[var(--color-brand-dark)]">{machine.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-text-secondary)] tracking-wider mb-1">種別</dt>
              <dd className="font-serif text-base text-[var(--color-brand-dark)]">{machine.type}</dd>
            </div>
            {machine.target_concerns && (
              <div>
                <dt className="text-xs text-[var(--color-text-secondary)] tracking-wider mb-1">対象のお悩み</dt>
                <dd className="font-serif text-base text-[var(--color-brand-dark)]">{machine.target_concerns}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      {/* ── 2カラム：メイン + サイドバー ── */}
      <div className="section-container py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* ── メインコンテンツ ── */}
          <div className="flex-1 min-w-0 space-y-14 md:space-y-20">

            {/* マシン画像 */}
            {machine.thumbnail && (
              <section className="flex justify-center">
                <div className="relative w-full aspect-video bg-[var(--color-brand-cream)] rounded-sm overflow-hidden">
                  <Image
                    src={machine.thumbnail.url}
                    alt={machine.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 640px"
                    priority
                  />
                </div>
              </section>
            )}

            {/* 説明 */}
            <section>
              <RichContent html={machine.description} className={`machine-description ${PROSE_STYLE}`} />
            </section>
          </div>

          {/* ── サイドバー ── */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* キャンペーン枠 */}
              <SidebarCampaign campaigns={campaigns} />

              {/* 他のマシン */}
              {otherMachines.length > 0 && (
                <div className="border border-[var(--color-brand-brown)]/10 rounded-sm">
                  <div className="px-4 py-3 border-b border-[var(--color-brand-brown)]/10">
                    <p className="text-xs tracking-[0.15em] text-[var(--color-brand-dark)] font-medium">
                      その他のマシン
                    </p>
                  </div>
                  <ul className="divide-y divide-[var(--color-brand-brown)]/5">
                    {otherMachines.map((m) => (
                      <li key={m.id}>
                        <Link
                          href={`/machine/${m.slug}`}
                          className="block px-4 py-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-cream)]/50 transition-colors"
                        >
                          {m.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

        </div>
      </div>

      {/* ── CTA ── */}
      <ConsultationCTA subtitle="マシン治療について、お気軽にカウンセリングでご相談ください。" />
    </article>
  );
}
