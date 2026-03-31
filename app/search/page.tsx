import Link from "next/link";
import Image from "next/image";
import { searchTreatments, searchColumns } from "@/lib/microcms/client";
import { searchPriceItems } from "@/lib/supabase/queries";
import { searchFaqPage } from "@/lib/faq-page-data";
import { SearchBar } from "@/components/sections/SearchBar";

const PILLAR_LABELS: Record<string, string> = {
  mouth: "口元",
  eye: "目元",
  nose: "鼻",
  lift: "リフトアップ",
  skin: "美容皮膚科",
};

const PRICE_SECTION_ANCHOR: Record<string, string> = {
  皮膚科: "hifuka",
  外科: "geka",
  点滴: "tenteki",
  内服薬: "naifuku",
  化粧品: "keshouhin",
  その他: "sonota",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const keyword = q?.trim() ?? "";

  const [treatmentResults, columnResults, priceResults] = keyword
    ? await Promise.all([
        searchTreatments(keyword),
        searchColumns(keyword),
        searchPriceItems(keyword),
      ])
    : [null, null, null];

  const faqResults = keyword ? searchFaqPage(keyword) : null;

  const totalCount =
    (treatmentResults?.totalCount ?? 0) +
    (columnResults?.totalCount ?? 0) +
    (priceResults?.length ?? 0) +
    (faqResults?.length ?? 0);

  return (
    <div className="py-16 md:py-24">
      <div className="section-container">
        <h1 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] text-center mb-10">
          施術を検索
        </h1>

        <SearchBar />

        {keyword && (
          <div className="mt-12 space-y-16">
            <p className="text-sm text-[var(--color-text-secondary)]">
              「{keyword}」の検索結果：{totalCount}件
            </p>

            {/* ── 施術料金 ── */}
            {priceResults && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-6 bg-[var(--color-brand-gold)]" />
                  <h2 className="font-serif text-xl text-[var(--color-brand-dark)] tracking-wide">施術料金</h2>
                  <span className="text-xs text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/40 px-2 py-0.5">{priceResults.length}件</span>
                </div>
                {priceResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {priceResults.map((item, i) => {
                      const anchor = PRICE_SECTION_ANCHOR[item.section] ?? "";
                      const priceUrl = anchor
                        ? `/price?tab=${encodeURIComponent(item.sub_tab)}&q=${encodeURIComponent(keyword)}#${anchor}`
                        : `/price?q=${encodeURIComponent(keyword)}`;
                      return (
                      <Link
                        key={i}
                        href={priceUrl}
                        className="group border border-[var(--color-brand-brown)]/10 p-5 hover:border-[var(--color-brand-gold)]/30 transition-colors"
                      >
                        <p className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)] mb-1">
                          {item.section}
                          {item.sub_tab ? ` / ${item.sub_tab}` : ""}
                        </p>
                        <p className="text-sm font-medium text-[var(--color-brand-dark)] mb-2 group-hover:text-[var(--color-brand-gold)] transition-colors">
                          {item.category}
                        </p>
                        {item.option && (
                          <p className="text-xs text-[var(--color-text-secondary)] mb-2">{item.option}</p>
                        )}
                        <p className="text-base font-light text-[var(--color-brand-dark)]">{item.price}</p>
                      </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-text-secondary)] py-4">該当する料金情報が見つかりませんでした</p>
                )}
              </section>
            )}

            {/* ── 施術記事 ── */}
            {treatmentResults && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-6 bg-[var(--color-brand-gold)]" />
                  <h2 className="font-serif text-xl text-[var(--color-brand-dark)] tracking-wide">施術記事</h2>
                  <span className="text-xs text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/40 px-2 py-0.5">{treatmentResults.totalCount}件</span>
                </div>
                {treatmentResults.contents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {treatmentResults.contents.map((treatment) => {
                      const pillar = Array.isArray(treatment.pillar) ? treatment.pillar[0] : treatment.pillar;
                      return (
                        <Link
                          key={treatment.id}
                          href={`/${pillar}/${treatment.slug}`}
                          className="group bg-white border border-[var(--color-brand-brown)]/10 overflow-hidden hover:border-[var(--color-brand-gold)]/30 transition-colors"
                        >
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
                          <div className="p-5">
                            <span className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)]">
                              {PILLAR_LABELS[pillar] ?? pillar}
                            </span>
                            <h3 className="font-serif text-base text-[var(--color-brand-dark)] mt-1 mb-2 group-hover:text-[var(--color-brand-gold)] transition-colors">
                              {treatment.title}
                            </h3>
                            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
                              {treatment.catch_copy}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-text-secondary)] py-4">該当する施術記事が見つかりませんでした</p>
                )}
              </section>
            )}

            {/* ── 美容コラム ── */}
            {columnResults && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-6 bg-[var(--color-brand-gold)]" />
                  <h2 className="font-serif text-xl text-[var(--color-brand-dark)] tracking-wide">美容コラム</h2>
                  <span className="text-xs text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/40 px-2 py-0.5">{columnResults.totalCount}件</span>
                </div>
                {columnResults.contents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {columnResults.contents.map((col) => (
                      <Link
                        key={col.id}
                        href={`/column/${col.slug}`}
                        className="group bg-white border border-[var(--color-brand-brown)]/10 overflow-hidden hover:border-[var(--color-brand-gold)]/30 transition-colors"
                      >
                        <div className="relative w-full aspect-square bg-[var(--color-brand-cream)] overflow-hidden">
                          {col.thumbnail ? (
                            <Image
                              src={col.thumbnail.url}
                              alt={col.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[var(--color-text-secondary)]/30 text-xs tracking-[0.25em]">PHOTO</span>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {col.category.map((cat) => (
                              <span key={cat} className="text-[10px] tracking-[0.15em] text-[var(--color-brand-gold)]">{cat}</span>
                            ))}
                          </div>
                          <h3 className="text-sm text-[var(--color-brand-dark)] leading-relaxed line-clamp-2 group-hover:text-[var(--color-brand-gold)] transition-colors">
                            {col.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-text-secondary)] py-4">該当するコラムが見つかりませんでした</p>
                )}
              </section>
            )}

            {/* ── よくある質問 ── */}
            {faqResults && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-6 bg-[var(--color-brand-gold)]" />
                  <h2 className="font-serif text-xl text-[var(--color-brand-dark)] tracking-wide">よくある質問</h2>
                  <span className="text-xs text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/40 px-2 py-0.5">{faqResults.length}件</span>
                </div>
                {faqResults.length > 0 ? (
                  <div className="space-y-4">
                    {faqResults.map((item, i) => (
                      <Link
                        key={i}
                        href={`/column/faq#faq-${item.catId}-${item.itemIndex}`}
                        className="group block border border-[var(--color-brand-brown)]/10 p-5 hover:border-[var(--color-brand-gold)]/30 transition-colors"
                      >
                        <p className="text-sm font-medium text-[var(--color-brand-dark)] mb-2 group-hover:text-[var(--color-brand-gold)] transition-colors">
                          Q. {item.q}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
                          {item.a}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-text-secondary)] py-4">該当するFAQが見つかりませんでした</p>
                )}
              </section>
            )}

            {/* 全セクションで0件 */}
            {totalCount === 0 && (
              <p className="text-sm text-[var(--color-text-secondary)] py-8 text-center">
                「{keyword}」に該当する情報が見つかりませんでした
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
