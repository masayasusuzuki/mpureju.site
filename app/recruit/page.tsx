import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollFadeIn } from "@/components/ui/ScrollFadeIn";
import { ValuesCarousel } from "@/components/sections/ValuesCarousel";
import { PositionAccordion } from "@/components/sections/PositionAccordion";
import { getStaffBlogList } from "@/lib/microcms/client";

export const metadata: Metadata = {
  title: "採用情報",
  description:
    "Maison PUREJU（銀座）の採用情報。看護師・受付カウンセラー・広報など、美容クリニックで一緒に働く仲間を募集しています。",
};

/* ── 募集職種 ── */
const POSITIONS = [
  {
    id: "nurse",
    title: "看護師",
    tagline: "銀座で働く美容ナース募集｜未経験からプロの美容医療へ",
    employmentType: "正社員",
    tasks: [
      "採血 / 点滴",
      "医療機器による処置",
      "医師のサポート / 手術介助等看護業務全般",
      "その他クリニック業務全般",
    ],
    hours: "9:45〜18:45（休憩1h、固定残業代：なし）",
    salary: "35万円〜 ※前職給与も含め総合判断します（試用期間6ヶ月、条件別途）",
  },
  {
    id: "receptionist",
    title: "受付カウンセラー",
    tagline: "銀座の美容クリニック受付カウンセラー募集｜未経験歓迎・社割あり",
    employmentType: "正社員",
    tasks: [
      "受付対応",
      "カウンセリング業務",
      "契約業務 / 会計",
      "予約受付 / 電話対応",
    ],
    hours: "9:45〜18:45（休憩1h、固定残業代：なし）",
    salary: "26万円〜 ※前職給与も含め総合判断します（試用期間6ヶ月、条件別途）",
  },
  {
    id: "pr-creator",
    title: "広報 / SNSクリエイター",
    tagline: "SNS運用・動画編集クリエイター募集｜銀座から美容医療の魅力を発信",
    employmentType: "正社員",
    tasks: [
      "クリニックの広報業務全般",
      "SNS投稿撮影 / 編集",
    ],
    hours: "9:45〜18:45（休憩1h、固定残業代：なし）",
    salary: "給与はお問い合わせください ※前職給与も含め総合判断します（試用期間6ヶ月、条件別途）",
    requirements: [
      "WEBデザインソフトを使用可能",
      "美容クリニック1年以上経験",
      "SNSクリエイター：動画編集技術",
    ],
    preferred: [
      "スチール・ムービー撮影の技術",
      "動画編集経験（Premiere、Final Cutなど）",
      "画像編集経験（Photoshop、Lightroom、Canvaなど）",
      "SNS運用経験（YouTube、Instagram、TikTok）",
      "ライティング能力",
    ],
  },
];

/* ── 働く魅力 ── */
const VALUES = [
  {
    title: "患者様の人生が変わる瞬間に立ち会える",
    description:
      "美容医療は見た目だけでなく、患者様の自信や生き方まで変えていく仕事です。「来てよかった」の一言が、日々のやりがいになります。",
  },
  {
    title: "専門医のそばで日々成長を実感できる",
    description:
      "形成外科専門医である院長のすぐ近くで働くからこそ、技術や知識が自然と身についていく。自分自身の成長を毎日感じられる環境です。",
  },
  {
    title: "働きながら、自分自身もキレイになれる",
    description:
      "毎月5万円の美容施術手当に加え、施術や化粧品の社員割引も。自分自身が美容医療を体験できるから、患者様へのご案内にも説得力が生まれます。",
  },
];

/* ── 求める人材像 ── */
const IDEAL_CANDIDATE = [
  {
    number: "01",
    en: "Harmony",
    ja: "調和",
    text: "思いやりを持って、まわりと調和しながら働ける方",
  },
  {
    number: "02",
    en: "Empathy",
    ja: "寄り添い",
    text: "お客様の心に寄り添い、真摯に向き合える方",
  },
  {
    number: "03",
    en: "Growth",
    ja: "成長",
    text: "新しい知識や技術を前向きに学び、成長を楽しめる方",
  },
];

const CANDIDATE_MESSAGE = [
  "最先端の美容皮膚科レーザー治療から専門性の高い美容外科手術まで、幅広い施術を提供しています。常に学びと成長を実感できる、やりがいある職場です。",
  "皆様の能力と貢献は正当に評価され、昇給制度に反映しております。経験者は優遇いたしますので、これまでのご経験を活かし、さらなる高みを目指したい方は、ぜひお気軽にお問い合わせください。",
];

/* ── 共通福利厚生 ── */
const COMMON_BENEFITS = [
  "交通費支給",
  "社会保険完備",
  "社員割引（施術・化粧品）",
  "美容施術手当（月5万円）",
  "有給休暇",
  "年末年始休暇",
  "研修制度あり",
];

/* ── 選考フロー ── */
const SELECTION_STEPS = [
  { label: "エントリー", description: "応募フォームから必要事項を送信" },
  { label: "書類選考", description: "履歴書・職務経歴書を確認" },
  { label: "面接", description: "対面またはオンライン" },
  { label: "内定", description: "条件のご提示" },
  { label: "入社", description: "勤務開始" },
];

export default async function RecruitPage() {
  const staffBlogData = await getStaffBlogList({ limit: 3 });
  const staffBlogs = staffBlogData.contents;
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
            <span className="text-[var(--color-text-secondary)]">採用情報</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            RECRUIT
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-widest text-[var(--color-brand-dark)] mb-4 leading-tight">
            採用情報
          </h1>
          <p className="text-sm md:text-base tracking-wide text-[var(--color-text-secondary)] leading-relaxed">
            ALL for YOU — あなたの&ldquo;本気&rdquo;が、誰かの人生を変える
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-16 md:py-24 bg-[var(--color-brand-cream)] overflow-hidden">
        <div className="section-container">
          <SectionHeading en="Mission" ja="私たちの使命" number="01" className="mb-14" />

          <ScrollFadeIn>
            <div className="flex flex-col md:flex-row gap-0">
              <div
                className="relative w-full md:w-5/12 aspect-square shrink-0 overflow-hidden bg-[var(--color-brand-cream)]"
                style={{ clipPath: "polygon(0 0, calc(100% - 3.5rem) 0, 100% 3.5rem, 100% 100%, 0 100%)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[var(--color-text-secondary)]/25 text-xs tracking-[0.25em]">PHOTO</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center py-10 md:py-14 md:pl-12 lg:pl-16">
                <p
                  className="font-en text-8xl md:text-9xl leading-none text-[var(--color-brand-dark)] select-none mb-1"
                  style={{ opacity: 0.06 }}
                  aria-hidden="true"
                >
                  Mission
                </p>
                <div className="w-8 h-px bg-[var(--color-brand-gold)] mb-6" />

                <p className="font-serif text-lg md:text-xl leading-relaxed text-[var(--color-brand-dark)] mb-8">
                  患者様の心に寄り添い、
                  <br />
                  お悩みのその先に広がる
                  <br />
                  「なりたい自分」を共に叶える
                </p>

                <div className="mb-6">
                  <p className="text-xs tracking-widest text-[var(--color-brand-gold)] mb-2">院長</p>
                  <p className="font-serif text-xl text-[var(--color-brand-dark)]">廣瀬 雅史</p>
                  <p className="font-en text-sm tracking-wider text-[var(--color-text-secondary)] mt-1">Masashi Hirose</p>
                </div>

                <p className="text-sm text-[var(--color-text-secondary)] leading-[2.2] font-light max-w-md">
                  あなたの人生を豊かにする美容医療。自信と輝きをもたらしてくれます。それが美容医療の本質的な価値です。今までの美容クリニックの枠にとらわれず、私達は皆様にその感動体験を届けます。
                </p>

                <p className="mt-6 text-xs text-[var(--color-text-secondary)]/50 leading-relaxed max-w-md">
                  &ldquo;Maison&rdquo;は家やオートクチュールの店という意味。皆さんが安心して美容医療を受けられる「家」になれるようにという想いを込めています。
                </p>
              </div>
            </div>
          </ScrollFadeIn>

        </div>
      </section>

      {/* ── 働く魅力 ── */}
      <section
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #fdfcfa 0%, #f5ede0 100%)" }}
      >
        <div className="section-container mb-14">
          <SectionHeading en="Why Maison PUREJU?" ja="働く魅力" number="02" />
        </div>
        <ValuesCarousel items={VALUES} />
      </section>

      {/* ── スタッフブログ ── */}
      {staffBlogs.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="section-container">
            <SectionHeading en="Staff Blog" ja="スタッフブログ" number="03" className="mb-14" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {staffBlogs.map((post, i) => (
                <ScrollFadeIn key={post.id} delay={i * 0.1}>
                  <Link href={`/recruit/staff-blog/${post.slug}`} className="block bg-[var(--color-brand-cream)] overflow-hidden h-full group">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={post.thumbnail.url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="px-5 py-4">
                      <p className="font-serif text-sm text-[var(--color-brand-dark)] leading-relaxed line-clamp-2 group-hover:text-[var(--color-brand-gold)] transition-colors">
                        {post.title}
                      </p>
                    </div>
                  </Link>
                </ScrollFadeIn>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/recruit/staff-blog"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-brand-gold)] hover:underline underline-offset-4 font-light tracking-wide"
              >
                スタッフブログをもっと見る →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 求める人材像 ── */}
      <section className="py-16 md:py-24 bg-[var(--color-brand-cream)]">
        <div className="section-container">
          <SectionHeading en="Ideal Candidate" ja="求める人材像" number="04" className="mb-14" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-14">
            {IDEAL_CANDIDATE.map((item, i) => (
              <ScrollFadeIn key={i} delay={i * 0.1}>
                <div className="relative bg-[var(--color-brand-cream)] px-7 py-10 md:py-12 h-full">
                  <p
                    className="font-en text-5xl md:text-6xl leading-none text-[var(--color-brand-dark)] select-none"
                    style={{ opacity: 0.06 }}
                    aria-hidden="true"
                  >
                    {item.number}
                  </p>
                  <div className="w-6 h-px bg-[var(--color-brand-gold)] mt-4 mb-5" />
                  <p className="font-en text-sm tracking-[0.2em] text-[var(--color-brand-gold)] mb-1">
                    {item.en}
                  </p>
                  <p className="font-serif text-base text-[var(--color-brand-dark)] mb-5 tracking-wider">
                    {item.ja}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-[2] font-light">
                    {item.text}
                  </p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>

          <ScrollFadeIn>
            <div className="max-w-3xl space-y-4">
              {CANDIDATE_MESSAGE.map((msg, i) => (
                <p key={i} className="text-sm text-[var(--color-text-secondary)] leading-[2.2] font-light">
                  {msg}
                </p>
              ))}
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ── 募集中の職種 ── */}
      <section
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #f7f0e6 0%, #fdfcfa 100%)" }}
      >
        <div className="section-container">
          <SectionHeading en="Open Positions" ja="募集中の職種" number="05" className="mb-14" />
          <div className="max-w-3xl">
            <PositionAccordion positions={POSITIONS} />
          </div>
        </div>
      </section>

      {/* ── 福利厚生 ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-container">
          <SectionHeading en="Benefits" ja="福利厚生" number="06" className="mb-14" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[var(--color-brand-brown)]/10">
            {COMMON_BENEFITS.map((item, i) => (
              <ScrollFadeIn key={item} delay={i * 0.04}>
                <div className="flex items-center gap-3 bg-[var(--color-brand-white)] px-5 py-5">
                  <span className="text-[var(--color-brand-gold)]">—</span>
                  <span className="text-sm text-[var(--color-brand-dark)] tracking-wide font-light">{item}</span>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 選考フロー ── */}
      <section
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #f7f0e6 0%, #fdfcfa 100%)" }}
      >
        <div className="section-container">
          <SectionHeading en="Flow" ja="選考フロー" number="07" className="mb-14" />
          <ScrollFadeIn>
            <div className="flex flex-col md:flex-row items-start md:items-stretch gap-0">
              {SELECTION_STEPS.map((s, i) => (
                <div key={s.label} className="flex items-start md:items-stretch flex-1">
                  <div className="flex flex-col items-center text-center flex-1 py-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-brand-gold)] text-white text-sm font-medium flex items-center justify-center mb-3">
                      {i + 1}
                    </div>
                    <p className="font-serif text-sm md:text-base text-[var(--color-brand-dark)] font-semibold mb-1">
                      {s.label}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] font-light leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                  {i < SELECTION_STEPS.length - 1 && (
                    <div className="hidden md:flex items-center px-2 pt-5">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[var(--color-brand-gold)] opacity-40">
                        <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollFadeIn>
          <div className="mt-10 text-center md:text-left">
            <Link
              href="/recruit/entry"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-brand-gold)] hover:underline underline-offset-4 font-light"
            >
              応募フォームはこちら →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 bg-[var(--color-brand-cream)]">
        <div className="section-container text-center">
          <p
            className="font-en text-6xl md:text-7xl leading-none text-[var(--color-brand-gold)] select-none mb-4"
            style={{ opacity: 0.12 }}
            aria-hidden="true"
          >
            Entry
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-4 leading-relaxed tracking-wide">
            ご応募・ご質問はお気軽にどうぞ
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-10 leading-relaxed font-light">
            美容医療に情熱を持ち、ともに成長していける仲間をお待ちしています。
          </p>
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
      </section>
    </>
  );
}
