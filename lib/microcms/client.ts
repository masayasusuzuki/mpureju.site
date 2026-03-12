import { createClient } from "microcms-js-sdk";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type { Treatment } from "./types";
import type { Campaign, Media, News, TeamPhoto } from "@/types/microcms";

export const microcms = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

// ── treatments ─────────────────────────────────

/** 施術一覧を取得 */
export async function getTreatments(queries?: MicroCMSQueries) {
  return microcms.getList<Treatment>({
    endpoint: "treatments",
    queries: { limit: 100, ...queries },
  });
}

/** slug で施術を1件取得 */
export async function getTreatmentBySlug(slug: string) {
  const data = await microcms.getList<Treatment>({
    endpoint: "treatments",
    queries: {
      filters: `slug[equals]${slug}`,
      limit: 1,
    },
  });
  return data.contents[0] ?? null;
}

/** pillar（部位）で施術一覧を取得 */
export async function getTreatmentsByPillar(pillar: string) {
  return microcms.getList<Treatment>({
    endpoint: "treatments",
    queries: {
      filters: `pillar[contains]${pillar}`,
      limit: 100,
    },
  });
}

// ── campaigns ─────────────────────────────────

/** 公開中のキャンペーン一覧を取得 */
export async function getCampaigns() {
  const data = await microcms.getList<Campaign>({
    endpoint: "campaigns",
    queries: {
      filters: "is_active[equals]true",
      limit: 10,
    },
  });
  const now = new Date();
  return data.contents.filter((c) => new Date(c.start_at) <= now);
}

// ── news ──────────────────────────────────────

/** ニュース一覧を取得 */
export async function getNewsList(queries?: MicroCMSQueries) {
  return microcms.getList<News>({
    endpoint: "news",
    queries: { limit: 20, ...queries },
  });
}

/** slugでニュースを1件取得 */
export async function getNewsBySlug(slug: string) {
  const data = await microcms.getList<News>({
    endpoint: "news",
    queries: {
      filters: `slug[equals]${slug}`,
      limit: 1,
    },
  });
  return data.contents[0] ?? null;
}

// ── team_photos ───────────────────────────────

/** チーム写真一覧を取得 */
export async function getTeamPhotos(queries?: MicroCMSQueries) {
  return microcms.getList<TeamPhoto>({
    endpoint: "team_photos",
    queries: { limit: 30, ...queries },
  });
}

// ── media ─────────────────────────────────────

/** メディア一覧を取得 */
export async function getMediaList(queries?: MicroCMSQueries) {
  return microcms.getList<Media>({
    endpoint: "media",
    queries: { limit: 20, ...queries },
  });
}
