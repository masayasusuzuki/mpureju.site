"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type Position = {
  id: string;
  title: string;
  tagline: string;
  employmentType: string;
  tasks: string[];
  hours: string;
  salary: string;
  requirements?: string[];
  preferred?: string[];
  image?: string;
};

interface Props {
  positions: Position[];
}

export function PositionAccordion({ positions }: Props) {
  const [openId, setOpenId] = useState<string | null>(positions[0]?.id ?? null);

  // URLハッシュで該当アコーディオンを開く
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && positions.some((p) => p.id === hash)) {
      setOpenId(hash);
      // レイアウト完了を待ってからスクロール
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      });
    }
  }, [positions]);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="divide-y divide-[var(--color-brand-brown)]/15">
      {positions.map((pos, i) => {
        const isOpen = openId === pos.id;
        return (
          <div key={pos.id} id={pos.id} style={{ scrollMarginTop: "6rem" }}>
            {/* ヘッダー（クリックで開閉） */}
            <button
              type="button"
              onClick={() => toggle(pos.id)}
              className="w-full flex items-center gap-4 md:gap-6 py-6 md:py-8 text-left group hover:bg-[var(--color-brand-cream)]/50 transition-colors rounded-sm px-2 -mx-2"
            >
              <span
                className="font-en text-3xl md:text-4xl leading-none text-[var(--color-brand-gold)] shrink-0"
                style={{ opacity: 0.4 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] px-2.5 py-0.5 tracking-wider">
                    {pos.employmentType}
                  </span>
                </div>
                <h3 className="font-serif text-lg md:text-xl text-[var(--color-brand-dark)] group-hover:text-[var(--color-brand-gold)] transition-colors">
                  {pos.title}
                </h3>
              </div>
              <div className={`shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-[var(--color-brand-gold)] border-[var(--color-brand-gold)]" : "border-[var(--color-brand-gold)]/40 group-hover:border-[var(--color-brand-gold)]"}`}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : "text-[var(--color-brand-gold)]"}`}
                >
                  <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {/* コンテンツ */}
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="pb-8 md:pb-10 pl-12 md:pl-16">
                  <p className="text-sm text-[var(--color-text-secondary)] font-light mb-6 leading-relaxed">
                    {pos.tagline}
                  </p>

                  {/* 写真 */}
                  <div className="relative w-full aspect-[2/1] bg-[var(--color-brand-cream)] rounded-sm overflow-hidden mb-8">
                    {pos.image ? (
                      <Image
                        src={pos.image}
                        alt={pos.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 700px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[var(--color-text-secondary)]/25 text-xs tracking-[0.25em]">PHOTO</span>
                      </div>
                    )}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(26,20,8,0.2) 0%, transparent 35%, transparent 65%, rgba(26,20,8,0.2) 100%), rgba(26,20,8,0.08)" }} />
                  </div>

                  {/* 詳細 */}
                  <div className="border border-[var(--color-brand-brown)]/10 rounded-sm overflow-hidden mb-8">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-[var(--color-brand-brown)]/10">
                        <tr>
                          <th className="bg-[var(--color-brand-cream)]/60 text-left px-5 py-4 text-xs tracking-widest text-[var(--color-brand-gold)] font-normal w-[110px] md:w-[140px] align-top">
                            業務内容
                          </th>
                          <td className="px-5 py-4 text-[var(--color-text-secondary)] font-light leading-relaxed">
                            {pos.tasks.join(" / ")}
                          </td>
                        </tr>
                        <tr>
                          <th className="bg-[var(--color-brand-cream)]/60 text-left px-5 py-4 text-xs tracking-widest text-[var(--color-brand-gold)] font-normal align-top">
                            勤務時間
                          </th>
                          <td className="px-5 py-4 text-[var(--color-text-secondary)] font-light">
                            {pos.hours}
                          </td>
                        </tr>
                        <tr>
                          <th className="bg-[var(--color-brand-cream)]/60 text-left px-5 py-4 text-xs tracking-widest text-[var(--color-brand-gold)] font-normal align-top">
                            給与
                          </th>
                          <td className="px-5 py-4 text-[var(--color-text-secondary)] font-light">
                            {pos.salary}
                          </td>
                        </tr>
                        {pos.requirements && (
                          <tr>
                            <th className="bg-[var(--color-brand-cream)]/60 text-left px-5 py-4 text-xs tracking-widest text-[var(--color-brand-gold)] font-normal align-top">
                              応募条件
                            </th>
                            <td className="px-5 py-4 text-[var(--color-text-secondary)] font-light leading-relaxed">
                              {pos.requirements.join(" / ")}
                            </td>
                          </tr>
                        )}
                        {pos.preferred && (
                          <tr>
                            <th className="bg-[var(--color-brand-cream)]/60 text-left px-5 py-4 text-xs tracking-widest text-[var(--color-brand-gold)] font-normal align-top">
                              歓迎
                            </th>
                            <td className="px-5 py-4 text-[var(--color-text-secondary)] font-light leading-relaxed">
                              {pos.preferred.join(" / ")}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/recruit/entry?position=${pos.id}`}
                    className="inline-flex items-center justify-center gap-3 bg-[var(--color-brand-dark)] text-white px-8 py-3.5 text-sm tracking-widest rounded-full hover:opacity-90 transition-opacity"
                  >
                    {pos.title}にエントリー
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
