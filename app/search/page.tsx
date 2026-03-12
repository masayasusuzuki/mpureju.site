import Link from "next/link";
import { searchTreatments } from "@/lib/microcms/client";
import { SearchBar } from "@/components/sections/SearchBar";

const PILLAR_LABELS: Record<string, string> = {
  mouth: "口元",
  eye: "目元",
  nose: "鼻",
  lift: "リフトアップ",
  skin: "美容皮膚科",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const keyword = q?.trim() ?? "";
  const results = keyword ? await searchTreatments(keyword) : null;

  return (
    <div className="py-16 md:py-24">
      <div className="section-container">
        <h1 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] text-center mb-10">
          施術を検索
        </h1>

        <SearchBar />

        {/* 検索結果 */}
        {keyword && results && (
          <div className="mt-12">
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              「{keyword}」の検索結果：{results.totalCount}件
            </p>

            {results.contents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.contents.map((treatment) => {
                  const pillar = Array.isArray(treatment.pillar) ? treatment.pillar[0] : treatment.pillar;
                  return (
                    <Link
                      key={treatment.id}
                      href={`/${pillar}/${treatment.slug}`}
                      className="group bg-white border border-[var(--color-brand-brown)]/10 overflow-hidden hover:border-[var(--color-brand-gold)]/30 transition-colors"
                    >
                      {/* サムネイル */}
                      <div className="relative w-full aspect-video bg-[var(--color-brand-cream)] overflow-hidden">
                        {treatment.hero_image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={treatment.hero_image.url}
                            alt={treatment.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[var(--color-text-secondary)]/30 text-xs tracking-[0.25em]">PHOTO</span>
                          </div>
                        )}
                      </div>
                      {/* テキスト */}
                      <div className="p-5">
                        <span className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)]">
                          {PILLAR_LABELS[pillar] ?? pillar}
                        </span>
                        <h2 className="font-serif text-base text-[var(--color-brand-dark)] mt-1 mb-2 group-hover:text-[var(--color-brand-gold)] transition-colors">
                          {treatment.title}
                        </h2>
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
                          {treatment.catch_copy}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text-secondary)] py-8 text-center">
                該当する施術が見つかりませんでした
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
