import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "キャンセルポリシー｜Maison PUREJU",
  description:
    "Maison PUREJU（銀座）のご予約キャンセル・変更に関するポリシーをご案内いたします。",
};

export default function CancelPolicyPage() {
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
            <span className="text-[var(--color-text-secondary)]">キャンセルポリシー</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            CANCELLATION POLICY
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-widest text-[var(--color-brand-dark)] leading-tight">
            キャンセルポリシー
          </h1>
        </div>
      </section>

      {/* ── 本文 ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-container max-w-3xl">
          <div className="space-y-12 text-sm text-[var(--color-text-secondary)] leading-[2.2] font-light">
            <p>
              Maison PUREJUでは、より多くの患者様に適切なタイミングで施術をお受けいただくため、以下のキャンセルポリシーを設けております。ご理解・ご協力のほどお願いいたします。
            </p>

            <PolicySection title="ご予約の変更・キャンセルについて">
              <p>
                ご予約の変更・キャンセルは、ご予約日より<span className="font-medium text-[var(--color-brand-dark)]">2営業日前の17:00まで</span>にお電話にてご連絡ください。
              </p>
              <div className="bg-[var(--color-brand-cream)] px-6 py-5 mt-4">
                <p>TEL: 03-3289-1222</p>
                <p>受付時間: 10:00〜19:00</p>
              </div>
            </PolicySection>

            <PolicySection title="キャンセル料について">
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-brand-gold)]/30">
                      <th className="text-left py-3 pr-4 font-medium text-[var(--color-brand-dark)]">連絡時期</th>
                      <th className="text-left py-3 font-medium text-[var(--color-brand-dark)]">キャンセル料</th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-secondary)]">
                    <tr className="border-b border-[var(--color-brand-brown)]/10">
                      <td className="py-3 pr-4">2営業日前の17:00まで</td>
                      <td className="py-3">無料</td>
                    </tr>
                    <tr className="border-b border-[var(--color-brand-brown)]/10">
                      <td className="py-3 pr-4">2営業日前の17:00以降</td>
                      <td className="py-3">3,000円（税込）</td>
                    </tr>
                    <tr className="border-b border-[var(--color-brand-brown)]/10">
                      <td className="py-3 pr-4">無断キャンセル</td>
                      <td className="py-3">3,000円（税込）</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </PolicySection>

            <PolicySection title="遅刻について">
              <p>
                ご予約時間に遅れる場合は、お早めにお電話ください。遅刻の状況に応じて、当日お受けいただける施術内容を当院よりご提案させていただきます。
              </p>
            </PolicySection>

            <PolicySection title="キャンセル・変更の回数制限について">
              <p>
                キャンセルや変更を<span className="font-medium text-[var(--color-brand-dark)]">3回以上連続</span>で行われた場合、または<span className="font-medium text-[var(--color-brand-dark)]">無断キャンセルを2回</span>された場合は、以降のご予約を承ることができなくなります。あらかじめご了承ください。
              </p>
            </PolicySection>

            <PolicySection title="当院都合によるキャンセルについて">
              <p>
                やむを得ない事情（医師の体調不良・緊急対応等）により、当院都合でご予約を変更させていただく場合がございます。その際は速やかにご連絡の上、振替日程のご相談をさせていただきます。当院都合によるキャンセルの場合、キャンセル料は一切発生いたしません。
              </p>
            </PolicySection>

            <PolicySection title="コース契約の中途解約について">
              <p>
                コース契約の中途解約については、特定商取引法に基づき対応いたします。詳細は
                <Link href="/legal" className="text-[var(--color-brand-gold)] underline underline-offset-2">
                  特定商取引法に基づく表示
                </Link>
                をご参照ください。
              </p>
            </PolicySection>

            <PolicySection title="お問い合わせ">
              <p>
                キャンセルポリシーに関するご不明点は、お気軽にお問い合わせください。
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
            </PolicySection>
          </div>
        </div>
      </section>
    </>
  );
}

function PolicySection({
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
