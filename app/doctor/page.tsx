import type { Metadata } from "next";
import Link from "next/link";
import { ScrollFadeIn } from "@/components/ui/ScrollFadeIn";
import Image from "next/image";
import { getBlogList } from "@/lib/microcms/client";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "院長紹介｜Maison PUREJU 銀座の美容外科・美容皮膚科",
  description:
    "Maison PUREJU 院長・廣瀬雅史のプロフィール。形成外科専門医・美容外科学会（JSAPS）専門医として、銀座で本質的な美容医療を提供しています。",
};

const CAREER = [
  { year: "2010", content: "奈良県立医科大学医学部医学科 卒業・医師免許取得" },
  { year: "2010", content: "神戸大学医学部附属病院ならびに関連病院 研修" },
  { year: "2012", content: "神鋼病院 形成外科" },
  { year: "2013", content: "兵庫県立淡路医療センター 形成外科" },
  { year: "2014", content: "兵庫県立加古川医療センター 形成外科" },
  { year: "2016", content: "聖隷三方原病院 形成外科 / 形成外科学会専門医 取得" },
  { year: "2017", content: "倉敷平成病院 形成外科・美容外科" },
  { year: "2018", content: "聖心美容クリニック（東京本院）" },
  { year: "2021", content: "THE ONE. 技術指導医" },
  { year: "2023", content: "Maison PUREJU 開院" },
];

const QUALIFICATIONS = [
  "形成外科学会専門医",
  "美容外科学会（JSAPS）専門医",
];

const AFFILIATIONS = [
  "美容外科学会（JSAPS・JSAS）",
  "形成外科学会",
  "美容皮膚科学会",
  "皮膚科学会",
  "抗加齢医学会",
];


export default async function DoctorPage() {
  const blogData = await getBlogList({
    filters: "slug[contains]doctor",
    orders: "-published_at",
    limit: 3,
  });
  const doctorBlogs = blogData.contents;
  return (
    <>
      {/* ===== Hero ===== */}
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
            <Link href="/" className="hover:text-[var(--color-brand-gold)] transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-[var(--color-text-secondary)]">院長紹介</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">DIRECTOR</p>
          <h1 className="font-serif text-3xl md:text-4xl tracking-widest text-[var(--color-brand-dark)] mb-4 leading-relaxed">
            院長紹介
          </h1>
          <p className="text-sm tracking-wide text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            形成外科専門医として培った確かな技術と、<br className="hidden md:block" />
            美容医療への深い知識で、あなたの「変わりたい」を支えます。
          </p>
        </div>
      </section>

      {/* ===== プロフィール + 経歴 ===== */}
      <section className="py-16 md:py-24 bg-[var(--color-brand-white)]">
        <div className="section-container">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">

            {/* 左カラム: プロフィール（スティッキー） */}
            <ScrollFadeIn>
              <div className="md:sticky md:top-28 md:w-64 shrink-0">
                {/* 円形写真 */}
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden mx-auto md:mx-0 mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/staff/hirose.jpg"
                    alt="院長 廣瀬 雅史"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* 名前 */}
                <div className="text-center md:text-left">
                  <p className="font-en text-[0.6rem] tracking-[0.3em] text-[var(--color-brand-gold)] mb-2">DIRECTOR</p>
                  <p className="font-serif text-2xl text-[var(--color-brand-dark)] mb-1">廣瀬 雅史</p>
                  <p className="font-en text-sm tracking-wider text-[var(--color-text-secondary)] mb-5">Masashi Hirose</p>
                  <div className="flex flex-col gap-2">
                    {QUALIFICATIONS.map((q) => (
                      <span key={q} className="inline-flex items-center gap-2 text-xs text-[var(--color-text-secondary)] justify-center md:justify-start">
                        <span className="w-1 h-1 rounded-full bg-[var(--color-brand-gold)] shrink-0" />
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollFadeIn>

            {/* 右カラム: メッセージ + 縦タイムライン */}
            <div className="flex-1 min-w-0">
              {/* メッセージ */}
              <ScrollFadeIn>
                <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-5">MESSAGE</p>
                <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-6 leading-relaxed">
                  本質を極めた、<br />あなただけの美の追求。
                </h2>
                <div className="w-10 h-px bg-[var(--color-brand-gold)] mb-7" />
                <div className="space-y-4 text-sm text-[var(--color-text-secondary)] leading-[2.2] mb-14">
                  <p>私は、美容医療を単なる施術ではなく、患者様一人ひとりの人生を豊かにするものだと考えています。</p>
                  <p>学生時代から「最高の美容外科医になる」と決意し、安全で質の高い手術を提供するために、美容外科の基礎である形成外科専門医の道を選択。外傷・腫瘍・先天異常など難度の高い手術を日常的に扱う形成外科で、技術と知識を徹底的に習得しました。</p>
                  <p>外科だけでなく皮膚科にも精通しているため、表面的な医療ではなく学術的な根拠のもと、一人ひとりのお悩みに最適な施術をご提案します。</p>
                </div>
              </ScrollFadeIn>

              {/* 縦タイムライン */}
              <ScrollFadeIn>
                <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-8">CAREER</p>
              </ScrollFadeIn>
              <div className="relative">
                {/* 縦ライン */}
                <div className="absolute left-[0.4rem] top-2 bottom-2 w-px bg-[var(--color-brand-gold)]/25" />

                <div className="space-y-0">
                  {CAREER.map((item, i) => (
                    <ScrollFadeIn key={i} delay={i * 0.04}>
                      <div className="relative flex gap-5 pb-8">
                        {/* ドット */}
                        <div className="w-3.5 h-3.5 rounded-full bg-[var(--color-brand-dark)] border-2 border-[var(--color-brand-gold)] shrink-0 mt-1 z-10" />
                        {/* 内容 */}
                        <div>
                          <p className="font-en text-base text-[var(--color-brand-gold)] tracking-wider tabular-nums mb-1">
                            {item.year}
                          </p>
                          <p className="text-sm text-[var(--color-brand-dark)] leading-relaxed">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    </ScrollFadeIn>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== 資格・所属学会 ===== */}
      <section className="py-16 md:py-24 bg-[var(--color-brand-white)]">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 max-w-3xl">
            <ScrollFadeIn>
              <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">QUALIFICATIONS</p>
              <h2 className="font-serif text-xl text-[var(--color-brand-dark)] mb-8 tracking-widest">資格・専門医</h2>
              <ul className="space-y-3">
                {QUALIFICATIONS.map((q) => (
                  <li key={q} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-brand-gold)] mt-0.5 shrink-0">—</span>
                    {q}
                  </li>
                ))}
              </ul>
            </ScrollFadeIn>

            <ScrollFadeIn delay={0.1}>
              <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">AFFILIATIONS</p>
              <h2 className="font-serif text-xl text-[var(--color-brand-dark)] mb-8 tracking-widest">所属学会</h2>
              <ul className="space-y-3">
                {AFFILIATIONS.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-brand-gold)] mt-0.5 shrink-0">—</span>
                    {a}
                  </li>
                ))}
              </ul>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ===== 院長ブログ ===== */}
      {doctorBlogs.length > 0 && (
        <section className="py-16 md:py-24 bg-[var(--color-brand-cream)]">
          <div className="section-container">
            <ScrollFadeIn>
              <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">DOCTOR&apos;S BLOG</p>
              <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-14 tracking-widest">
                院長ブログ
              </h2>
            </ScrollFadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {doctorBlogs.map((post, i) => {
                const categories = Array.isArray(post.category) ? post.category : [post.category];
                return (
                  <ScrollFadeIn key={post.id} delay={i * 0.1}>
                    <Link
                      href={`/doctor-blog/${post.slug}`}
                      className="group block bg-white border border-[var(--color-brand-brown)]/10 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                    >
                      <div className="relative aspect-square bg-[var(--color-brand-cream)] overflow-hidden">
                        <Image
                          src={post.thumbnail.url}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="px-5 py-5">
                        <div className="flex items-center gap-2.5 mb-3">
                          <span className="text-[0.6rem] tracking-[0.2em] text-[var(--color-brand-gold)]">
                            {categories.filter(Boolean).join(" / ")}
                          </span>
                          <time className="text-[0.6rem] text-[var(--color-text-secondary)]/50 tracking-wider">
                            {new Date(post.published_at).toLocaleDateString("ja-JP", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }).replace(/\//g, ".")}
                          </time>
                        </div>
                        <p className="text-sm font-light text-[var(--color-brand-dark)] leading-relaxed tracking-wide group-hover:text-[var(--color-brand-gold)] transition-colors line-clamp-2">
                          {post.title}
                        </p>
                      </div>
                    </Link>
                  </ScrollFadeIn>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/doctor-blog"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-brand-gold)] hover:underline underline-offset-4 font-light tracking-wide"
              >
                院長ブログをもっと見る →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <ConsultationCTA subtitle="まずはカウンセリングでお気軽にご相談ください。" />
    </>
  );
}
