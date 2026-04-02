import { createSupabaseAdminClient } from "./server";
import type { PriceRow, SubTab } from "@/lib/price-data";
import type { TreatmentRow, TreatmentSubTab } from "@/components/sections/TreatmentSubTabs";

// ============================================================
// Treatment Items（施術一覧ページ用）
// ============================================================

type RawTreatmentItem = {
  section: string;
  sub_tab: string | null;
  name: string;
  description: string;
  risks: string;
  sort_order: number;
};

/** セクション別に施術データを取得（sub_tab なし） */
export async function getTreatmentRowsBySection(section: string): Promise<TreatmentRow[]> {
  const supabase = await createSupabaseAdminClient();
  const { data } = await supabase
    .from("treatment_items")
    .select("name, description, risks, sort_order")
    .eq("section", section)
    .is("sub_tab", null)
    .order("sort_order");

  return (data ?? []).map((row) => ({
    name: row.name,
    desc: row.description,
    risks: row.risks,
  }));
}

/** セクション別に施術データを取得（sub_tab あり → TreatmentSubTab[] に変換） */
export async function getTreatmentSubTabs(section: string): Promise<TreatmentSubTab[]> {
  const supabase = await createSupabaseAdminClient();
  const { data } = await supabase
    .from("treatment_items")
    .select("sub_tab, name, description, risks, sort_order")
    .eq("section", section)
    .not("sub_tab", "is", null)
    .order("sub_tab")
    .order("sort_order");

  const tabMap = new Map<string, TreatmentRow[]>();
  for (const row of data ?? []) {
    const tab = row.sub_tab!;
    if (!tabMap.has(tab)) tabMap.set(tab, []);
    tabMap.get(tab)!.push({
      name: row.name,
      desc: row.description,
      risks: row.risks,
    });
  }

  return Array.from(tabMap.entries()).map(([label, rows]) => ({ label, rows }));
}

// ============================================================
// Price Items（料金ページ + 施術詳細サイドバー用）
// ============================================================

type RawPriceItem = {
  section: string;
  sub_tab: string;
  category: string;
  option: string | null;
  price: string;
  sort_order: number;
};

/** セクション別に料金データを取得（SubTab[] に変換） */
export async function getPriceSubTabs(section: string): Promise<SubTab[]> {
  const supabase = await createSupabaseAdminClient();
  const { data } = await supabase
    .from("price_items")
    .select("sub_tab, category, option, price, sort_order")
    .eq("section", section)
    .order("sub_tab")
    .order("sort_order");

  const tabMap = new Map<string, PriceRow[]>();
  for (const row of data ?? []) {
    if (!tabMap.has(row.sub_tab)) tabMap.set(row.sub_tab, []);
    tabMap.get(row.sub_tab)!.push({
      category: row.category,
      option: row.option ?? undefined,
      price: row.price,
    });
  }

  return Array.from(tabMap.entries()).map(([label, rows]) => ({ label, rows }));
}

/** セクション別に料金データを取得（フラット PriceRow[]、点滴・内服薬用） */
export async function getPriceRows(section: string): Promise<PriceRow[]> {
  const supabase = await createSupabaseAdminClient();
  const { data } = await supabase
    .from("price_items")
    .select("category, option, price, sort_order")
    .eq("section", section)
    .order("sort_order");

  return (data ?? []).map((row) => ({
    category: row.category,
    option: row.option ?? undefined,
    price: row.price,
  }));
}

/** 内服薬名で料金データを検索（" / " や "＋" で複合名を分割してOR検索） */
export async function findMedicinePriceRows(name: string): Promise<PriceRow[]> {
  const supabase = await createSupabaseAdminClient();

  // " / " と "＋" で分割し、2文字以上のキーワードを抽出
  const terms = name
    .split(/ \/ |＋/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);

  // 内服薬セクションの全行を取得してJS側でフィルタリング
  const { data } = await supabase
    .from("price_items")
    .select("category, option, price, sort_order")
    .eq("section", "内服薬")
    .order("sort_order");

  if (!data) return [];

  return data
    .filter((row) => terms.some((term) => row.category.includes(term)))
    .map((row) => ({
      category: row.category,
      option: row.option ?? undefined,
      price: row.price,
    }));
}

// ── 検索用 ──────────────────────────────────────────────────

export type PriceSearchResult = {
  section: string;
  sub_tab: string;
  category: string;
  option: string | null;
  price: string;
};

/** キーワードで料金データを全文検索（検索ページ用） */
export async function searchPriceItems(keyword: string): Promise<PriceSearchResult[]> {
  const supabase = await createSupabaseAdminClient();
  const kw = keyword.toLowerCase();

  // 全データを取得してJS側でフィルタリング（capturing パターンで空category行も取得）
  const { data: allData } = await supabase
    .from("price_items")
    .select("section, sub_tab, category, option, price")
    .order("section")
    .order("sub_tab")
    .order("sort_order");

  if (!allData) return [];

  // sub_tab にキーワードが含まれるキーを収集
  const matchedSubTabKeys = new Set<string>();
  for (const row of allData) {
    if ((row.sub_tab ?? "").toLowerCase().includes(kw)) {
      matchedSubTabKeys.add(`${row.section}|${row.sub_tab}`);
    }
  }

  const results: PriceSearchResult[] = [];
  let capturing = false;

  for (const row of allData) {
    const subTabKey = `${row.section}|${row.sub_tab}`;

    // sub_tab がマッチ → そのsub_tab内の全行を含める
    if (matchedSubTabKeys.has(subTabKey)) {
      results.push(row);
      continue;
    }

    // category がキーワードにマッチ → capturing 開始
    if (row.category && row.category.toLowerCase().includes(kw)) {
      capturing = true;
      results.push(row);
    } else if (capturing && row.category === "") {
      // 直前のマッチしたcategoryに属するoption行も含める
      results.push(row);
    } else {
      if (row.category !== "") capturing = false;
    }
  }

  return results.slice(0, 30);
}

// ============================================================
// Clinic Calendar（営業カレンダー）
// ============================================================

export type ClinicCalendarData = {
  regularHolidays: string[];
  extraHolidays: string[];
  cancelHolidays: string[];
};

/** 営業カレンダーデータを取得 */
export async function getClinicCalendar(): Promise<ClinicCalendarData> {
  const supabase = await createSupabaseAdminClient();

  const [{ data: holidays }, { data: overrides }] = await Promise.all([
    supabase.from("clinic_regular_holidays").select("label").order("day_of_week"),
    supabase.from("clinic_holiday_overrides").select("date, type"),
  ]);

  return {
    regularHolidays: (holidays ?? []).map((h) => h.label),
    extraHolidays: (overrides ?? []).filter((o) => o.type === "extra").map((o) => o.date),
    cancelHolidays: (overrides ?? []).filter((o) => o.type === "cancel").map((o) => o.date),
  };
}

/** 施術名で料金データを検索（サイドバー用）
 * - カンマ・読点区切りで複数施術に対応
 * - 双方向マッチ: keyword→DB、DB→keyword どちらでもヒット（例: "ヒアルロン酸注射"→"ヒアルロン酸"）
 * - category でヒットしない場合は sub_tab でフォールバック（例: "ボトックス"）
 */
export async function findPriceRowsByName(title: string): Promise<PriceRow[]> {
  const keywords = title
    .split(/[,、，]/)
    .map(s => s.replace(/[【（[(][^】）\])]*[】）\])]/g, "").trim())
    .filter(s => s.length >= 2);

  if (keywords.length === 0) return [];

  const supabase = await createSupabaseAdminClient();
  const { data: allData } = await supabase
    .from("price_items")
    .select("sub_tab, category, option, price, sort_order")
    .order("section")
    .order("sub_tab")
    .order("sort_order");

  if (!allData) return [];

  // 双方向マッチ（keywordがDB値を含む、またはDB値がkeywordを含む）
  const flexMatch = (keyword: string, dbTerm: string): boolean => {
    if (!dbTerm || dbTerm.length < 2) return false;
    return keyword.includes(dbTerm) || dbTerm.includes(keyword);
  };

  const collectedIds = new Set<string>();
  const results: PriceRow[] = [];

  const addRow = (row: { sub_tab: string; category: string; option: string | null; price: string; sort_order: number }) => {
    const id = `${row.sub_tab}__${row.sort_order}`;
    if (!collectedIds.has(id)) {
      collectedIds.add(id);
      results.push({ category: row.category ?? "", option: row.option ?? undefined, price: row.price });
    }
  };

  for (const keyword of keywords) {
    // 1. category でマッチ（連続する空 category 行も取り込む）
    let foundByCategory = false;
    let capturing = false;
    for (const row of allData) {
      if (row.category && flexMatch(keyword, row.category)) {
        capturing = true;
        foundByCategory = true;
        addRow(row);
      } else if (capturing && !row.category) {
        addRow(row);
      } else {
        capturing = false;
      }
    }

    // 2. category でヒットしなければ sub_tab 全体をフォールバック
    if (!foundByCategory) {
      for (const row of allData) {
        if (row.sub_tab && flexMatch(keyword, row.sub_tab)) {
          addRow(row);
        }
      }
    }
  }

  return results;
}
