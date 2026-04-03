import Image from "next/image";
import Link from "next/link";

interface SidebarListItem {
  id: string;
  slug: string;
  title: string;
  thumbnail?: { url: string };
  label?: string; // カテゴリや施術名など
}

interface SidebarListProps {
  title: string;
  items: SidebarListItem[];
  basePath: string; // e.g. "/column", "/case", "/staff-blog"
}

export function SidebarList({ title, items, basePath }: SidebarListProps) {
  if (items.length === 0) return null;

  return (
    <div className="border border-[var(--color-brand-brown)]/10 rounded-sm">
      <div className="px-4 py-3 border-b border-[var(--color-brand-brown)]/10">
        <p className="text-xs tracking-[0.15em] text-[var(--color-brand-dark)] font-medium">
          {title}
        </p>
      </div>
      <ul className="divide-y divide-[var(--color-brand-brown)]/5">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`${basePath}/${item.slug}`}
              className="flex gap-3 px-4 py-3 hover:bg-[var(--color-brand-cream)]/50 transition-colors group"
            >
              <div className="relative w-14 h-14 shrink-0 bg-[var(--color-brand-cream)] overflow-hidden">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail.url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="56px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[0.5rem] text-[var(--color-brand-gold)]/30">PHOTO</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                {item.label && (
                  <p className="text-[0.6rem] text-[var(--color-brand-gold)] tracking-wider mb-1">
                    {item.label}
                  </p>
                )}
                <p className="text-xs text-[var(--color-brand-dark)] leading-relaxed line-clamp-2 group-hover:text-[var(--color-brand-gold)] transition-colors">
                  {item.title}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
