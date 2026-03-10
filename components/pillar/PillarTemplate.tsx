import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollFadeIn } from "@/components/ui/ScrollFadeIn";
import { CaseCarousel } from "@/components/sections/CaseCarousel";
import { FaqAccordion, type FaqItem } from "@/components/sections/FaqAccordion";

export type Treatment = {
  name: string;
  slug: string;
  desc: string;
};

export type PillarConfig = {
  slug: string;
  label: string;       // "口元"
  labelEn: string;     // "Mouth & Lips"
  tagline: string;
  heroImage: string;
  concerns: string[];
  treatments: Treatment[];
  faqs: FaqItem[];
  caseCategory: string;
};

export function PillarTemplate({ config }: { config: PillarConfig }) {
  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ height: "clamp(240px, 38vh, 420px)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />


        <div className="absolute inset-0 flex flex-col justify-end pb-10 md:pb-12">
          <div style={{ paddingLeft: "max(1.5rem, calc((100vw - 1200px) / 2 + 2rem))" }}>
            {/* パンくず */}
            <nav className="flex items-center gap-2 text-xs text-[var(--color-brand-dark)]/50 mb-8 tracking-wider">
              <Link href="/" className="hover:text-[var(--color-brand-dark)] transition-colors">HOME</Link>
              <span>/</span>
              <span className="text-[var(--color-brand-dark)]/80">{config.label}</span>
            </nav>

            <h1 className="font-en text-4xl md:text-5xl lg:text-6xl tracking-widest text-[var(--color-brand-dark)] mb-5 leading-none">
              {config.label}
            </h1>
          </div>
        </div>
      </section>

      {/* お悩みから選ぶ */}
      <section
        className="py-8"
        style={{ background: "linear-gradient(160deg, #f7f0e6 0%, #fdfcfa 100%)" }}
      >
        <div className="section-container">
          <p className="text-xs tracking-[0.25em] text-[var(--color-brand-gold)] mb-4">CONCERNS</p>
          <div className="flex flex-wrap gap-2">
            {config.concerns.map((concern) => (
              <span
                key={concern}
                className="px-4 py-1.5 text-sm font-light text-[var(--color-text-secondary)] border border-[var(--color-brand-brown)]/20 bg-white/80 rounded-full tracking-wide"
              >
                {concern}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 施術メニュー */}
      <section
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #fdfcfa 0%, #f5ede0 100%)" }}
      >
        <div className="section-container">
          <SectionHeading en="Treatment Menu" ja="施術メニュー" className="mb-12" />
          <div className="divide-y divide-[var(--color-brand-brown)]/10">
            {config.treatments.map((t, i) => (
              <ScrollFadeIn key={t.name} delay={i * 0.04}>
                <Link
                  href={`/${config.slug}/${t.slug}`}
                  className="group flex flex-col sm:flex-row overflow-hidden hover:bg-[var(--color-brand-cream)]/40 transition-colors duration-200"
                >
                  {/* 画像 */}
                  <div className="relative bg-[var(--color-brand-cream)] w-full sm:w-52 lg:w-64 shrink-0 aspect-[4/3]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[var(--color-text-secondary)]/30 text-xs tracking-[0.25em]">
                        PHOTO
                      </span>
                    </div>
                  </div>

                  {/* テキスト */}
                  <div className="flex flex-col justify-center px-6 py-5 sm:py-6">
                    <h3 className="font-serif text-base md:text-lg text-[var(--color-brand-dark)] mb-2 group-hover:text-[var(--color-brand-gold)] transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-xs md:text-sm text-[var(--color-text-secondary)] font-light leading-relaxed mb-4 max-w-xl">
                      {t.desc}
                    </p>
                    <span className="text-xs tracking-widest text-[var(--color-text-secondary)] group-hover:text-[var(--color-brand-gold)] transition-colors">
                      詳しく見る →
                    </span>
                  </div>
                </Link>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 症例実績 */}
      <section
        className="py-16 md:py-24 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #f7f0e6 0%, #fdfcfa 100%)" }}
      >
        <div className="section-container mb-10">
          <SectionHeading en="Case Results" ja="症例実績" />
        </div>
        <CaseCarousel defaultCategory={config.caseCategory} />
        <div className="text-center mt-10">
          <Link
            href="/case"
            className="inline-block border border-[var(--color-brand-dark)] px-8 py-3 text-sm tracking-wider text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white transition-colors"
          >
            症例一覧を見る
          </Link>
        </div>
      </section>

      {/* よくある質問 */}
      <section
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #fdfcfa 0%, #f5ede0 100%)" }}
      >
        <div className="section-container">
          <SectionHeading en="FAQ" ja="よくある質問" className="mb-12" />
          <div className="max-w-3xl">
            <FaqAccordion items={config.faqs} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-white border-t border-[var(--color-brand-gold)]/20">
        <div className="section-container">
          <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-4">
            CONSULTATION
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-3 leading-relaxed">
            ご予約・ご相談はこちら
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-10 leading-relaxed">
            院長が丁寧にご相談をお伺いし、<br className="sm:hidden" />あなたに最適なプランをご提案いたします。
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
            <a
              href="https://mpureju.com/reservation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[var(--color-brand-gold)] text-[var(--color-brand-dark)] px-10 py-4 text-sm tracking-widest font-medium hover:opacity-90 transition-opacity"
            >
              Web予約
            </a>
            <a
              href="https://lin.ee/maisonpureju"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-[var(--color-brand-dark)] text-[var(--color-brand-dark)] px-10 py-4 text-sm tracking-widest hover:bg-[var(--color-brand-dark)] hover:text-white transition-colors"
            >
              LINE予約
            </a>
          </div>
          <Link
            href="/contact"
            className="text-xs tracking-wider text-[var(--color-text-secondary)] underline underline-offset-4 hover:text-[var(--color-brand-gold)] transition-colors"
          >
            メールでのお問い合わせはこちら
          </Link>
        </div>
      </section>
    </>
  );
}
