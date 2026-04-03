import Link from "next/link";
import { CLINIC } from "@/lib/constants";

interface ConsultationCTAProps {
  /** "center": ボタン中央揃え / "left": 左揃え＋お問い合わせリンク付き */
  variant?: "center" | "left";
  subtitle?: React.ReactNode;
}

const DEFAULT_SUBTITLE = "院長が丁寧にご相談をお伺いし、あなたに最適なプランをご提案いたします。";

export function ConsultationCTA({
  variant = "center",
  subtitle = DEFAULT_SUBTITLE,
}: ConsultationCTAProps) {
  const isCenter = variant === "center";

  return (
    <section className="bg-white border-t border-[var(--color-brand-gold)]/20 py-16 md:py-20">
      <div className={`section-container ${isCenter ? "text-center" : ""}`}>
        <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-4">
          CONSULTATION
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-3 leading-relaxed">
          ご予約・ご相談はこちら
        </h2>
        <p className={`text-sm text-[var(--color-text-secondary)] leading-relaxed ${isCenter ? "mb-8" : "mb-10"}`}>
          {subtitle}
        </p>
        <div
          className={`flex flex-col sm:flex-row gap-4 ${
            isCenter
              ? "items-center justify-center"
              : "items-start mb-6"
          }`}
        >
          <a
            href={CLINIC.reservationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[var(--color-brand-gold)] text-[var(--color-brand-dark)] px-10 py-4 text-sm tracking-widest font-medium hover:opacity-90 transition-opacity"
          >
            Web予約
          </a>
          <a
            href={CLINIC.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-[var(--color-brand-dark)] text-[var(--color-brand-dark)] px-10 py-4 text-sm tracking-widest hover:bg-[var(--color-brand-dark)] hover:text-white transition-colors"
          >
            LINE予約
          </a>
        </div>
        {!isCenter && (
          <Link
            href="/contact"
            className="text-xs tracking-wider text-[var(--color-text-secondary)] underline underline-offset-4 hover:text-[var(--color-brand-gold)] transition-colors"
          >
            メールでのお問い合わせはこちら
          </Link>
        )}
      </div>
    </section>
  );
}
