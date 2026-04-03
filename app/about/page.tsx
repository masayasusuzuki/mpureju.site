import type { Metadata } from "next";
import Link from "next/link";
import { ScrollFadeIn } from "@/components/ui/ScrollFadeIn";
import { getClinicCalendar } from "@/lib/supabase/queries";
import { ClinicSlideshow } from "./ClinicSlideshow";
import { ClinicCalendarWidget } from "@/components/ui/ClinicCalendarWidget";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { CLINIC } from "@/lib/constants";

export const metadata: Metadata = {
  title: "当院について｜Maison PUREJU 銀座の美容外科・美容皮膚科",
  description:
    "Maison PUREJUのクリニック紹介。形成外科専門医が院長を務める銀座の美容クリニック。プライバシーを最優先にした完全個室設計、6つのこだわり、アクセス情報をご案内します。",
};

const COMMITMENTS = [
  {
    number: "01",
    title: "技術",
    en: "Technique",
    photo: "https://images.microcms-assets.io/assets/e0edb1da60cb4aca82ba53064009bd74/30f0c379abcd483fba5f8099f8e6b10d/contents6_point1.png?w=680&fit=crop&crop=entropy&auto=compress",
    lead: "形成外科専門医が、すべての施術を担当します。",
    body: "美容外科の土台となる形成外科は、外傷・腫瘍・先天異常など難度の高い手術を日常的に扱う診療科です。院長はこの分野で専門医資格を取得し、基礎から応用まで体系的に技術を習得。「美しく見せる」だけでなく「正確に、安全に」という形成外科のマインドが、すべての施術に宿っています。",
  },
  {
    number: "02",
    title: "知識",
    en: "Knowledge",
    photo: "https://images.microcms-assets.io/assets/e0edb1da60cb4aca82ba53064009bd74/03ba9c91b33a42d89d365a4bdd3b3c96/introductionteam_23.jpg?w=680&fit=crop&crop=entropy&auto=compress",
    lead: "科学的根拠にもとづいた、本質的な施術提案。",
    body: "美容医療の世界は日々進化しています。院長は国内外の学会・研修に積極的に参加し、常に最新のエビデンスをアップデート。流行に左右されることなく、患者様それぞれの状態・希望に合わせた最適な施術をご提案します。「やってよかった」と思える結果のために、根拠ある知識を武器にします。",
  },
  {
    number: "03",
    title: "カウンセリング",
    en: "Counseling",
    photo: "https://images.microcms-assets.io/assets/e0edb1da60cb4aca82ba53064009bd74/534f62fc39ea408fbc03e6adf134ec4f/05.jpg?w=680&fit=crop&crop=entropy&auto=compress",
    lead: "断られる心配なく、何でも相談できる場所。",
    body: "「こんなことを言ったら変に思われるかも」という不安は無用です。当院のカウンセリングは一方的な提案の場ではなく、患者様の希望・不安・ライフスタイルを丁寧にお聞きする対話の時間。施術しないという選択肢も含め、本当に患者様にとってベストな答えを一緒に探します。",
  },
  {
    number: "04",
    title: "接遇",
    en: "Hospitality",
    photo: "https://images.microcms-assets.io/assets/e0edb1da60cb4aca82ba53064009bd74/1c21896f9f174fe4b611f32bc352f9ca/06.jpg?w=680&fit=crop&crop=entropy&auto=compress",
    lead: "安心・信頼・誠実を、すべての接点で。",
    body: "美容クリニックへの来院には、緊張や不安が伴うことも少なくありません。当院では、受付から施術・アフターケアに至るまで、患者様が安心して過ごせるよう、スタッフ全員が「安心・信頼・誠実」を基本とした接遇を心がけています。銀座という街にふさわしい、上質でプライベートな時間をお届けします。",
  },
  {
    number: "05",
    title: "空間",
    en: "Space",
    photo: "https://images.microcms-assets.io/assets/e0edb1da60cb4aca82ba53064009bd74/c560dc1ae2e149a4a2587b6aeeb5b3fe/07.jpg?w=680&fit=crop&crop=entropy&auto=compress",
    lead: "他の患者様とすれ違わない、完全個室設計。",
    body: "「誰かに見られたくない」「知人に会いたくない」——美容クリニックを訪れる方の多くが感じる不安に応えるため、当院は他の患者様と顔を合わせることのない完全個室設計を採用しています。カウンセリングから施術・アフターケアまで、すべてのプロセスをプライベートな空間で完結。銀座の喧騒を忘れる、静かで心地よい時間をご用意しています。",
  },
  {
    number: "06",
    title: "医療精度",
    en: "Precision",
    photo: "https://images.microcms-assets.io/assets/e0edb1da60cb4aca82ba53064009bd74/3c05e0652eb84602b207164bd02ade79/contents4_point1.png?w=680&fit=crop&crop=entropy&auto=compress",
    lead: "形成外科専門医による、一貫した高精度医療。",
    body: "カウンセリングで立てたプランを、そのまま担当医が施術まで行います。「カウンセリング医と施術医が違う」というケースは当院では一切ありません。院長が初診から術後フォローまで一貫して担当することで、方針のズレや情報の伝達ミスを防ぎ、高い医療精度を維持しています。使用する機器・薬剤も、安全性と有効性が確認されたものだけを採用しています。",
  },
];


export default async function AboutPage() {
  const calendar = await getClinicCalendar();

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
            <span className="text-[var(--color-text-secondary)]">当院について</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">ABOUT</p>
          <h1 className="font-serif text-3xl md:text-4xl tracking-widest text-[var(--color-brand-dark)] mb-4 leading-relaxed">
            当院について
          </h1>
          <p className="text-sm tracking-widest text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            「他の患者様とすれ違わない設計」で、あなたのプライバシーを最優先に。<br />
            形成外科専門医が、銀座の地で本質的な美容医療をご提供します。
          </p>
        </div>
      </section>

      {/* ===== コンセプト ===== */}
      <section className="py-16 md:py-24 bg-[var(--color-brand-white)]">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <ScrollFadeIn>
              <div
                className="aspect-[4/3] relative overflow-hidden"
                style={{ clipPath: "polygon(0 0, calc(100% - 2.5rem) 0, 100% 2.5rem, 100% 100%, 0 100%)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.microcms-assets.io/assets/e0edb1da60cb4aca82ba53064009bd74/5fde4133e7194108bb1194a913ddbdf2/contents2_point1.png?w=680&fit=crop&crop=entropy&auto=compress"
                  alt="Maison PUREJU クリニック内観"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </ScrollFadeIn>
            <ScrollFadeIn>
              <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-6">CONCEPT</p>
              <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-8 leading-relaxed">
                本質を極めた、<br />あなただけの美の追求。
              </h2>
              <div className="space-y-5 text-sm text-[var(--color-text-secondary)] leading-[2.2]">
                <p>美容医療を単なる施術ではなく、患者様一人ひとりの人生を豊かにするものだと考えています。</p>
                <p>だからこそ当院は、完全個室設計によるプライバシーの徹底、形成外科専門医による一貫診察、そして丁寧なカウンセリングにこだわり続けています。</p>
                <p>美容皮膚科から美容外科まで、あなたのお悩みに合わせたトータルビューティーをご提案します。</p>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ===== 6つのこだわり ===== */}
      <section className="bg-[var(--color-brand-cream)]">
        {/* セクション見出し */}
        <div className="section-container pt-16 md:pt-24 pb-12">
          <ScrollFadeIn>
            <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4 text-center">OUR COMMITMENT</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] text-center tracking-widest">
              6つのこだわり
            </h2>
          </ScrollFadeIn>
        </div>

        {/* こだわり 各アイテム */}
        {COMMITMENTS.map((item, i) => {
          const isEven = i % 2 === 1;
          return (
            <div
              key={item.number}
              className={`py-16 md:py-20 ${isEven ? "bg-white" : "bg-[var(--color-brand-cream)]"}`}
            >
              <div className="section-container">
                <ScrollFadeIn>
                  <div className={`flex flex-col ${isEven ? "md:flex-row-reverse" : "md:flex-row"} gap-10 md:gap-16 items-center`}>

                    {/* 写真エリア — パラレログラム + オフセットフレーム */}
                    <div className="w-full md:w-5/12 shrink-0">
                      <div className={`relative ${isEven ? "ml-4 mb-4" : "mr-4 mb-4"}`}>
                        {/* オフセット装飾枠（パラレログラム） */}
                        <div
                          className="absolute border border-[var(--color-brand-gold)]/40"
                          style={{
                            inset: 0,
                            clipPath: isEven
                              ? "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)"
                              : "polygon(0% 0, 94% 0, 100% 100%, 6% 100%)",
                            transform: isEven ? "translate(-10px, 10px)" : "translate(10px, 10px)",
                          }}
                        />
                        {/* 写真本体（パラレログラム） */}
                        <div
                          className="relative aspect-[4/3] overflow-hidden"
                          style={{
                            clipPath: isEven
                              ? "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)"
                              : "polygon(0% 0, 94% 0, 100% 100%, 6% 100%)",
                          }}
                        >
                          {item.photo ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={item.photo} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[var(--color-brand-dark)]/5 flex flex-col items-center justify-center gap-3">
                              <p className="text-xs tracking-[0.3em] text-[var(--color-brand-brown)]/30">PHOTO</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* テキストエリア */}
                    <div className="flex-1">
                      {/* アウトライン数字 */}
                      <div className="overflow-hidden mb-3">
                        <span
                          className="font-en text-7xl md:text-8xl font-light leading-none select-none"
                          style={{
                            WebkitTextStroke: "1.5px var(--color-brand-gold)",
                            color: "transparent",
                            opacity: 0.85,
                          }}
                        >
                          {item.number}
                        </span>
                      </div>

                      {/* 英語 + タイトル */}
                      <p className="font-en text-xs tracking-[0.25em] text-[var(--color-brand-gold)] mb-1">{item.en}</p>
                      <h3 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-5">{item.title}</h3>
                      <div className="w-10 h-px bg-[var(--color-brand-gold)] mb-6" />

                      {/* リード文 */}
                      <p className="font-serif text-base md:text-lg text-[var(--color-brand-dark)] mb-5 leading-relaxed">
                        {item.lead}
                      </p>

                      {/* 本文 */}
                      <p className="text-sm text-[var(--color-text-secondary)] leading-[2.2]">
                        {item.body}
                      </p>
                    </div>

                  </div>
                </ScrollFadeIn>
              </div>
            </div>
          );
        })}

        <div className="pb-4" />
      </section>

      {/* ===== 内観写真（フェードスライドショー） ===== */}
      <section className="py-16 md:py-24 bg-[var(--color-brand-white)]">
        <div className="section-container">
          <ScrollFadeIn>
            <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4 text-center">CLINIC</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-12 text-center tracking-widest">
              クリニック内観
            </h2>
          </ScrollFadeIn>
          <ScrollFadeIn>
            <ClinicSlideshow />
          </ScrollFadeIn>
        </div>
      </section>

      {/* ===== アクセス ===== */}
      <section id="access" className="py-16 md:py-24 bg-[var(--color-brand-cream)]">
        <div className="section-container">
          <ScrollFadeIn>
            <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4 text-center">ACCESS</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-12 text-center tracking-widest">
              アクセス
            </h2>
          </ScrollFadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <ScrollFadeIn>
              <div className="h-80 md:h-full min-h-[300px]">
                <iframe
                  src="https://maps.google.com/maps?q=35.671645,139.76263&z=16&output=embed&hl=ja"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "300px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Maison PUREJU アクセスマップ"
                />
              </div>
            </ScrollFadeIn>
            <ScrollFadeIn delay={0.1}>
              <dl className="divide-y divide-[var(--color-brand-brown)]/10">
                {[
                  { label: "ADDRESS", value: `${CLINIC.postal} ${CLINIC.address}\n${CLINIC.building}` },
                  { label: "ACCESS", value: "東京メトロ銀座駅 徒歩1分\nJR有楽町駅 徒歩5分" },
                  { label: "TEL", value: CLINIC.phone },
                  { label: "HOURS", value: `${CLINIC.hours}\n休診日：${CLINIC.closedDay}` },
                ].map((item) => (
                  <div key={item.label} className="flex gap-6 py-5">
                    <dt className="font-en text-xs tracking-widest text-[var(--color-brand-gold)] w-20 shrink-0 pt-0.5">{item.label}</dt>
                    <dd className="text-sm text-[var(--color-text-primary)] leading-relaxed whitespace-pre-line">{item.value}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={CLINIC.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block text-xs text-[var(--color-brand-gold)] underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                Google Maps で開く →
              </a>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ===== 営業カレンダー ===== */}
      {calendar && (
        <section className="py-14 md:py-20 bg-[var(--color-brand-white)]">
          <div className="section-container max-w-2xl">
            <div className="text-center mb-8">
              <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-2">CALENDAR</p>
              <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)]">
                営業カレンダー
              </h2>
            </div>
            <div className="bg-white rounded-lg border border-[var(--color-brand-brown)]/8 px-5 py-6 md:px-8 md:py-8">
              <ClinicCalendarWidget
                regularHolidays={calendar.regularHolidays}
                extraHolidays={calendar.extraHolidays}
                cancelHolidays={calendar.cancelHolidays}
              />
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <ConsultationCTA subtitle="まずはカウンセリングでお気軽にご相談ください。" />
    </>
  );
}
