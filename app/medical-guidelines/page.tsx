import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "医療広告ガイドライン｜Maison PUREJU",
  description:
    "Maison PUREJU（銀座）の医療広告ガイドラインへの取り組みについてご説明いたします。",
};

export default function MedicalGuidelinesPage() {
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
            <span className="text-[var(--color-text-secondary)]">医療広告ガイドライン</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            MEDICAL ADVERTISING GUIDELINES
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-widest text-[var(--color-brand-dark)] leading-tight">
            医療広告ガイドライン
          </h1>
        </div>
      </section>

      {/* ── 本文 ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-container max-w-3xl">
          <div className="space-y-12 text-sm text-[var(--color-text-secondary)] leading-[2.2] font-light">
            <p>
              当院は、厚生労働省が定める「医業若しくは歯科医業又は病院若しくは診療所に関する広告等に関する指針（医療広告ガイドライン）」を遵守し、患者様に正確で適切な情報提供を行うことに努めています。
            </p>

            <GuidelineSection title="当院ウェブサイトにおける情報提供の方針">
              <ul className="list-disc pl-5 space-y-2">
                <li>虚偽の内容や誇大な表現は一切使用いたしません</li>
                <li>他の医療機関との比較優良広告は行いません</li>
                <li>患者様の体験談を、事実に反する印象を与える形では掲載いたしません</li>
                <li>施術の効果について、「必ず」「絶対」「確実に」等の断定的表現は使用いたしません</li>
                <li>施術の効果には個人差がある旨を明記いたします</li>
              </ul>
            </GuidelineSection>

            <GuidelineSection title="自由診療に関する表記について">
              <p>当院で提供する自由診療（保険外診療）については、以下の事項を明示いたします。</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>
                  <span className="font-medium text-[var(--color-brand-dark)]">治療内容：</span>
                  施術の概要・手順について分かりやすく説明いたします
                </li>
                <li>
                  <span className="font-medium text-[var(--color-brand-dark)]">料金：</span>
                  税込総額を明示いたします。追加費用が発生する場合はその旨を記載いたします
                </li>
                <li>
                  <span className="font-medium text-[var(--color-brand-dark)]">リスク・副作用：</span>
                  各施術に伴うリスクや副作用について記載いたします
                </li>
                <li>
                  <span className="font-medium text-[var(--color-brand-dark)]">ダウンタイム：</span>
                  施術後の経過について目安を記載いたします（個人差があります）
                </li>
              </ul>
            </GuidelineSection>

            <GuidelineSection title="症例写真の掲載について">
              <p>当院ウェブサイトに掲載する症例写真については、以下の方針に従います。</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>患者様ご本人の同意を得た上で掲載いたします</li>
                <li>写真の加工・修正は行いません（個人を特定できないようにする処理を除く）</li>
                <li>施術内容、費用、リスク・副作用、施術の説明を併記いたします</li>
                <li>症例写真はあくまで一例であり、効果には個人差がある旨を明記いたします</li>
              </ul>
            </GuidelineSection>

            <GuidelineSection title="未承認医薬品・医療機器について">
              <p>
                当院で使用する医薬品・医療機器の中には、国内において薬機法上の承認を受けていないものが含まれる場合があります。その場合は、以下の事項を明示いたします。
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>未承認医薬品・医療機器である旨</li>
                <li>入手経路（国内販売代理店経由・個人輸入等）</li>
                <li>同一の成分・性能を有する国内承認医薬品・医療機器の有無</li>
                <li>諸外国における安全性等に係る情報</li>
              </ul>
            </GuidelineSection>

            <GuidelineSection title="お気づきの点がございましたら">
              <p>
                当院のウェブサイトの記載内容について、お気づきの点やご不明な点がございましたら、お気軽にお問い合わせください。
              </p>
              <div className="bg-[var(--color-brand-cream)] px-6 py-5 mt-4">
                <p className="font-medium text-[var(--color-brand-dark)] mb-2">Maison PUREJU</p>
                <p>TEL: 03-3289-1222</p>
                <p>
                  お問い合わせフォーム:{" "}
                  <Link href="/contact" className="text-[var(--color-brand-gold)] underline underline-offset-2">
                    こちら
                  </Link>
                </p>
              </div>
            </GuidelineSection>
          </div>
        </div>
      </section>
    </>
  );
}

function GuidelineSection({
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
      <div className="text-sm text-[var(--color-text-secondary)] leading-[2.2] font-light">
        {children}
      </div>
    </div>
  );
}
