import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maison PUREJU｜銀座の美容外科・美容皮膚科",
  description:
    "銀座の美容外科・美容皮膚科クリニック。形成外科専門医が担当する目元・鼻・口元・リフトアップ・美容皮膚科の施術。",
};

import { MediaSectionPlaceholder } from "@/components/sections/MediaSection";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TeamMarquee } from "@/components/sections/TeamMarquee";
import { TreatmentTabs } from "@/components/sections/TreatmentTabs";
import { FaceMenu } from "@/components/sections/FaceMenu";
import { ScrollFadeIn } from "@/components/ui/ScrollFadeIn";
import { CaseCarousel } from "@/components/sections/CaseCarousel";

// TODO: Replace MediaSectionPlaceholder with MediaSection once microCMS is connected
// import { MediaSection } from "@/components/sections/MediaSection";
// TODO: Import other section components as they are built
// import { HeroSection } from "@/components/sections/HeroSection";
// import { CampaignBanner } from "@/components/sections/CampaignBanner";
// import { FaceMenu } from "@/components/sections/FaceMenu";
// import { TreatmentNav } from "@/components/sections/TreatmentNav";
// import { CaseResults } from "@/components/sections/CaseResults";
// import { MediaSection } from "@/components/sections/MediaSection";
// import { ClinicInterior } from "@/components/sections/ClinicInterior";
// import { ValueSection } from "@/components/sections/ValueSection";
// import { DoctorMessage } from "@/components/sections/DoctorMessage";
// import { TeamSlide } from "@/components/sections/TeamSlide";
// import { NewsSection } from "@/components/sections/NewsSection";
// import { AccessSection } from "@/components/sections/AccessSection";
// import { ReserveCTA } from "@/components/sections/ReserveCTA";

export default function TopPage() {
  return (
    <>
      {/* Hero animations - inline <style> で確実にキーフレームを参照 */}
      <style>{`
        @keyframes hero-zoom-out {
          from { transform: scale(1.05); }
          to   { transform: scale(1); }
        }
        @keyframes hero-fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Section 1: Hero */}
      <section className="sticky top-0 -mt-16 md:-mt-20 bg-[var(--color-brand-white)] px-3 pb-0">
        <div className="relative h-[100svh] rounded-2xl overflow-hidden">
          {/* 背景画像 - zoom-out */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/toppage/hero_background.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ animation: "hero-zoom-out 5s ease-out forwards" }}
          />
          {/* オーバーレイ */}
          <div className="absolute inset-0 bg-black/10" />
          {/* テキスト - 各要素を時差フェードイン */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-16 md:pt-20 text-center px-6">
            <p
              className="font-en text-sm md:text-base tracking-[0.35em] text-white/80 mb-5 drop-shadow"
              style={{ animation: "hero-fade-in 0.9s ease-out both", animationDelay: "0.3s" }}
            >
              Ginza Cosmetic Surgery &amp; Dermatology
            </p>
            <h1
              className="font-en text-5xl md:text-7xl lg:text-8xl tracking-widest text-white mb-8 drop-shadow-lg"
              style={{ animation: "hero-fade-in 0.9s ease-out both", animationDelay: "0.6s" }}
            >
              Maison PUREJU
            </h1>
            <p
              className="text-sm md:text-lg text-white/80 tracking-widest drop-shadow"
              style={{ animation: "hero-fade-in 0.9s ease-out both", animationDelay: "1.0s" }}
            >
              あなたの人生を豊かにする美容医療
            </p>
          </div>
        </div>
      </section>

      {/* Section 2以降 - z-10 でheroの上に重なる */}
      <div className="relative z-10">

      {/* Section 2: Campaign Banner */}
      {/* TODO: Phase 2 で microCMS campaigns から取得に切り替え */}
      <section className="py-10 bg-white">
        <div className="section-container">
          {(() => {
            const month = new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric" }).format(new Date());
            return (
              <SectionHeading en="Campaign" ja={`${month}のキャンペーン`} className="mb-8" />
            );
          })()}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { src: "/campaign/3月_samune01.png", alt: "キャンペーン 1" },
              { src: "/campaign/3月_samune02.png", alt: "キャンペーン 2" },
            ].map((banner, i) => (
              <ScrollFadeIn key={banner.src} delay={i * 0.1}>
                <div className="aspect-video overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={banner.src}
                    alt={banner.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Face Menu - お悩みから探す */}
      <section className="py-16 md:py-24 bg-[var(--color-brand-white)]">
        <div className="section-container mb-10">
          <SectionHeading number="01" en="Find Your Solution" ja="お悩みから探す" className="mb-12" />
        </div>
        <div className="section-container">
          <FaceMenu />
        </div>
      </section>

      {/* Section 4: 施術名から探す */}
      <section className="py-16 md:py-24 bg-[var(--color-brand-cream)]">
        <div className="section-container">
          <SectionHeading number="02" en="Treatment Menu" ja="施術名から探す" className="mb-12" />
          <TreatmentTabs />
        </div>
      </section>

      {/* Section 5: 症例実績 */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="section-container mb-10">
          <SectionHeading number="03" en="Case Results" ja="症例実績" />
        </div>
        <CaseCarousel />
        <div className="text-center mt-10">
          <a
            href="/case"
            className="inline-block border border-[var(--color-brand-dark)] px-8 py-3 text-sm tracking-wider text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white transition-colors"
          >
            症例一覧を見る
          </a>
        </div>
      </section>

      {/* Section 6: Credentials */}
      {/* TODO: Phase 2 で microCMS media スキーマから取得に切り替え */}
      <section className="py-16 md:py-24 bg-[var(--color-brand-cream)]">
        <div className="section-container">
          <SectionHeading number="04" en="Credentials" ja="実績・掲載歴" className="mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                image: "/works/works01.jpg",
                title: "第6回美容医療コミュニティ講演",
                desc: "ニードルRF新時代の幕開け — 最新MicroneedleRF治療の臨床最前線",
              },
              {
                image: "/works/works02.jpg",
                title: "美容医療メディア「キレイレポ」独占取材掲載",
                desc: "形成外科専門医 廣瀬雅史による口角挙上術の解説",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white overflow-hidden flex flex-col">
                {/* サムネイル 16:9 */}
                <div className="relative w-full aspect-video bg-[var(--color-brand-dark)]/5 shrink-0">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[var(--color-text-secondary)]/25 text-xs tracking-[0.25em]">PHOTO</span>
                    </div>
                  )}
                </div>
                {/* テキスト */}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <p className="font-serif text-sm leading-relaxed text-[var(--color-brand-dark)]">
                    {item.title}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: クリニック内観① - parallax */}
      <ParallaxImage
        src="/toppage/clinicimage01.jpg"
        alt="Maison PUREJU クリニック内観"
      />

      {/* Section 8: Value - 選ばれる理由 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-container">
          <SectionHeading number="05" en="Why Choose Us" ja="選ばれる理由" className="mb-14" />

          <div className="divide-y divide-[var(--color-brand-brown)]/10">
            {[
              {
                title: "形成外科専門医",
                desc: "美容外科の基礎である形成外科の専門医資格を持つ院長が、すべての施術を担当します。確かな技術と豊富な知識で、安全で質の高い施術をご提供します。",
              },
              {
                title: "完全個室",
                desc: "カウンセリングから施術まで、プライバシーに配慮した完全個室の環境をご用意しています。周囲を気にせず、安心してご相談いただけます。",
              },
              {
                title: "銀座アクセス",
                desc: "銀座駅徒歩1分。お仕事帰りや休日のお買い物のついでにお越しいただけます。洗練された銀座の街に溶け込む、プライベートな空間です。",
              },
              {
                title: "オーダーメイド施術",
                desc: "画一的な施術ではなく、お一人おひとりの顔立ちや骨格に合わせた施術プランをご提案します。あなただけの「自然な美しさ」を追求します。",
              },
            ].map((item, i) => {
              const flip = i % 2 === 1;
              return (
                <ScrollFadeIn key={item.title}>
                  <div className={`flex flex-col ${flip ? "md:flex-row-reverse" : "md:flex-row"} gap-0`}>

                    {/* 写真 */}
                    <div className="relative w-full md:w-5/12 aspect-[4/3] shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/choose/choose0${i + 1}.jpg`}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>

                    {/* テキスト */}
                    <div className={`flex-1 flex flex-col justify-center py-10 md:py-14 ${flip ? "md:pr-12 lg:pr-16 md:pl-0" : "md:pl-12 lg:pl-16 md:pr-0"}`}>
                      {/* デコレーション数字 */}
                      <p
                        className="font-en text-8xl md:text-9xl leading-none text-[var(--color-brand-gold)] select-none mb-1"
                        style={{ opacity: 0.1 }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      {/* 短いゴールドライン */}
                      <div className="w-8 h-px bg-[var(--color-brand-gold)] mb-6" />
                      {/* タイトル */}
                      <h3 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-5 leading-snug">
                        {item.title}
                      </h3>
                      {/* 説明 */}
                      <p className="text-sm text-[var(--color-text-secondary)] leading-[2.2] font-light max-w-sm">
                        {item.desc}
                      </p>
                    </div>

                  </div>
                </ScrollFadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 9: Doctor Message */}
      <section className="py-16 md:py-24 bg-[var(--color-brand-cream)] overflow-hidden">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">

            {/* 左: 院長写真 1:1 + 右上斜めクリップ */}
            <div
              className="aspect-square relative"
              style={{ clipPath: "polygon(0 0, calc(100% - 3.5rem) 0, 100% 3.5rem, 100% 100%, 0 100%)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/staff/hirose.jpg"
                alt="医院長 廣瀬 雅史"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </div>

            {/* 右: セクションタイトル + 本文 */}
            <div>

              {/* セクションタイトル（横書き） */}
              <p aria-hidden="true" className="font-en text-6xl md:text-7xl leading-none tracking-tight text-[var(--color-brand-dark)]/[0.08] select-none mb-6">
                Message
              </p>

              {/* 医院長情報 */}
              <div className="mb-8">
                <p className="text-xs tracking-widest text-[var(--color-brand-gold)] mb-3">医院長</p>
                <p className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)]">廣瀬 雅史</p>
                <p className="font-en text-sm tracking-wider text-[var(--color-text-secondary)] mt-1">Masashi Hirose</p>
              </div>

              {/* タイトル */}
              <p className="font-serif text-lg md:text-xl leading-relaxed text-[var(--color-brand-dark)] mb-8">
                本質を極めた、<br />あなただけの美の追求。
              </p>

              {/* 本文 */}
              <div className="space-y-5 font-serif text-sm leading-[2.4] text-[var(--color-text-primary)]">
                <p>私は、美容医療を単なる施術ではなく、患者様一人ひとりの人生を豊かにするものだと考えています。</p>
                <p>そのため、学生時代から「最高の美容外科医になる」と決意。</p>
                <p>安全で質の高い手術を提供するために、美容外科の基礎である形成外科専門医の道を選択し、技術と知識を徹底的に習得しました。</p>
                <p>確固たる技術で、あなたの「変わりたい」を支えます。</p>
              </div>

              {/* 資格 + リンク */}
              <div className="mt-10 pt-6 border-t border-[var(--color-brand-brown)]/20 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <ul className="space-y-1">
                  {["形成外科専門医", "日本美容外科学会（JSAS）", "奈良県立医科大学 卒業"].map((item) => (
                    <li key={item} className="text-xs text-[var(--color-text-secondary)] flex items-start gap-2">
                      <span className="text-[var(--color-brand-gold)] mt-0.5">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="/doctor"
                  className="inline-block text-xs tracking-widest text-[var(--color-text-secondary)] border-b border-current pb-0.5 hover:text-[var(--color-brand-gold)] transition-colors shrink-0"
                >
                  PROFILE →
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Section 10: Team Slide */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="section-container mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <SectionHeading number="07" en="Our Team" ja="Introduction of our Team" />
            <p className="text-sm text-[var(--color-text-secondary)] max-w-xs">
              豊富な経験を持つ専門医・スタッフが、あなたの理想に向き合います。
            </p>
          </div>
        </div>
        <TeamMarquee />
      </section>

      {/* Section 11: News */}
      <section className="py-16 md:py-24 bg-[var(--color-brand-cream)]">
        <div className="section-container">
          <div className="flex items-end justify-between mb-8">
            <SectionHeading number="08" en="News" ja="お知らせ" />
            <a
              href="/news"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors shrink-0"
            >
              一覧を見る →
            </a>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 p-4 bg-white">
                <span className="text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                  2026.01.0{i}
                </span>
                <span className="text-sm text-[var(--color-text-primary)]">
                  お知らせタイトル（microCMS連携予定）
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 12: Media（SNS） */}
      <MediaSectionPlaceholder />

      {/* Section 13: クリニック内観② - parallax */}
      <ParallaxImage
        src="/toppage/clinicimage02.jpg"
        alt="Maison PUREJU クリニック処置室"
      />

      {/* Section 14: Access */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-container">
          <SectionHeading number="09" en="Access" ja="アクセス" className="mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Google Maps 埋め込み */}
            <div className="h-72 md:h-full min-h-64">
              <iframe
                src="https://maps.google.com/maps?q=35.671645,139.76263&z=16&output=embed&hl=ja"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "280px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Maison PUREJU アクセスマップ"
              />
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-[var(--color-brand-gold)] tracking-wider mb-1">ADDRESS</p>
                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
                  〒104-0061 東京都中央区銀座５丁目３−１３<br />
                  Ginza SS 85ビル 4F
                </p>
                <a
                  href="https://www.google.com/maps?ll=35.671645,139.76263&z=16&t=m&hl=ja&gl=JP&mapclient=embed&cid=11387186794925088261"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--color-brand-gold)] underline underline-offset-2 hover:opacity-70 transition-opacity mt-1 inline-block"
                >
                  Google Maps で開く
                </a>
              </div>
              <div>
                <p className="text-xs text-[var(--color-brand-gold)] tracking-wider mb-1">ACCESS</p>
                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
                  東京メトロ銀座駅 徒歩1分<br />
                  JR有楽町駅 徒歩5分
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-brand-gold)] tracking-wider mb-1">HOURS</p>
                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
                  10:00 〜 19:00<br />
                  <span className="text-[var(--color-text-secondary)]">※休診日：月曜、不定休</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-brand-gold)] tracking-wider mb-1">TEL</p>
                <a href="tel:0332891222" className="text-sm text-[var(--color-text-primary)] hover:text-[var(--color-brand-gold)] transition-colors">
                  03-3289-1222
                </a>
              </div>
              <div>
                <p className="text-xs text-[var(--color-brand-gold)] tracking-wider mb-1">診療内容</p>
                <p className="text-sm text-[var(--color-text-primary)]">美容外科、美容皮膚科、形成外科、皮膚科</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>{/* /relative z-10 */}
    </>
  );
}
