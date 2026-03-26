import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ScrollFadeIn } from "@/components/ui/ScrollFadeIn";
import { FaqNav } from "@/components/sections/FaqNav";

export const metadata: Metadata = {
  title: "よくあるご質問（FAQ）｜Maison PUREJU 銀座の美容外科・美容皮膚科",
  description:
    "Maison PUREJU（銀座）のよくあるご質問。口元・目元・鼻・リフトアップ・美容皮膚科の施術に関する疑問にお答えします。",
};

/* ── FAQ データ ── */
type FaqItem = { q: string; a: string };
type FaqCategory = {
  id: string;
  label: string;
  en: string;
  items: FaqItem[];
};

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "mouth",
    label: "口元の施術について",
    en: "Mouth",
    items: [
      {
        q: "口角挙上のダウンタイムはどれくらいですか？",
        a: "腫れや内出血は2〜4週間ほど続くことがあります。抜糸は術後7日前後に行います。術後のむくみが落ち着くにつれ、徐々に自然な仕上がりになります。",
      },
      {
        q: "人中短縮は傷跡が残りますか？",
        a: "鼻の下（鼻柱基部）に沿って切開するため、傷跡が目立ちにくい位置になります。通常3〜6ヶ月で傷跡はほとんど目立たなくなりますが、個人差があります。",
      },
      {
        q: "M字リップは後戻りしますか？",
        a: "切開法のため埋没法と比較して後戻りはほとんどありません。ただし加齢による変化は生じることがあります。",
      },
      {
        q: "複数の口元施術を同時に受けられますか？",
        a: "複数の施術を組み合わせることが可能です。ダウンタイムや回復状況を考慮したうえで、カウンセリングにてご提案いたします。",
      },
      {
        q: "施術を受けられない方はいますか？",
        a: "妊娠中・授乳中の方、重篤な全身疾患のある方などは施術をお断りする場合があります。詳しくはカウンセリングにてご確認ください。",
      },
    ],
  },
  {
    id: "eye",
    label: "目元の施術について",
    en: "Eye",
    items: [
      {
        q: "二重埋没はどれくらい持続しますか？",
        a: "個人差はありますが、数年〜十数年持続するとされています。まぶたの脂肪が多い方や、二重の幅が広い方は取れやすい傾向があります。当院ではPVDF糸を使用し、取れにくさを高めています。",
      },
      {
        q: "眼瞼下垂の術後はどのような状態になりますか？",
        a: "術後はまぶたが開きやすくなり、目力アップや疲れ目の改善が期待できます。腫れは1〜2週間ほどで引いてきますが、完成は3〜6ヶ月程度かかります。",
      },
      {
        q: "二重手術後のダウンタイムはどれくらいですか？",
        a: "埋没法の場合は腫れが1〜2週間ほど。全切開の場合は2〜4週間ほどのダウンタイムが目安となります。個人差がありますので、余裕を持ったスケジュールでご検討ください。",
      },
      {
        q: "脱脂手術はどのようなクマに有効ですか？",
        a: "眼窩脂肪の突出による「黒クマ」「茶クマ」に効果が期待できます。血行不良による「青クマ」や色素沈着による「茶クマ」は別のアプローチが必要な場合があります。カウンセリングにてご確認ください。",
      },
      {
        q: "他院で施術を受けましたが修正は可能ですか？",
        a: "他院修正にも対応しております。過去の施術内容によって対応方法が異なるため、カウンセリングにて詳しくご確認ください。",
      },
    ],
  },
  {
    id: "nose",
    label: "鼻の施術について",
    en: "Nose",
    items: [
      {
        q: "プロテーゼ挿入後のダウンタイムはどれくらいですか？",
        a: "腫れや内出血は2〜4週間ほど続きます。鼻の通りにくさを感じる場合がありますが、通常は1週間ほどで改善します。",
      },
      {
        q: "鼻の施術は複数同時に受けられますか？",
        a: "プロテーゼ＋鼻尖形成など、複数の施術を組み合わせることが多いです。ダウンタイムを1回にまとめられるメリットもあります。カウンセリングにてご相談ください。",
      },
      {
        q: "プロテーゼは将来的に取り出すことができますか？",
        a: "プロテーゼは取り出すことが可能です。長期間挿入している場合は拘縮が生じていることがあり、抜去が困難になる場合もあります。",
      },
      {
        q: "自分の軟骨と人工のプロテーゼ、どちらが良いですか？",
        a: "自家軟骨は拒絶反応がなく自然な感触ですが、採取部位への負担があります。シリコンプロテーゼは形の調整がしやすく実績も豊富です。ご希望や状態によって最適な方法をご提案します。",
      },
      {
        q: "鼻手術の傷跡は目立ちますか？",
        a: "多くの術式は鼻腔内から切開するため、外から傷跡が見えません。鼻翼縮小など一部の術式では鼻翼周囲に小さな傷跡が残りますが、時間の経過とともに目立たなくなります。",
      },
    ],
  },
  {
    id: "lift",
    label: "リフトアップについて",
    en: "Lift",
    items: [
      {
        q: "糸リフトの効果はどれくらい持続しますか？",
        a: "使用する糸の種類によりますが、1〜2年ほど持続するとされています。コラーゲン生成の効果が加わることで、糸が吸収された後も一定の効果が残ることが期待できます。",
      },
      {
        q: "フェイスリフト後のダウンタイムはどれくらいですか？",
        a: "MACSフェイスリフトで2〜4週間、SMASフェイスリフトで4〜6週間程度が目安です。抜糸は術後1〜2週間で行います。",
      },
      {
        q: "糸リフトと切開リフトはどう違いますか？",
        a: "糸リフトはダウンタイムが短く気軽に受けられますが、効果の持続期間は切開リフトより短い傾向があります。切開リフトは一度の施術で長期間の効果が期待できますが、回復に時間がかかります。年齢や状態に応じてご提案いたします。",
      },
      {
        q: "バッカルファット除去は将来たるみに影響しますか？",
        a: "バッカルファットは加齢とともに垂れ下がる脂肪のため、早期に除去することでたるみ予防効果が期待できます。ただし過剰な除去は頬こけの原因となるため、適切な量の見極めが重要です。",
      },
      {
        q: "脂肪注入はどのくらい生着しますか？",
        a: "注入した脂肪の定着率は概ね30〜60%とされています。一度定着した脂肪は長期間持続するとされています。当院ではナノリッチ法により細かく精製した脂肪を注入し、より高い生着率を目指しています。",
      },
    ],
  },
  {
    id: "skin",
    label: "美容皮膚科について",
    en: "Skin",
    items: [
      {
        q: "ポテンツァのダウンタイムはどれくらいですか？",
        a: "施術後2〜3日ほど点状の出血（針跡）や赤みが出ることがあります。メイクは通常翌日から可能です。施術内容によって個人差があります。",
      },
      {
        q: "ボトックスの効果はどれくらい持続しますか？",
        a: "一般的に3〜6ヶ月ほど持続するとされています。繰り返し施術することで効果の持続が長くなる場合があります。",
      },
      {
        q: "レーザーとIPLはどう違いますか？",
        a: "レーザーは特定の波長の光を照射するため、ピンポイントでの治療に適しています。IPLは幅広い波長を照射するため、シミ・赤ら顔・毛穴など複合的な肌悩みに一度に対応できます。",
      },
      {
        q: "施術の組み合わせは可能ですか？",
        a: "複数の施術を組み合わせることで、相乗効果が期待できます。肌の状態や目標に合わせて最適な組み合わせをご提案します。",
      },
      {
        q: "敏感肌でも施術を受けられますか？",
        a: "敏感肌の方でも受けられる施術は多くありますが、事前にパッチテストが必要な場合があります。カウンセリングにて肌の状態をご確認のうえご提案いたします。",
      },
    ],
  },
  {
    id: "general",
    label: "ご予約・お支払いについて",
    en: "General",
    items: [
      {
        q: "カウンセリング料はいくらですか？",
        a: "カウンセリング料は5,500円（税込）です。施術内容やご不安な点など、お気軽にご相談ください。",
      },
      {
        q: "予約なしでも受診できますか？",
        a: "当院は完全予約制となっております。お電話またはWeb予約よりご予約ください。",
      },
      {
        q: "支払い方法は何がありますか？",
        a: "現金、クレジットカード（VISA・Mastercard・JCB・AMEX・Diners）、医療ローンに対応しております。",
      },
      {
        q: "未成年でも施術を受けられますか？",
        a: "未成年の方は、保護者の同意書が必要となります。カウンセリング時に保護者の方のご同席をお願いする場合がございます。",
      },
      {
        q: "キャンセル料はかかりますか？",
        a: "ご予約日の2営業日前17:00までのキャンセルは無料です。それ以降のキャンセルは3,000円（税込）のキャンセル料が発生いたします。詳しくはキャンセルポリシーをご確認ください。",
      },
    ],
  },
];

export default function FaqPage() {
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
            <span className="text-[var(--color-text-secondary)]">よくあるご質問</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            FAQ
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-widest text-[var(--color-brand-dark)] leading-tight">
            よくあるご質問
          </h1>
        </div>
      </section>

      {/* ── カテゴリナビ（スクロール追従 + アクティブ表示） ── */}
      <Suspense fallback={null}>
        <FaqNav categories={FAQ_CATEGORIES.map((c) => ({ id: c.id, label: c.label }))} />
      </Suspense>

      {/* ── FAQ セクション ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-container max-w-3xl space-y-20">
          {FAQ_CATEGORIES.map((cat, catIdx) => (
            <div key={cat.id} id={cat.id} className="scroll-mt-20">
              <ScrollFadeIn>
                <div className="flex items-end gap-3 mb-8">
                  <span
                    className="font-en text-5xl leading-none text-[var(--color-brand-dark)] select-none"
                    style={{ opacity: 0.06 }}
                    aria-hidden="true"
                  >
                    {String(catIdx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-en text-[10px] tracking-[0.3em] text-[var(--color-brand-gold)] mb-1">
                      {cat.en}
                    </p>
                    <h2 className="font-serif text-lg md:text-xl text-[var(--color-brand-dark)] tracking-wide">
                      {cat.label}
                    </h2>
                  </div>
                </div>
              </ScrollFadeIn>

              <div className="space-y-0">
                {cat.items.map((item, i) => (
                  <ScrollFadeIn key={i} delay={i * 0.03}>
                    <details className="group border-b border-[var(--color-brand-brown)]/10">
                      <summary className="flex items-start gap-4 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        <span className="shrink-0 font-en text-sm font-medium text-[var(--color-brand-gold)] mt-0.5">
                          Q.
                        </span>
                        <span className="flex-1 text-sm md:text-base text-[var(--color-brand-dark)] leading-relaxed tracking-wide">
                          {item.q}
                        </span>
                        <span className="shrink-0 w-5 h-5 mt-0.5 flex items-center justify-center text-[var(--color-brand-gold)] transition-transform group-open:rotate-45">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </span>
                      </summary>
                      <div className="flex items-start gap-4 pb-6 pl-0">
                        <span className="shrink-0 font-en text-sm font-medium text-[var(--color-brand-dark)]/30 mt-0.5">
                          A.
                        </span>
                        <p className="flex-1 text-sm text-[var(--color-text-secondary)] leading-[2.2] font-light">
                          {item.a}
                        </p>
                      </div>
                    </details>
                  </ScrollFadeIn>
                ))}
              </div>
            </div>
          ))}
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
            Contact
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-4 leading-relaxed tracking-wide">
            解決しないお悩みはお気軽にご相談ください
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-10 leading-relaxed font-light">
            カウンセリングは無料です。施術内容やダウンタイムなど、どんなことでもお聞きください。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://reservation.medical-force.com/c/0600773fd2b74afaba1282effeb9644d"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-4 min-w-[240px] py-4 bg-[var(--color-brand-dark)] text-white text-sm tracking-widest rounded-full hover:opacity-90 transition-opacity"
            >
              無料カウンセリング予約
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors"
            >
              お問い合わせフォーム
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
