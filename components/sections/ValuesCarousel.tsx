type ValueItem = {
  title: string;
  description: string;
  image?: string;
};

interface Props {
  items: ValueItem[];
}

export function ValuesCarousel({ items }: Props) {
  return (
    <div>
      <div className="overflow-x-auto">
        <div
          className="flex gap-6 px-[max(1.5rem,calc((100vw-1200px)/2+2rem))]"
          style={{ minWidth: "min-content" }}
        >
          {items.map((item, i) => (
            <div
              key={item.title}
              className="w-[80vw] md:w-[55vw] lg:w-[45vw] shrink-0"
            >
              <div className="bg-white border border-[var(--color-brand-brown)]/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex flex-col sm:flex-row">
                  {/* 左: 写真エリア */}
                  <div className="relative w-full sm:w-1/2 aspect-square sm:aspect-auto sm:min-h-[360px] shrink-0 bg-[var(--color-brand-cream)] overflow-hidden">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[var(--color-text-secondary)]/25 text-xs tracking-[0.25em]">PHOTO</span>
                      </div>
                    )}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(26,20,8,0.2) 0%, transparent 35%, transparent 65%, rgba(26,20,8,0.2) 100%), rgba(26,20,8,0.08)" }} />
                  </div>

                  {/* 右: テキスト */}
                  <div className="flex-1 flex flex-col justify-center p-8 sm:p-10 md:p-12">
                    <p className="font-en text-6xl md:text-7xl leading-none text-[var(--color-brand-gold)] mb-4" style={{ opacity: 0.15 }}>
                      {String(i + 1)}
                    </p>
                    <div className="w-8 h-px bg-[var(--color-brand-gold)] mb-5" />
                    <h3 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] mb-5 tracking-wide leading-relaxed">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-[2.2] font-light">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* スクロールヒント */}
      <div className="section-container mt-4">
        <p className="text-xs text-[var(--color-text-secondary)]/50 text-right tracking-wider">
          横にスクロールできます →
        </p>
      </div>
    </div>
  );
}
