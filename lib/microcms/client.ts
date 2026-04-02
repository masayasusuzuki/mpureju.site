import { createClient } from "microcms-js-sdk";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type { Treatment } from "./types";
import type { Campaign, Case, Column, Machine, Medicine, Media, News, StaffBlog, TeamPhoto } from "@/types/microcms";

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
      orders: "sort_order",
      limit: 100,
    },
  });
}

// ── treatments search ─────────────────────────

/** キーワードで施術を検索（title・catch_copy に絞る） */
export async function searchTreatments(keyword: string) {
  return microcms.getList<Treatment>({
    endpoint: "treatments",
    queries: {
      filters: `title[contains]${keyword}`,
      limit: 20,
    },
  });
}

/** キーワードで症例を検索（title・treatment_label・concern・tags に絞る） */
export async function searchCases(keyword: string, limit = 6) {
  try {
    return await microcms.getList<Case>({
      endpoint: "cases",
      queries: { q: keyword, limit },
    });
  } catch {
    return { contents: [], totalCount: 0, offset: 0, limit };
  }
}

/** キーワードでコラムを検索 */
export async function searchColumns(keyword: string, limit = 10) {
  try {
    return await microcms.getList<Column>({
      endpoint: "columns",
      queries: { q: keyword, limit },
    });
  } catch {
    return { contents: [], totalCount: 0, offset: 0, limit };
  }
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

// ── staff_blog ──────────────────────────────

/** スタッフブログ一覧を取得 */
export async function getStaffBlogList(queries?: MicroCMSQueries) {
  try {
    return await microcms.getList<StaffBlog>({
      endpoint: "staff_blog",
      queries: {
        orders: "-published_at",
        limit: 10,
        ...queries,
      },
    });
  } catch {
    return { contents: [], totalCount: 0, offset: 0, limit: 10 };
  }
}

/** slugでスタッフブログを1件取得 */
export async function getStaffBlogBySlug(slug: string) {
  try {
    const data = await microcms.getList<StaffBlog>({
      endpoint: "staff_blog",
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    });
    return data.contents[0] ?? null;
  } catch {
    return null;
  }
}

// ── machines ─────────────────────────────────

/** マシン一覧を取得 */
export async function getMachineList(queries?: MicroCMSQueries) {
  try {
    return await microcms.getList<Machine>({
      endpoint: "machines",
      queries: {
        orders: "sort_order",
        limit: 50,
        ...queries,
      },
    });
  } catch {
    return { contents: [], totalCount: 0, offset: 0, limit: 50 };
  }
}

/** slugでマシンを1件取得 */
export async function getMachineBySlug(slug: string) {
  try {
    const data = await microcms.getList<Machine>({
      endpoint: "machines",
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    });
    return data.contents[0] ?? null;
  } catch {
    return null;
  }
}

// ── medicines ────────────────────────────────────

/** 内服薬一覧を取得 */
export async function getMedicineList(queries?: MicroCMSQueries) {
  try {
    return await microcms.getList<Medicine>({
      endpoint: "medicines",
      queries: {
        orders: "sort_order",
        limit: 50,
        ...queries,
      },
    });
  } catch (e) {
    console.error("[getMedicineList] failed:", e);
    return { contents: [], totalCount: 0, offset: 0, limit: 50 };
  }
}

/** slugで内服薬を1件取得 */
export async function getMedicineBySlug(slug: string) {
  try {
    const data = await microcms.getList<Medicine>({
      endpoint: "medicines",
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    });
    return data.contents[0] ?? null;
  } catch {
    return null;
  }
}

// ── columns ──────────────────────────────────────

/** コラム一覧を取得 */
export async function getColumnList(queries?: MicroCMSQueries) {
  try {
    return await microcms.getList<Column>({
      endpoint: "columns",
      queries: {
        orders: "-publishedAt",
        limit: 12,
        ...queries,
      },
    });
  } catch {
    return { contents: [], totalCount: 0, offset: 0, limit: 12 };
  }
}

/** slugでコラムを1件取得 */
export async function getColumnBySlug(slug: string) {
  try {
    const data = await microcms.getList<Column>({
      endpoint: "columns",
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    });
    return data.contents[0] ?? null;
  } catch {
    return null;
  }
}

// ── cases ───────────────────────────────────────

/** 症例一覧を取得 */
export async function getCaseList(queries?: MicroCMSQueries) {
  try {
    return await microcms.getList<Case>({
      endpoint: "cases",
      queries: {
        orders: "-published_at",
        limit: 12,
        ...queries,
      },
    });
  } catch {
    return { contents: [], totalCount: 0, offset: 0, limit: 12 };
  }
}

/** slugで症例を1件取得 */
export async function getCaseBySlug(slug: string) {
  try {
    const data = await microcms.getList<Case>({
      endpoint: "cases",
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    });
    return data.contents[0] ?? null;
  } catch {
    return null;
  }
}

/** 部位（pillar）で症例を取得（トップページ・部位ページ用） */
export async function getCasesByPillar(pillar: string) {
  try {
    return await microcms.getList<Case>({
      endpoint: "cases",
      queries: {
        filters: `pillar[contains]${pillar}`,
        orders: "-published_at",
        limit: 6,
      },
    });
  } catch {
    return { contents: [], totalCount: 0, offset: 0, limit: 6 };
  }
}

/** 施術名で症例を取得（施術詳細ページ用） */
export async function getCasesByTreatment(treatmentName: string) {
  try {
    return await microcms.getList<Case>({
      endpoint: "cases",
      queries: {
        filters: `treatment_label[contains]${treatmentName}`,
        orders: "-published_at",
        limit: 6,
      },
    });
  } catch {
    return { contents: [], totalCount: 0, offset: 0, limit: 6 };
  }
}

