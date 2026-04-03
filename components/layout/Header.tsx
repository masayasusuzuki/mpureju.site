"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

// ── メガメニューのカラムデータ ──

const megaColumns = [
  {
    title: "施術メニュー",
    items: [
      { label: "施術一覧", href: "/treatment" },
      { label: "口の整形・唇の整形", href: "/mouth" },
      { label: "目・目元の整形", href: "/eye" },
      { label: "鼻の整形", href: "/nose" },
      { label: "糸の施術・リフトアップ", href: "/lift" },
      { label: "美容皮膚科", href: "/skin" },
      { label: "内服薬", href: "/medicine" },
      { label: "医療機器一覧", href: "/machine" },
      { label: "美容コラム", href: "/column" },
    ],
  },
  {
    title: "症例写真",
    items: [
      { label: "すべての症例", href: "/case" },
      { label: "口元", href: "/case?pillar=口元" },
      { label: "目元", href: "/case?pillar=目元" },
      { label: "鼻", href: "/case?pillar=鼻" },
      { label: "リフトアップ", href: "/case?pillar=リフトアップ" },
      { label: "美容皮膚科", href: "/case?pillar=美容皮膚科" },
    ],
  },
  {
    title: "料金表",
    items: [
      { label: "すべての料金", href: "/price" },
      { label: "皮膚科", href: "/price#hifuka" },
      { label: "外科", href: "/price#geka" },
      { label: "点滴", href: "/price#tenteki" },
      { label: "内服薬", href: "/price#naifuku" },
      { label: "化粧品", href: "/price#keshouhin" },
      { label: "その他", href: "/price#sonota" },
    ],
  },
  {
    title: "当院について",
    items: [
      { label: "クリニック紹介", href: "/about" },
      { label: "院長紹介", href: "/doctor" },
      { label: "スタッフブログ", href: "/staff-blog" },
    ],
  },
  {
    title: "採用情報",
    items: [
      { label: "採用情報トップ", href: "/recruit" },
      { label: "看護師", href: "/recruit#nurse" },
      { label: "受付カウンセラー", href: "/recruit#receptionist" },
      { label: "広報 / SNSクリエイター", href: "/recruit#pr-creator" },
      { label: "エントリー", href: "/recruit/entry" },
    ],
  },
];

// PC ヘッダーのナビ項目（メガメニュートリガー）
const navTriggers = ["メニュー", "症例写真", "料金表", "当院について", "採用情報"];

export function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isTopPage = pathname === "/";
  const isTransparent = isTopPage && !isScrolled;

  // ページ遷移時にメニューを閉じる
  useEffect(() => {
    setMegaOpen(false);
    setMobileMenuOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMega = useCallback(() => setMegaOpen(false), []);

  const navTextClass = isTransparent
    ? "text-white/90 hover:text-white"
    : "text-[var(--color-text-primary)] hover:text-[var(--color-brand-gold)]";

  const navSubTextClass = isTransparent
    ? "text-white/80 hover:text-white"
    : "text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)]";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent && !megaOpen
          ? "bg-transparent border-b border-transparent"
          : "bg-[var(--color-brand-white)] border-b border-[var(--color-brand-cream)]"
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className={`font-en text-xl md:text-2xl tracking-widest transition-colors duration-300 ${
                isTransparent && !megaOpen ? "text-white" : "text-[var(--color-brand-dark)]"
              }`}
            >
              Maison PUREJU
            </span>
          </Link>

          {/* ── PC Navigation ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navTriggers.map((label) => (
              <button
                key={label}
                className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors duration-300 ${
                  megaOpen
                    ? "text-[var(--color-text-primary)] hover:text-[var(--color-brand-gold)]"
                    : navTextClass
                }`}
                onMouseEnter={() => setMegaOpen(true)}
              >
                {label}
                <svg className={`w-3 h-3 transition-transform ${megaOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ))}

            {/* 問い合わせ + 電話 */}
            <div className="ml-2 flex items-center gap-3 border-l border-current/10 pl-3">
              <Link
                href="/contact"
                className={`text-xs tracking-wider transition-colors duration-300 ${
                  megaOpen
                    ? "text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)]"
                    : navSubTextClass
                }`}
              >
                お問い合わせ
              </Link>
              <a
                href="tel:0332891222"
                className={`text-xs tracking-wider transition-colors duration-300 ${
                  megaOpen
                    ? "text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)]"
                    : navSubTextClass
                }`}
              >
                03-3289-1222
              </a>
            </div>

            {/* 予約ボタン */}
            <Link
              href="/reservation"
              className="ml-2 flex items-center px-5 py-2 bg-[var(--color-brand-dark)] text-white text-sm font-medium tracking-wider hover:opacity-90 transition-opacity"
            >
              予約
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-2 transition-colors duration-300 ${
              isTransparent ? "text-white" : "text-[var(--color-text-primary)]"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="メニュー"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <>
                <span className="block w-6 h-0.5 bg-current mb-1.5" />
                <span className="block w-6 h-0.5 bg-current mb-1.5" />
                <span className="block w-6 h-0.5 bg-current" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── PC メガメニュー ── */}
      {/* 背景オーバーレイ（常にDOM上、opacity制御） */}
      <div
        className={`fixed inset-0 top-16 md:top-20 bg-black/20 hidden lg:block transition-opacity duration-300 ${
          megaOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMega}
      />
      <div
        className={`hidden lg:block bg-white border-t border-[var(--color-brand-cream)] shadow-lg relative z-10 transition-all duration-300 ease-out overflow-hidden ${
          megaOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none border-t-transparent"
        }`}
        onMouseEnter={() => setMegaOpen(true)}
        onMouseLeave={closeMega}
      >
            <div className="section-container py-10">
              <div className="grid grid-cols-5 gap-0">
                {megaColumns.map((col, colIdx) => (
                  <div
                    key={col.title}
                    className={`px-6 ${colIdx < megaColumns.length - 1 ? "border-r border-[var(--color-brand-gold)]/10" : ""}`}
                  >
                    <p className="text-xs tracking-[0.2em] text-[var(--color-brand-gold)] font-medium mb-2">
                      {col.title}
                    </p>
                    <div className="w-8 h-px bg-[var(--color-brand-gold)] mb-4" />
                    <ul className="space-y-0.5">
                      {col.items.map((item, itemIdx) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`group/link inline-flex flex-col py-1.5 text-sm transition-colors ${
                              itemIdx === 0
                                ? "text-[var(--color-brand-dark)] font-normal hover:text-[var(--color-brand-gold)]"
                                : "text-[var(--color-text-secondary)] font-light hover:text-[var(--color-brand-gold)]"
                            }`}
                            onClick={closeMega}
                          >
                            {item.label}
                            <span className="h-px w-0 group-hover/link:w-full bg-[var(--color-brand-gold)] transition-all duration-300" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

      {/* ── モバイルメニュー ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[var(--color-brand-cream)] max-h-[80vh] overflow-y-auto">
          {megaColumns.map((col) => (
            <div key={col.title}>
              <button
                className="flex items-center justify-between w-full px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-brand-cream)]"
                onClick={() => setMobileExpanded(mobileExpanded === col.title ? null : col.title)}
              >
                {col.title}
                <svg
                  className={`w-3 h-3 transition-transform ${mobileExpanded === col.title ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileExpanded === col.title && (
                <div className="bg-[var(--color-brand-cream)]/30">
                  {col.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-10 py-2.5 text-sm text-[var(--color-text-secondary)] border-b border-[var(--color-brand-cream)]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/contact"
            className="block px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-brand-cream)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            お問い合わせ
          </Link>
          <Link
            href="/reservation"
            className="flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-[var(--color-brand-gold)] border-b border-[var(--color-brand-cream)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            ご予約・ご来院の流れ
          </Link>
          <a
            href="tel:0332891222"
            className="block px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-brand-cream)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            03-3289-1222
          </a>
        </div>
      )}
    </header>
  );
}
