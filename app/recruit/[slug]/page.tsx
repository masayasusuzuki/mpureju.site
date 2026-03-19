import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getRecruitBySlug, getRecruitList, getRecruitListAll } from "@/lib/microcms/client";

export async function generateStaticParams() {
  const data = await getRecruitListAll();
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
  const job = await getRecruitBySlug(slug);
  if (!job) return {};
  return {
    title: `${job.title}の求人`,
    description: job.tagline,
  };
}

/* ── 共通福利厚生 ── */
const COMMON_BENEFITS = [
  "交通費支給",
  "社会保険完備",
  "社員割引（施術・化粧品）",
  "有給休暇",
  "年末年始休暇",
  "研修制度あり",
];

export default async function RecruitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getRecruitBySlug(slug);
  if (!job) notFound();

  const employmentType = Array.isArray(job.employment_type)
    ? job.employment_type[0]
    : job.employment_type;

  // 他の募集中職種
  const allJobs = await getRecruitList();
  const otherJobs = allJobs.contents.filter((j) => j.id !== job.id);

  const location = job.location || "東京都中央区銀座";

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(150deg, #fdfcfa 0%, #f0e8d8 60%, #e8dcc8 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 90% 10%, rgba(201,169,110,0.12) 0%, transparent 55%)" }}
        />
        <div className="relative section-container py-12 md:py-16">
          <nav className="flex items-center gap-2 text-xs mb-8 tracking-wider text-[var(--color-text-secondary)]/60">
            <Link href="/" className="hover:text-[var(--color-brand-gold)] transition-colors">
              HOME
            </Link>
            <span>/</span>
            <Link href="/recruit" className="hover:text-[var(--color-brand-gold)] transition-colors">
              採用情報
            </Link>
            <span>/</span>
            <span className="text-[var(--color-text-secondary)]">{job.title}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] px-3 py-1 tracking-wider">
              {employmentType}
            </span>
            {!job.is_active && (
              <span className="text-xs bg-red-100 text-red-600 px-3 py-1 tracking-wider">
                募集終了
              </span>
            )}
          </div>
          <h1 className="font-en text-4xl md:text-5xl tracking-widest text-[var(--color-brand-dark)] mb-4 leading-none">
            {job.title}
          </h1>
          <p className="text-sm tracking-wide text-[var(--color-text-secondary)]">
            {job.tagline}
          </p>
        </div>
      </section>

      {/* ── メインコンテンツ ── */}
      <div className="section-container py-12 md:py-16">
        <div className="max-w-3xl">

          {/* 募集終了バナー */}
          {!job.is_active && (
            <div className="bg-red-50 border border-red-200 px-6 py-4 mb-10 rounded-sm">
              <p className="text-sm text-red-700">
                ※ 現在この職種は募集しておりません。再募集の際は改めてお知らせいたします。
              </p>
            </div>
          )}

          {/* 画像 */}
          {job.image && (
            <div className="relative w-full aspect-video mb-10">
              <Image
                src={job.image.url}
                alt={job.title}
                fill
                className="object-cover rounded-sm"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          {/* 各項目 */}
          <div className="space-y-10">
            {/* 業務内容 */}
            <DetailSection title="業務内容">
              <div
                className="prose prose-neutral max-w-none prose-p:text-[var(--color-text-secondary)] prose-p:leading-[1.9] prose-li:text-[var(--color-text-secondary)]"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </DetailSection>

            {/* 勤務時間 */}
            <DetailSection title="勤務時間">
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
                {job.working_hours}
              </p>
            </DetailSection>

            {/* 給与 */}
            {job.salary && (
              <DetailSection title="給与">
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
                  {job.salary}
                </p>
              </DetailSection>
            )}

            {/* 勤務地 */}
            <DetailSection title="勤務地">
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {location}
              </p>
            </DetailSection>

            {/* 応募条件 */}
            <DetailSection title="応募条件">
              <div
                className="prose prose-neutral max-w-none prose-p:text-[var(--color-text-secondary)] prose-p:leading-[1.9] prose-li:text-[var(--color-text-secondary)]"
                dangerouslySetInnerHTML={{ __html: job.requirements }}
              />
            </DetailSection>

            {/* 福利厚生 */}
            <DetailSection title="福利厚生">
              {job.benefits && (
                <div
                  className="prose prose-neutral max-w-none prose-p:text-[var(--color-text-secondary)] prose-p:leading-[1.9] prose-li:text-[var(--color-text-secondary)] mb-4"
                  dangerouslySetInnerHTML={{ __html: job.benefits }}
                />
              )}
              <div className="flex flex-wrap gap-2">
                {COMMON_BENEFITS.map((b) => (
                  <span
                    key={b}
                    className="text-xs bg-[var(--color-brand-cream)]/60 text-[var(--color-brand-dark)] px-3 py-1.5 rounded-sm"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </DetailSection>

            {/* 応募方法 */}
            <DetailSection title="応募方法">
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                応募フォームより、履歴書・職務経歴書を添付の上ご応募ください。
              </p>
              <Link
                href="/recruit/entry"
                className="inline-block mt-2 text-sm text-[var(--color-brand-gold)] hover:underline underline-offset-4"
              >
                応募フォームはこちら →
              </Link>
            </DetailSection>
          </div>

          {/* CTA */}
          {job.is_active && (
            <div className="mt-14">
              <Link
                href="/recruit/entry"
                className="inline-flex items-center justify-center gap-4 min-w-[280px] py-4 bg-[var(--color-brand-dark)] text-white text-sm tracking-widest rounded-full hover:opacity-90 transition-opacity"
              >
                エントリーはこちら
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          )}

          {/* 戻るリンク */}
          <div className="mt-12 pt-8 border-t border-[var(--color-brand-brown)]/10">
            <Link
              href="/recruit"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              採用情報一覧に戻る
            </Link>
          </div>
        </div>
      </div>

      {/* ── 他の募集中の職種 ── */}
      {otherJobs.length > 0 && (
        <section className="bg-[var(--color-brand-cream)] py-14 md:py-16">
          <div className="section-container">
            <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] text-center mb-8 tracking-wide">
              他の募集中の職種
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherJobs.map((other) => {
                const otherType = Array.isArray(other.employment_type)
                  ? other.employment_type[0]
                  : other.employment_type;
                return (
                  <Link
                    key={other.id}
                    href={`/recruit/${other.slug}`}
                    className="group bg-white p-6 border border-[var(--color-brand-brown)]/10 hover:border-[var(--color-brand-gold)]/40 transition-colors"
                  >
                    <span className="text-xs bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] px-3 py-1 tracking-wider">
                      {otherType}
                    </span>
                    <h3 className="font-serif text-lg text-[var(--color-brand-dark)] mt-3 mb-1 group-hover:text-[var(--color-brand-gold)] transition-colors">
                      {other.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {other.tagline}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/* ── 詳細セクション共通コンポーネント ── */
function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-base font-medium text-[var(--color-brand-dark)] mb-4 pb-2 border-b border-[var(--color-brand-gold)]/30 tracking-wide">
        {title}
      </h2>
      {children}
    </div>
  );
}
