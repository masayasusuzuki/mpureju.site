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

/** 施術名で料金データを検索（サイドバー用、findPriceRowsByTitle の Supabase 版） */
export async function findPriceRowsByName(title: string): Promise<PriceRow[]> {
  const supabase = await createSupabaseAdminClient();

  // category が title を含む行を検索
  const { data } = await supabase
    .from("price_items")
    .select("id, category, option, price, sort_order")
    .ilike("category", `%${title}%`)
    .order("section")
    .order("sub_tab")
    .order("sort_order");

  if (!data || data.length === 0) return [];

  // マッチした行の直後にある category 空文字の行（option行）も取得する
  const results: PriceRow[] = [];
  const matchedIds = new Set(data.map((r) => r.id));

  // 全データから前後関係を見てoption行を拾う必要があるため、
  // マッチしたsub_tabごとに全行を取得
  const matchedSubTabs = new Set<string>();
  const { data: allData } = await supabase
    .from("price_items")
    .select("category, option, price, sort_order")
    .order("section")
    .order("sub_tab")
    .order("sort_order");

  let capturing = false;
  for (const row of allData ?? []) {
    if (row.category && row.category.includes(title)) {
      capturing = true;
      results.push({ category: row.category, option: row.option ?? undefined, price: row.price });
    } else if (capturing && row.category === "") {
      results.push({ category: row.category, option: row.option ?? undefined, price: row.price });
    } else {
      capturing = false;
    }
  }

  return results;
}
