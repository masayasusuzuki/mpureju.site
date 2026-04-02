#!/usr/bin/env node
// ============================================================
// fix-cms-cases.js
// 1. 重複記事を DELETE（7件）
// 2. instagram_url を PATCH（残り全件）
//
// 使い方:
//   node scripts/fix-cms-cases.js [--dry-run]
// ============================================================

import fs from "fs";
import path from "path";

const DRY_RUN = process.argv.includes("--dry-run");
const CASE_DIR = "public/case";

const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const WRITE_API_KEY  = process.env.MICROCMS_WRITE_API_KEY;

if (!SERVICE_DOMAIN || !WRITE_API_KEY) {
  console.error("❌ MICROCMS_SERVICE_DOMAIN, MICROCMS_WRITE_API_KEY が必要です");
  process.exit(1);
}

// ── 削除対象の contentId（確定済み） ─────────────────────
const DELETE_IDS = [
  { id: "sjn70366b",    slug: "skin-011",  reason: "dir 051 由来の重複" },
  { id: "w2cul_pzbw6",  slug: "eye-017",   reason: "dir 052 由来の重複" },
  { id: "1wtigqo6nff2", slug: "eye-018",   reason: "dir 053 由来の重複" },
  { id: "6m5hjl0_l",    slug: "skin-012",  reason: "dir 054 由来の重複" },
  { id: "ktr12dspc0gg", slug: "mouth-026", reason: "二重投稿の重複" },
  { id: "9z10et8wmbkv", slug: "mouth-034", reason: "二重投稿の重複" },
  { id: "jgyugx-zegsy", slug: "skin-016",  reason: "二重投稿の重複" },
];

// ── API helpers ──────────────────────────────────────────
async function fetchAllCases() {
  const all = [];
  let offset = 0;
  while (true) {
    const res = await fetch(
      `https://${SERVICE_DOMAIN}.microcms.io/api/v1/cases?fields=id,slug,instagram_url&limit=100&offset=${offset}`,
      { headers: { "X-MICROCMS-API-KEY": WRITE_API_KEY } }
    );
    if (!res.ok) throw new Error(`GET失敗 (${res.status})`);
    const json = await res.json();
    all.push(...json.contents);
    if (all.length >= json.totalCount) break;
    offset += 100;
  }
  return all;
}

async function deleteCase(contentId) {
  const res = await fetch(
    `https://${SERVICE_DOMAIN}.microcms.io/api/v1/cases/${contentId}`,
    { method: "DELETE", headers: { "X-MICROCMS-API-KEY": WRITE_API_KEY } }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DELETE失敗 (${res.status}) [${contentId}]: ${text}`);
  }
}

async function patchCase(contentId, instagramUrl) {
  const res = await fetch(
    `https://${SERVICE_DOMAIN}.microcms.io/api/v1/cases/${contentId}`,
    {
      method: "PATCH",
      headers: {
        "X-MICROCMS-API-KEY": WRITE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ instagram_url: instagramUrl }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PATCH失敗 (${res.status}) [${contentId}]: ${text}`);
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── ローカル article.md からslug→正しいURLを取得 ────────
function buildLocalMap() {
  const map = new Map();
  const dirs = fs.readdirSync(CASE_DIR)
    .filter(d => /^\d+/.test(d) && fs.statSync(path.join(CASE_DIR, d)).isDirectory())
    .sort();

  for (const d of dirs) {
    const num = parseInt(d.match(/^(\d+)/)[1], 10);
    if (num >= 51 && num <= 54) continue; // orphan duplicates
    const articlePath = path.join(CASE_DIR, d, "article.md");
    if (!fs.existsSync(articlePath)) continue;
    const raw = fs.readFileSync(articlePath, "utf-8");
    const slug = raw.match(/^slug:\s*"(.+?)"/m)?.[1];
    const url = raw.match(/^instagram_url:\s*"(.*)"/m)?.[1];
    if (slug && url) map.set(slug, url);
  }
  return map;
}

// ── メイン ────────────────────────────────────────────────
async function main() {
  console.log(DRY_RUN ? "🔍 DRY RUN\n" : "🚀 実行モード\n");

  // ── STEP 1: DELETE（スキップ — 手動削除が必要） ──
  console.log("=== STEP 1: 重複記事の削除（スキップ） ===");
  console.log("  ※ WRITE_API_KEY に DELETE 権限なし。以下を管理画面から手動削除してください:");
  const deleteIds = new Set(DELETE_IDS.map(d => d.id));
  for (const entry of DELETE_IDS) {
    console.log(`  🗑  ${entry.slug} [${entry.id}] — ${entry.reason}`);
  }
  console.log("");

  // ── STEP 2: PATCH ──
  console.log("=== STEP 2: instagram_url の修正 ===");
  const localMap = buildLocalMap();
  const cmsCases = await fetchAllCases();
  console.log(`  microCMS: ${cmsCases.length}件取得`);

  // slug → CMS entries (exclude deleted IDs)
  const cmsMap = new Map();
  for (const c of cmsCases) {
    if (deleteIds.has(c.id)) continue;
    if (!cmsMap.has(c.slug)) cmsMap.set(c.slug, []);
    cmsMap.get(c.slug).push(c);
  }

  let patched = 0;
  let skipped = 0;
  let notFound = 0;

  for (const [slug, correctUrl] of localMap) {
    const entries = cmsMap.get(slug);
    if (!entries || entries.length === 0) {
      notFound++;
      continue;
    }

    for (const c of entries) {
      if (c.instagram_url === correctUrl) {
        skipped++;
        continue;
      }

      const shortOld = c.instagram_url?.match(/\/p\/([^/?]+)/)?.[1] || "なし";
      const shortNew = correctUrl.match(/\/p\/([^/?]+)/)?.[1] || correctUrl;
      console.log(`  ✏️  ${slug} [${c.id}] | ${shortOld} → ${shortNew}`);

      if (!DRY_RUN) {
        await patchCase(c.id, correctUrl);
        await sleep(100);
      }
      patched++;
    }
  }

  console.log(`\n=== 完了 ===`);
  console.log(`削除: ${DELETE_IDS.length}件 / PATCH: ${patched}件 / 変更なし: ${skipped}件 / 未登録: ${notFound}件`);
  if (DRY_RUN) console.log("※ DRY RUN のため実際の変更はされていません");
}

main().catch(err => {
  console.error("❌ エラー:", err.message);
  process.exit(1);
});
