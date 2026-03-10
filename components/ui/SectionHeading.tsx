interface SectionHeadingProps {
  en: string;
  ja: string;
  number?: string;
  className?: string;
}

export function SectionHeading({ en, ja, number, className = "" }: SectionHeadingProps) {
  return (
    <div className={`border-l-2 border-[var(--color-brand-gold)] pl-5 ${className}`}>
      <div className="flex items-baseline gap-3 mb-1.5">
        {number && (
          <span className="font-en text-xs text-[var(--color-brand-gold)] tracking-[0.3em]">
            {number}
          </span>
        )}
        <span className="font-en text-xs text-[var(--color-text-secondary)] tracking-[0.25em] uppercase">
          {en}
        </span>
      </div>
      <h2 className="text-2xl md:text-3xl font-light text-[var(--color-brand-dark)] tracking-wide">
        {ja}
      </h2>
    </div>
  );
}
