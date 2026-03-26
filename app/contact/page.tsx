import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ｜Maison PUREJU 銀座の美容外科・美容皮膚科",
  description:
    "Maison PUREJUへのお問い合わせはこちら。施術内容・料金・カウンセリングのご予約など、お気軽にご相談ください。",
};

const CLINIC_INFO = [
  {
    label: "住所",
    value: "〒104-0061\n東京都中央区銀座５丁目３−１３\nGinza SS 85ビル 4F",
  },
  {
    label: "電話",
    value: "03-3289-1222",
    href: "tel:0332891222",
  },
  {
    label: "診療時間",
    value: "10:00 〜 19:00",
  },
  {
    label: "休診日",
    value: "月曜日・不定休",
  },
  {
    label: "アクセス",
    value: "東京メトロ銀座駅 徒歩1分\nJR有楽町駅 徒歩5分",
  },
];

export default function ContactPage() {
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
            <span className="text-[var(--color-text-secondary)]">お問い合わせ</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            CONTACT
          </p>
          <h1 className="font-en text-5xl md:text-6xl tracking-widest text-[var(--color-brand-dark)] mb-4 leading-none">
            お問い合わせ
          </h1>
          <p className="text-xs tracking-widest text-[var(--color-text-secondary)]">
            施術・料金・カウンセリングなど、お気軽にご相談ください
          </p>
        </div>
      </section>

      {/* ===== フォーム + クリニック情報 ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">

            {/* フォーム */}
            <div>
              <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-8">
                INQUIRY FORM
              </p>
              <ContactForm />
            </div>

            {/* クリニック情報 */}
            <div className="lg:pt-10">
              <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-8">
                CLINIC INFO
              </p>
              <dl className="space-y-6 mb-10">
                {CLINIC_INFO.map((item) => (
                  <div key={item.label} className="border-b border-[var(--color-brand-gold)]/15 pb-6">
                    <dt className="text-[10px] tracking-widest text-[var(--color-text-secondary)]/60 mb-1.5">
                      {item.label}
                    </dt>
                    <dd className="text-sm text-[var(--color-brand-dark)] leading-relaxed whitespace-pre-line">
                      {item.href ? (
                        <a href={item.href} className="hover:text-[var(--color-brand-gold)] transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* 予約ボタン */}
              <div className="space-y-3">
                <a
                  href="https://reservation.medical-force.com/c/0600773fd2b74afaba1282effeb9644d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-3.5 bg-[var(--color-brand-gold)] text-[var(--color-brand-dark)] text-xs tracking-widest font-medium hover:opacity-90 transition-opacity"
                >
                  Web予約
                </a>
                <a
                  href="https://lin.ee/maisonpureju"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-3.5 bg-[#06C755] text-white text-xs tracking-widest font-medium hover:opacity-90 transition-opacity"
                >
                  LINE予約
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Notes ===== */}
      <section className="py-12 md:py-16 border-t border-[var(--color-brand-gold)]/20 bg-white">
        <div className="section-container">
          <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-6">
            NOTES
          </p>
          <ul className="space-y-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              お問い合わせへの返信は通常2〜3営業日以内に行っております。
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              診察・施術のご予約はWebまたはLINEよりお願いいたします。
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              お急ぎの場合はお電話（03-3289-1222）にてお問い合わせください。
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              ご入力いただいた個人情報は、お問い合わせへの対応にのみ使用いたします。
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
