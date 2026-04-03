import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageHref: (p: number) => string;
}

export function Pagination({ currentPage, totalPages, pageHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const prevClass =
    "flex items-center justify-center w-10 h-10 border border-[var(--color-brand-brown)]/15 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)] transition-colors";

  return (
    <nav className="flex items-center justify-center gap-2 mt-14">
      {currentPage > 1 && (
        <Link href={pageHref(currentPage - 1)} className={prevClass}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={pageHref(p)}
          className={`flex items-center justify-center w-10 h-10 text-sm font-en tracking-wider transition-colors ${
            p === currentPage
              ? "bg-[var(--color-brand-gold)] text-white"
              : "border border-[var(--color-brand-brown)]/15 text-[var(--color-text-secondary)] hover:border-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)]"
          }`}
        >
          {p}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link href={pageHref(currentPage + 1)} className={prevClass}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
    </nav>
  );
}
