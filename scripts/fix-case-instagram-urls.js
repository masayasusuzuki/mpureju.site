#!/usr/bin/env node
// ============================================================
// fix-case-instagram-urls.js
// article.md の instagram_url を microCMS cases API に PATCH で反映する
//
// 使い方:
//   node scripts/fix-case-instagram-urls.js [--dry-run]
//
// --dry-run: 実際には PATCH せず、変更内容を表示するだけ
// ============================================================

import fs from "fs";
import path from "path";

const DRY_RUN = process.argv.includes("--dry-run");
const CASE_DIR = "public/case";

// ── 環境変数 ──────────────────────────────────────────────
const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const WRITE_API_KEY  = process.env.MICROCMS_WRITE_API_KEY;

if (!SERVICE_DOMAIN || !WRITE_API_KEY) {
  console.error("❌ 環境変数が不足しています。.env.local を確認してください。");
  console.error("   必要: MICROCMS_SERVICE_DOMAIN, MICROCMS_WRITE_API_KEY");
  process.exit(1);
}

// ── 対象ディレクトリ（055以降） ────────────────────────────
function getTargetDirs() {
  const dirs = fs.readdirSync(CASE_DIR)
    .filter(d => /^\d+/.test(d) && fs.statSync(path.join(CASE_DIR, d)).isDirectory())
    .sort();

  return dirs.filter(d => {
    const num = parseInt(d.match(/^(\d+)/)[1], 10);
    return num >= 55;
  });
}

// ── frontmatter から slug と instagram_url を取得 ──────────
function parseSlugAndUrl(articlePath) {
  const raw = fs.readFileSync(articlePath, "utf-8");
  const slugMatch = raw.match(/^slug:\s*"(.+?)"\s*$/m);
  const urlMatch = raw.match(/^instagram_url:\s*"(.*)"\s*$/m);
  return {
    slug: slugMatch ? slugMatch[1] : null,
    instagram_url: urlMatch ? urlMatch[1] : null,
  };
}

// ── microCMS から全 cases を取得（slug → contentId マッピング用） ──
async function fetchAllCases() {
  const allCases = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const res = await fetch(
      `https://${SERVICE_DOMAIN}.microcms.io/api/v1/cases?fields=id,slug,instagram_url&limit=${limit}&offset=${offset}`,
      {
        headers: { "X-MICROCMS-API-KEY": WRITE_API_KEY },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`cases 取得失敗 (${res.status}): ${text}`);
    }

    const json = await res.json();
    allCases.push(...json.contents);

    if (allCases.length >= json.totalCount) break;
    offset += limit;
  }

  console.log(`📋 microCMS から ${allCases.length} 件の cases を取得`);
  return allCases;
}

// ── PATCH で instagram_url を更新 ─────────────────────────
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
    throw new Error(`PATCH 失敗 (${res.status}) [${contentId}]: ${text}`);
  }

  return await res.json();
}

// ── メイン ────────────────────────────────────────────────
async function main() {
  console.log(DRY_RUN ? "🔍 DRY RUN モード（実際の更新なし）\n" : "🚀 PATCH 実行モード\n");

  // 1. microCMS の全 cases を取得（slug フィールドで照合）
  const cmsCases = await fetchAllCases();
  // slug → { id (contentId), instagram_url }
  const cmsMap = new Map();
  for (const c of cmsCases) {
    if (c.slug) cmsMap.set(c.slug, { id: c.id, instagram_url: c.instagram_url || "" });
  }

  // 2. 対象ディレクトリを走査
  const dirs = getTargetDirs();
  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const d of dirs) {
    const articlePath = path.join(CASE_DIR, d, "article.md");
    if (!fs.existsSync(articlePath)) continue;

    const { slug, instagram_url } = parseSlugAndUrl(articlePath);
    if (!slug || !instagram_url) continue;

    // microCMS 上の現在値と比較
    const cmsEntry = cmsMap.get(slug);
    if (!cmsEntry) {
      console.log(`   ⚠️  ${slug} (${d}) — microCMS に未登録、スキップ`);
      notFound++;
      continue;
    }

    if (cmsEntry.instagram_url === instagram_url) {
      skipped++;
      continue;
    }

    // 更新が必要
    const shortOld = cmsEntry.instagram_url.match(/\/p\/([^/?]+)/)?.[1] || cmsEntry.instagram_url;
    const shortNew = instagram_url.match(/\/p\/([^/?]+)/)?.[1] || instagram_url;
    console.log(`   ✏️  ${slug} | ${shortOld} → ${shortNew}`);

    if (!DRY_RUN) {
      await patchCase(cmsEntry.id, instagram_url);
      // Rate limit 対策: 100ms 待機
      await new Promise(r => setTimeout(r, 100));
    }
    updated++;
  }

  console.log(`\n=== 完了 ===`);
  console.log(`更新: ${updated}件 / スキップ（変更なし）: ${skipped}件 / 未登録: ${notFound}件`);
  if (DRY_RUN) console.log("※ DRY RUN のため実際の更新はされていません");
}

main().catch(err => {
  console.error("❌ エラー:", err.message);
  process.exit(1);
});
