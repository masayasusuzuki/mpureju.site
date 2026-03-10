"use client";

import { useState } from "react";
import Link from "next/link";

const TABS = [
  { id: "teens",    label: "10・20代", image: "/persona/20s_lady.jpg" },
  { id: "thirties", label: "30・40代", image: "/persona/30s_lady.jpg" },
  { id: "fifties",  label: "50代以上", image: "/persona/50s_lady.jpg" },
  { id: "men",      label: "男性美容", image: "/persona/mens.jpg"     },
];

// btnY: ボタン中心 Y (%)  dotX/dotY: 顔上のコネクション点 (%)
const LEFT_PARTS = [
  { name: "目元",  href: "/eye/",   btnY: 33, dotX: 44, dotY: 33 },
  { name: "鼻",    href: "/nose/",  btnY: 51, dotX: 48, dotY: 51 },
  { name: "口元",  href: "/mouth/", btnY: 65, dotX: 48, dotY: 64 },
] as const;

const RIGHT_PARTS = [
  { name: "美容皮膚科",   href: "/skin/", btnY: 38, dotX: 61, dotY: 44 },
  { name: "リフトアップ", href: "/lift/", btnY: 58, dotX: 63, dotY: 54 },
] as const;

const L = 15;
const R = 84;

// ラインの始点: ボタン端から少し離した位置
const L_LINE_X = L + 8;
const R_LINE_X = R - 9;

export function FaceMenu() {
  const [active, setActive] = useState("teens");

  return (
    <div>
      {/* ── タブ ── */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`relative py-4 md:py-5 text-sm tracking-[0.2em] font-light transition-colors ${
              active === tab.id
                ? "bg-[var(--color-brand-gold)] text-white"
                : "bg-white text-[var(--color-text-secondary)] border border-[var(--color-brand-brown)]/10 hover:bg-[var(--color-brand-cream)]"
            }`}
          >
            {tab.label}
            {active === tab.id && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full z-10"
                style={{
                  width: 0, height: 0,
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderTop: "8px solid var(--color-brand-gold)",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── 顔画像エリア（PC） ── */}
      <div className="relative hidden md:block aspect-video bg-[var(--color-brand-cream)] overflow-hidden">

        {/* ペルソナ画像 */}
        {TABS.map((tab) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={tab.id}
            src={tab.image}
            alt={tab.label}
            className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500"
            style={{ opacity: active === tab.id ? 1 : 0 }}
          />
        ))}

        {/* SVG ライン（preserveAspectRatio="none" はライン用） */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {LEFT_PARTS.map((p) => (
            <line
              key={p.name}
              x1={L_LINE_X} y1={p.btnY}
              x2={p.dotX}   y2={p.dotY}
              stroke="rgba(201,169,110,0.7)"
              strokeWidth="0.25"
            />
          ))}
          {RIGHT_PARTS.map((p) => (
            <line
              key={p.name}
              x1={R_LINE_X} y1={p.btnY}
              x2={p.dotX}   y2={p.dotY}
              stroke="rgba(201,169,110,0.7)"
              strokeWidth="0.25"
            />
          ))}
        </svg>

        {/* ドット（正円）— 絶対配置で個別レンダリング */}
        {[...LEFT_PARTS, ...RIGHT_PARTS].map((p) => (
          <div
            key={p.name}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{
              left: `${p.dotX}%`,
              top: `${p.dotY}%`,
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(201,169,110,1)",
            }}
          />
        ))}

        {/* 左ラベル */}
        {LEFT_PARTS.map((p) => (
          <Link
            key={p.name}
            href={p.href}
            className="absolute group whitespace-nowrap"
            style={{
              left: `${L}%`,
              top: `${p.btnY}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="flex items-center rounded-full border-l-2 border-[var(--color-brand-gold)] pl-5 pr-7 py-3 bg-white/80 backdrop-blur-sm shadow-sm group-hover:bg-white/95 transition-all duration-200">
              <span className="text-base tracking-[0.15em] text-[var(--color-brand-dark)] font-light">
                {p.name}
              </span>
            </div>
          </Link>
        ))}

        {/* 右ラベル */}
        {RIGHT_PARTS.map((p) => (
          <Link
            key={p.name}
            href={p.href}
            className="absolute group whitespace-nowrap"
            style={{
              left: `${R}%`,
              top: `${p.btnY}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="flex items-center rounded-full border-l-2 border-[var(--color-brand-gold)] pl-5 pr-7 py-3 bg-white/80 backdrop-blur-sm shadow-sm group-hover:bg-white/95 transition-all duration-200">
              <span className="text-base tracking-[0.15em] text-[var(--color-brand-dark)] font-light">
                {p.name}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* ── モバイル ── */}
      <div className="md:hidden grid grid-cols-2 gap-2 mt-4">
        {[...LEFT_PARTS, ...RIGHT_PARTS].map((p) => (
          <Link
            key={p.name}
            href={p.href}
            className="flex items-center border-l-2 border-[var(--color-brand-gold)] pl-3 pr-4 py-2.5 bg-white text-xs tracking-[0.15em] text-[var(--color-brand-dark)] font-light hover:bg-[var(--color-brand-cream)] transition-colors"
          >
            {p.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
