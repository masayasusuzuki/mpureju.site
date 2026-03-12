import Image from "next/image";
import type { Media } from "@/types/microcms";
import {
  extractYouTubeId,
  getYouTubeThumbnail,
  fetchYouTubeTitle,
} from "@/lib/youtube";

function PlayIcon() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
        <svg
          className="w-4 h-4 md:w-5 md:h-5 text-white ml-0.5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
}

type EnrichedMedia = Media & {
  resolvedThumbnail: string | null;
  resolvedTitle: string;
};

/** YouTube アイテムのサムネ・タイトルを自動解決 */
async function enrichMedia(items: Media[]): Promise<EnrichedMedia[]> {
  return Promise.all(
    items.map(async (item) => {
      const isYT = Array.isArray(item.platform) ? item.platform.includes("YouTube") : item.platform === "YouTube";
      if (isYT) {
        const videoId = extractYouTubeId(item.url);
        const resolvedThumbnail = videoId
          ? getYouTubeThumbnail(videoId)
          : null;
        const resolvedTitle =
          item.title || (videoId ? await fetchYouTubeTitle(videoId) : "");
        return { ...item, resolvedThumbnail, resolvedTitle };
      }
      // Instagram: thumbnail は手動アップロード
      return {
        ...item,
        resolvedThumbnail: item.thumbnail?.url ?? null,
        resolvedTitle: item.title ?? "",
      };
    })
  );
}

function MediaRow({
  platform,
  items,
}: {
  platform: "Instagram" | "YouTube";
  items: EnrichedMedia[];
}) {
  const isYoutube = platform === "YouTube";

  return (
    <div className="flex gap-4 md:gap-6 items-start">
      {/* Platform label - vertical text */}
      <div className="flex-shrink-0 flex flex-col items-center gap-3 pt-2">
        {isYoutube ? (
          <div className="w-7 h-7 bg-[#FF0000] rounded-sm flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
        ) : (
          <div className="w-7 h-7 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[var(--color-text-secondary)]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </div>
        )}
        <span
          className="text-xs tracking-widest text-[var(--color-text-secondary)]"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          {isYoutube ? "YouTube" : "Instagram"}
        </span>
      </div>

      {/* Thumbnails grid */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {items.slice(0, 4).map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div
              className={`relative overflow-hidden bg-[var(--color-brand-cream)] ${isYoutube ? "aspect-video" : "aspect-square"}`}
            >
              {item.resolvedThumbnail ? (
                isYoutube ? (
                  // YouTube: img.youtube.com の外部URLなので <img> を使用
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.resolvedThumbnail}
                    alt={item.resolvedTitle}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  // Instagram: microCMS画像なので next/image を使用
                  <Image
                    src={item.resolvedThumbnail}
                    alt={item.resolvedTitle}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 45vw, 25vw"
                  />
                )
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[var(--color-text-secondary)]/40 text-xs tracking-[0.25em]">
                    PHOTO
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              {isYoutube && <PlayIcon />}
            </div>
            {isYoutube && item.resolvedTitle && (
              <p className="mt-2 text-xs text-[var(--color-text-primary)] leading-relaxed line-clamp-2">
                {item.resolvedTitle}
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

type Props = {
  instagramItems: Media[];
  youtubeItems: Media[];
};

export async function MediaSection({ instagramItems, youtubeItems }: Props) {
  if (instagramItems.length === 0 && youtubeItems.length === 0) return null;

  const [enrichedInstagram, enrichedYoutube] = await Promise.all([
    enrichMedia(instagramItems),
    enrichMedia(youtubeItems),
  ]);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="section-container">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <h2 className="font-en text-4xl md:text-5xl font-light text-[var(--color-brand-dark)]">
            Media
          </h2>
          <div className="hidden md:flex items-center gap-3">
            <p className="text-xs text-[var(--color-text-secondary)] tracking-wider">
              クリニック公式SNS
            </p>
            <a
              href="https://instagram.com/maisonpureju"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
            <a
              href="https://youtube.com/@maisonpureju"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-[var(--color-text-secondary)] hover:text-[#FF0000] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="border-t border-[var(--color-brand-cream)] mb-12" />

        {/* Instagram row */}
        {enrichedInstagram.length > 0 && (
          <div className="mb-12 md:mb-16">
            <MediaRow platform="Instagram" items={enrichedInstagram} />
          </div>
        )}

        {/* YouTube row */}
        {enrichedYoutube.length > 0 && (
          <MediaRow platform="YouTube" items={enrichedYoutube} />
        )}
      </div>
    </section>
  );
}
