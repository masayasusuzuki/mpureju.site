import type { Metadata } from "next";
import Link from "next/link";
import { ReservationFlow } from "./ReservationFlow";
import { getClinicCalendar } from "@/lib/supabase/queries";
import { ClinicCalendarWidget } from "@/components/ui/ClinicCalendarWidget";

export const metadata: Metadata = {
  title: "ご予約・ご来院の流れ｜Maison PUREJU 銀座",
  description:
    "Maison PUREJU 銀座のご予約方法（Web・LINE・電話）と、初めての方向けのご来院から帰宅までの流れをご案内いたします。",
};

const BOOKING_METHODS = [
  {
    label: "Web予約",
    labelEn: "WEB",
    href: "https://reservation.medical-force.com/c/0600773fd2b74afaba1282effeb9644d",
    desc: "24時間いつでもご予約いただけます。ご希望の日時・メニューをお選びください。",
    color: "bg-[var(--color-brand-gold)]",
    textColor: "text-[var(--color-brand-dark)]",
  },
  {
    label: "LINE予約",
    labelEn: "LINE",
    href: "https://lin.ee/maisonpureju",
    desc: "LINEでお気軽にご相談・ご予約が可能です。友だち追加後、トーク画面からご連絡ください。",
    color: "bg-[#06C755]",
    textColor: "text-white",
  },
];

const TIME_ESTIMATES = [
  {
    category: "皮膚科",
    desc: "当日施術までご希望の方",
    time: "2〜3時間程度",
  },
  {
    category: "皮膚科・外科",
    desc: "当日相談のみご希望の方",
    time: "1時間15分程度",
  },
  {
    category: "外科",
    desc: "当日相談+契約をご希望の方",
    time: "1時間30分程度",
  },
];

export default async function ReservationPage() {
  const calendar = await getClinicCalendar();

  return (
    <article>
      {/* ── Hero ── */}
      <section
        style={{
          background:
            "linear-gradient(150deg, #fdfcfa 0%, #f0e8d8 60%, #e8dcc8 100%)",
        }}
      >
        <div className="relative section-container py-14 md:py-20">
          <nav className="flex items-center gap-2 text-xs text-[var(--color-brand-dark)]/50 mb-8 tracking-wider">
            <Link
              href="/"
              className="hover:text-[var(--color-brand-dark)] transition-colors"
            >
              HOME
            </Link>
            <span>/</span>
            <span className="text-[var(--color-brand-dark)]/80">
              ご予約・ご来院の流れ
            </span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-3">
            RESERVATION
          </p>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--color-brand-dark)] tracking-wide">
            ご予約・ご来院の流れ
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-4 max-w-2xl leading-relaxed">
            初めての方も安心してご来院いただけるよう、ご予約方法から施術当日の流れまでご案内いたします。
          </p>
        </div>
      </section>

      {/* ── 予約方法 ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-2">
              HOW TO BOOK
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)]">
              ご予約方法
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {BOOKING_METHODS.map((m) => (
              <div
                key={m.labelEn}
                className="flex flex-col border border-[var(--color-brand-brown)]/10 rounded-sm overflow-hidden px-6 py-8 text-center"
              >
                <p className="font-en text-[0.625rem] tracking-[0.25em] text-[var(--color-brand-gold)] mb-2">
                  {m.labelEn}
                </p>
                <p className="font-serif text-lg text-[var(--color-brand-dark)] mb-4">
                  {m.label}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6">
                  {m.desc}
                </p>
                <a
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-auto inline-flex items-center justify-center w-full py-3.5 ${m.color} ${m.textColor} text-xs tracking-widest font-medium rounded-sm hover:opacity-90 transition-opacity`}
                >
                  {m.label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ご来院の流れ ── */}
      <section className="py-16 md:py-24 bg-[var(--color-brand-cream)]/40">
        <div className="section-container">
          <div className="text-center mb-12">
            <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-2">
              FIRST VISIT GUIDE
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)]">
              初めての方へ — ご来院の流れ
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-3">
              ご来院からお帰りまで、すべて完全個室でご案内いたします。
            </p>
          </div>

          <ReservationFlow />
        </div>
      </section>

      {/* ── 目安時間 ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-container">
          <div className="text-center mb-10">
            <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-2">
              ESTIMATED TIME
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)]">
              初めての方のご来院〜ご帰宅までの目安時間
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-3">
              ※施術内容により変動あり
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {TIME_ESTIMATES.map((t) => (
              <div
                key={t.category}
                className="border border-[var(--color-brand-gold)]/20 rounded-sm px-6 py-8 text-center bg-white"
              >
                <p className="text-xs font-medium tracking-wider text-[var(--color-brand-gold)] bg-[var(--color-brand-cream)] inline-block px-4 py-1.5 rounded-full mb-4">
                  {t.category}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                  {t.desc}
                </p>
                <p className="font-serif text-2xl text-[var(--color-brand-dark)] tracking-wide">
                  {t.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── キャンセルポリシー ── */}
      <section className="py-14 md:py-20 bg-white border-t border-[var(--color-brand-brown)]/8">
        <div className="section-container max-w-3xl">
          <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-2 text-center">
            CANCELLATION POLICY
          </p>
          <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] text-center mb-8">
            予約の変更・キャンセルについて
          </h2>
          <div className="space-y-4 text-sm text-[var(--color-text-secondary)] leading-[1.9]">
            <p>
              キャンセル及び変更のお申し出はご予約日より<strong className="text-[var(--color-brand-dark)]">2営業日前の17:00まで</strong>とさせていただきます。ご予約時間に遅れる場合は、当日お受けいただける施術内容をクリニックよりご提案させていただきます。
            </p>
            <p>
              ご予約日より2営業日前17:00以降のキャンセル及び変更につきましては<strong className="text-[var(--color-brand-dark)]">3,000円（税込）のキャンセル料</strong>を頂戴しておりますのでご了承ください。
            </p>
            <p>
              ご予約のキャンセルや変更を3回以上連続、もしくは無断キャンセルを2回された患者様におかれましては予約を承ることができなくなります。
            </p>
          </div>
        </div>
      </section>

      {/* ── 営業カレンダー ── */}
      {calendar && (
        <section className="py-14 md:py-20 bg-[var(--color-brand-cream)]/40">
          <div className="section-container max-w-2xl">
            <div className="text-center mb-8">
              <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-2">
                CALENDAR
              </p>
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

    </article>
  );
}
