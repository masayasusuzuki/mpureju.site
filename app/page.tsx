import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maison PUREJU｜銀座の美容外科・美容皮膚科",
  description:
    "銀座の美容外科・美容皮膚科クリニック。形成外科専門医が担当する目元・鼻・口元・リフトアップ・美容皮膚科の施術。",
};

import Image from "next/image";
import Link from "next/link";
import { MediaSection } from "@/components/sections/MediaSection";
import { getCampaigns, getCaseList, getColumnList, getMediaList, getNewsList, getTeamPhotos } from "@/lib/microcms/client";
import type { News } from "@/types/microcms";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TeamMarquee } from "@/components/sections/TeamMarquee";
import { TreatmentTabs } from "@/components/sections/TreatmentTabs";
import { FaceMenu } from "@/components/sections/FaceMenu";
import { ScrollFadeIn } from "@/components/ui/ScrollFadeIn";
import { CaseCarousel } from "@/components/sections/CaseCarousel";
import { SearchBar } from "@/components/sections/SearchBar";

// TODO: Import other section components as they are built

export default async function TopPage() {
  const hasCategory = (item: News, cat: string) =>
    Array.isArray(item.category) ? item.category.includes(cat) : item.category === cat;

  const [mediaData, teamPhotoData, newsData, campaigns, columnData, caseData] = await Promise.all([
    getMediaList(),
    getTeamPhotos(),
    getNewsList(),
    getCampaigns(),
    getColumnList({ limit: 3 }),
    getCaseList({ limit: 20 }),
  ]);
  const latestColumns = columnData.contents;
  const teamPhotos = teamPhotoData.contents.map((t) => t.photo.url);
  const newsItems = newsData.contents.filter((n) => hasCategory(n, "お知らせ")).slice(0, 3);
  const credentialItems = newsData.contents.filter((n) => hasCategory(n, "実績・掲載歴"));
  const instagramItems = mediaData.contents.filter((m) =>
    Array.isArray(m.platform) ? m.platform.includes("Instagram") : m.platform === "Instagram"
  );
  const youtubeItems = mediaData.contents.filter((m) =>
    Array.isArray(m.platform) ? m.platform.includes("YouTube") : m.platform === "YouTube"
  );
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
            src="/toppage/hero_background03.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ animation: "hero-zoom-out 5s ease-out forwards" }}
          />
          {/* シネマティックオーバーレイ */}
          {/* 1. 上下グラデーション */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(12,6,2,0.48) 0%, rgba(12,6,2,0.08) 30%, rgba(12,6,2,0.08) 60%, rgba(12,6,2,0.44) 100%)",
            }}
          />
          {/* 2. ビネット（控えめ） */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 140% 110% at 50% 50%, transparent 40%, rgba(8,4,1,0.28) 100%)",
            }}
          />
          {/* テキスト - 各要素を時差フェードイン */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-16 md:pt-20 text-center px-6">
            <p
              className="font-en text-base md:text-xl tracking-[0.3em] text-white/90 mb-5 drop-shadow font-medium"
              style={{ animation: "hero-fade-in 0.9s ease-out both", animationDelay: "0.3s" }}
            >
              Ginza Cosmetic Surgery &amp; Dermatology
            </p>
            <h1
              className="mb-8"
              style={{ animation: "hero-fade-in 0.9s ease-out both", animationDelay: "0.6s" }}
            >
              <Image
                src="https://images.microcms-assets.io/assets/e0edb1da60cb4aca82ba53064009bd74/66ad4fa0d6724307a1f8d3b8d9be0bb3/logo.png"
                alt="Maison PUREJU"
                width={640}
                height={160}
                className="drop-shadow-lg"
                priority
              />
            </h1>
            <p
              className="text-sm md:text-lg text-white/80 tracking-widest drop-shadow"
              style={{ animation: "hero-fade-in 0.9s ease-out both", animationDelay: "1.0s" }}
            >
              自信と輝きを、あなたの日常へ。
            </p>
          </div>
        </div>
      </section>

      {/* Section 2以降 - z-10 でheroの上に重なる */}
      <div className="relative z-10">

      {/* Section 2: Campaign Banner */}
      <section className="py-10 bg-white">
        <div className="section-container">
          {(() => {
            const month = new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric" }).format(new Date());
            return (
              <SectionHeading en="Campaign" ja={`${month}のキャンペーン`} className="mb-8" />
            );
          })()}
          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map((campaign, i) => {
                const card = (
                  <div>
                    <div className="aspect-video overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={campaign.image.url}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-[var(--color-brand-dark)] mt-3 font-light">
                      {campaign.title}
                    </p>
                  </div>
                );
                return (
                  <ScrollFadeIn key={campaign.id} delay={i * 0.1}>
                    {campaign.link_url ? (
                      <a href={campaign.link_url} target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity">
                        {card}
                      </a>
                    ) : card}
                  </ScrollFadeIn>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)] py-8 text-center">
              現在キャンペーンはありません
            </p>
          )}
        </div>
      </section>

      {/* Search */}
      <section className="py-14 md:py-20 bg-[var(--color-brand-cream)]">
        <div className="section-container">
          <SearchBar />
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

      {/* 美容コラム */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-container">
          <div className="flex items-end justify-between mb-12">
            <SectionHeading number="03" en="Beauty Column" ja="美容コラム" />
            <Link
              href="/column"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors shrink-0"
            >
              もっと見る →
            </Link>
          </div>

          {latestColumns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              {latestColumns.map((col) => (
                <Link
                  key={col.id}
                  href={`/column/${col.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-square bg-[var(--color-brand-cream)] overflow-hidden mb-4">
                    {col.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={col.thumbnail.url}
                        alt={col.title}
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-en text-[0.6rem] tracking-[0.3em] text-[var(--color-brand-gold)]/30">PHOTO</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-[0.6rem] tracking-[0.15em] text-[var(--color-brand-gold)]">
                        {col.category[0]}
                      </span>
                      <time className="text-[0.6rem] text-[var(--color-text-secondary)]/50 tracking-wider">
                        {new Date(col.published_at).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }).replace(/\//g, ".")}
                      </time>
                    </div>
                    <p className="text-sm font-light text-[var(--color-brand-dark)] leading-relaxed tracking-wide group-hover:text-[var(--color-brand-gold)] transition-colors line-clamp-2">
                      {col.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)] py-8 text-center">
              準備中です
            </p>
          )}
        </div>
      </section>

      {/* Section 5: 症例実績 */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="section-container mb-10">
          <SectionHeading number="04" en="Case Results" ja="症例実績" />
        </div>
        <CaseCarousel cases={caseData.contents.map(c => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          pillar: c.pillar,
          treatment_label: c.treatment_label,
          timing: c.timing,
          concern: c.concern,
          thumbnail: c.thumbnail,
        }))} />
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
      <section className="py-16 md:py-24 bg-[var(--color-brand-cream)]">
        <div className="section-container">
          <SectionHeading number="05" en="Credentials" ja="実績・掲載歴" className="mb-12" />
          {credentialItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {credentialItems.map((item) => (
                <a key={item.id} href={`/news/${item.slug}`} className="group bg-white overflow-hidden flex flex-col">
                  <div className="relative w-full aspect-video bg-[var(--color-brand-dark)]/5 shrink-0 overflow-hidden">
                    {item.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnail.url}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[var(--color-text-secondary)]/25 text-xs tracking-[0.25em]">PHOTO</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <p className="font-serif text-sm leading-relaxed text-[var(--color-brand-dark)] group-hover:text-[var(--color-brand-gold)] transition-colors">
                      {item.title}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)] py-8 text-center">
              まだコンテンツがありません
            </p>
          )}
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
          <SectionHeading number="06" en="Why Choose Us" ja="選ばれる理由" className="mb-14" />

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
        <TeamMarquee photos={teamPhotos} />
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
          {newsItems.length > 0 ? (
            <div className="space-y-4">
              {newsItems.map((item) => (
                <a key={item.id} href={`/news/${item.slug}`} className="flex gap-4 p-4 bg-white hover:bg-[var(--color-brand-cream)]/50 transition-colors">
                  <span className="text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                    {new Date(item.published_at).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }).replace(/\//g, ".")}
                  </span>
                  <span className="text-sm text-[var(--color-text-primary)]">
                    {item.title}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)] py-8 text-center">
              まだお知らせはありません
            </p>
          )}
        </div>
      </section>

      {/* Section 12: Media（SNS） */}
      <MediaSection instagramItems={instagramItems} youtubeItems={youtubeItems} />

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
