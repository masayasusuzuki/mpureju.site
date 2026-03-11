import { createClient } from "microcms-js-sdk";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type { Treatment } from "./types";

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
