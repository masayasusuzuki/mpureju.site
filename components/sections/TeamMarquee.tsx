"use client";

export function TeamMarquee({
  photos,
  speed = 40,
}: {
  photos: string[];
  speed?: number;
}) {
  if (photos.length === 0) return null;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-36 md:w-56 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-36 md:w-56 bg-gradient-to-l from-white to-transparent" />
      <div
        className="flex gap-5"
        style={{
          width: "max-content",
          animation: `marquee-scroll ${speed}s linear infinite`,
        }}
      >
        {[...photos, ...photos].map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-52 h-72 bg-[var(--color-brand-cream)] overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover object-top brightness-125 contrast-90"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
