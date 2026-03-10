"use client";

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  image: string;
}

const PLACEHOLDERS = Array.from({ length: 6 }, (_, i) => ({ id: String(i) }));

export function TeamMarquee({
  members,
  speed = 40,
}: {
  members?: TeamMember[];
  speed?: number;
}) {
  const items = members ?? PLACEHOLDERS;

  return (
    <div className="overflow-hidden">
      {/* アイテムを2セット並べて -50% までスライドでシームレスループ */}
      <div
        className="flex gap-5"
        style={{
          width: "max-content",
          animation: `marquee-scroll ${speed}s linear infinite`,
        }}
      >
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-52 h-72 bg-[var(--color-brand-cream)] overflow-hidden"
          >
            {"image" in item ? (
              <div className="relative w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={(item as TeamMember).image}
                  alt={(item as TeamMember).name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
                  <p className="text-white text-sm font-medium leading-tight">
                    {(item as TeamMember).name}
                  </p>
                  <p className="text-white/70 text-xs mt-0.5">
                    {(item as TeamMember).title}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
