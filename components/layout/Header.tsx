"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "施術一覧", href: "/treatment" },
  { label: "口の整形・唇の整形", href: "/mouth" },
  { label: "目・目元の整形", href: "/eye" },
  { label: "鼻の整形", href: "/nose" },
  { label: "糸の施術・リフトアップ", href: "/lift" },
  { label: "美容皮膚科", href: "/skin" },
  { label: "内服薬", href: "/medicine" },
  { label: "医療機器一覧", href: "/machine" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isTopPage = pathname === "/";
  const isTransparent = isTopPage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    // 初期状態を確認（ページリロード時にスクロール済みの場合）
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
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
                isTransparent ? "text-white" : "text-[var(--color-brand-dark)]"
              }`}
            >
              Maison PUREJU
            </span>
          </Link>

          {/* PC Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* メニュー▼ dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors duration-300 ${
                  isTransparent
                    ? "text-white/90 hover:text-white"
                    : "text-[var(--color-text-primary)] hover:text-[var(--color-brand-gold)]"
                }`}
              >
                メニュー
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute top-full left-0 mt-0 w-52 bg-white border border-[var(--color-brand-cream)] shadow-lg py-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-brand-cream)] hover:text-[var(--color-brand-dark)] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/case"
              className={`px-3 py-2 text-sm transition-colors duration-300 ${
                isTransparent
                  ? "text-white/90 hover:text-white"
                  : "text-[var(--color-text-primary)] hover:text-[var(--color-brand-gold)]"
              }`}
            >
              症例写真
            </Link>
            <Link
              href="/price"
              className={`px-3 py-2 text-sm transition-colors duration-300 ${
                isTransparent
                  ? "text-white/90 hover:text-white"
                  : "text-[var(--color-text-primary)] hover:text-[var(--color-brand-gold)]"
              }`}
            >
              料金表
            </Link>
            <Link
              href="/doctor"
              className={`px-3 py-2 text-sm transition-colors duration-300 ${
                isTransparent
                  ? "text-white/90 hover:text-white"
                  : "text-[var(--color-text-primary)] hover:text-[var(--color-brand-gold)]"
              }`}
            >
              院長紹介
            </Link>
            <Link
              href="/recruit"
              className={`px-3 py-2 text-sm transition-colors duration-300 ${
                isTransparent
                  ? "text-white/90 hover:text-white"
                  : "text-[var(--color-text-primary)] hover:text-[var(--color-brand-gold)]"
              }`}
            >
              採用情報
            </Link>

            {/* 問い合わせ + 電話 */}
            <div className="ml-2 flex items-center gap-3 border-l border-current/10 pl-3">
              <Link
                href="/contact"
                className={`text-xs tracking-wider transition-colors duration-300 ${
                  isTransparent
                    ? "text-white/80 hover:text-white"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)]"
                }`}
              >
                お問い合わせ
              </Link>
              <a
                href="tel:0332891222"
                className={`text-xs tracking-wider transition-colors duration-300 ${
                  isTransparent
                    ? "text-white/80 hover:text-white"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)]"
                }`}
              >
                03-3289-1222
              </a>
            </div>

            {/* 予約ドロップダウン */}
            <div
              className="ml-2 relative"
              onMouseEnter={() => setBookingOpen(true)}
              onMouseLeave={() => setBookingOpen(false)}
            >
              <button
                className="flex items-center gap-1.5 px-5 py-2 bg-[var(--color-brand-gold)] text-[var(--color-brand-dark)] text-sm font-medium tracking-wider hover:opacity-90 transition-opacity"
              >
                予約
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {bookingOpen && (
                <div className="absolute top-full right-0 mt-0 w-44 bg-white border border-[var(--color-brand-cream)] shadow-lg py-2">
                  <a
                    href="https://lin.ee/maisonpureju"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-brand-cream)] hover:text-[var(--color-brand-dark)] transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#06C755] shrink-0" />
                    LINE予約
                  </a>
                  <a
                    href="https://mpureju.com/reservation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-brand-cream)] hover:text-[var(--color-brand-dark)] transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-[var(--color-brand-gold)] shrink-0" />
                    Web予約
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-2 transition-colors duration-300 ${
              isTransparent ? "text-white" : "text-[var(--color-text-primary)]"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="メニュー"
          >
            <span className="block w-6 h-0.5 bg-current mb-1.5" />
            <span className="block w-6 h-0.5 bg-current mb-1.5" />
            <span className="block w-6 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile menu drawer - 常に白背景 */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[var(--color-brand-cream)] max-h-[80vh] overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-brand-cream)]"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/case"
            className="block px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-brand-cream)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            症例写真
          </Link>
          <Link
            href="/price"
            className="block px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-brand-cream)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            料金表
          </Link>
          <Link
            href="/doctor"
            className="block px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-brand-cream)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            院長紹介
          </Link>
          <Link
            href="/recruit"
            className="block px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-brand-cream)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            採用情報
          </Link>
          <Link
            href="/contact"
            className="block px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-brand-cream)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            お問い合わせ
          </Link>
          <a
            href="https://lin.ee/maisonpureju"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-brand-cream)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="w-2 h-2 rounded-full bg-[#06C755]" />
            LINE予約
          </a>
          <a
            href="https://mpureju.com/reservation"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-brand-cream)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-gold)]" />
            Web予約
          </a>
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
