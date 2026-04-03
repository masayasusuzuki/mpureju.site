#!/usr/bin/env node
// 既存staff_blog記事のbodyをMarkdown→HTML変換して一括PATCH更新する
import fs from "fs";
import path from "path";
import { marked } from "marked";

const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const WRITE_API_KEY = process.env.MICROCMS_WRITE_API_KEY;

if (!SERVICE_DOMAIN || !WRITE_API_KEY) {
  console.error("❌ MICROCMS_SERVICE_DOMAIN, MICROCMS_WRITE_API_KEY が必要です");
  process.exit(1);
}

// 全記事取得
const listRes = await fetch(
  `https://${SERVICE_DOMAIN}.microcms.io/api/v1/staff_blog?fields=id,slug&limit=100`,
  { headers: { "X-MICROCMS-API-KEY": WRITE_API_KEY } }
);
const listData = await listRes.json();
console.log(`📋 microCMS上の記事: ${listData.totalCount}件`);

// slug→id マップ
const slugToId = {};
for (const c of listData.contents) {
  slugToId[c.slug] = c.id;
}

// ローカルの各article.mdを読んでbodyをHTML変換してPATCH
const staffDir = "public/staff";
const dirs = fs.readdirSync(staffDir)
  .filter(d => /^\d/.test(d) && fs.existsSync(path.join(staffDir, d, "article.md")))
  .sort();

let success = 0;
let skipped = 0;
let failed = 0;

for (const dir of dirs) {
  const articlePath = path.join(staffDir, dir, "article.md");
  const raw = fs.readFileSync(articlePath, "utf-8");

  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) { console.log(`⏭ ${dir}: frontmatter なし`); skipped++; continue; }

  const yamlStr = match[1];
  const content = match[2].trim();

  const slugMatch = yamlStr.match(/^slug:\s*"(.+?)"\s*$/m);
  if (!slugMatch) { console.log(`⏭ ${dir}: slug なし`); skipped++; continue; }
  const slug = slugMatch[1];

  const cmsId = slugToId[slug];
  if (!cmsId) { console.log(`⏭ ${dir}: slug "${slug}" がmicroCMSに存在しない`); skipped++; continue; }

  const htmlBody = await marked(content);

  console.log(`📝 更新中: ${dir} (${slug} → ${cmsId})`);

  const res = await fetch(
    `https://${SERVICE_DOMAIN}.microcms.io/api/v1/staff_blog/${cmsId}`,
    {
      method: "PATCH",
      headers: {
        "X-MICROCMS-API-KEY": WRITE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: htmlBody }),
    }
  );

  if (res.status === 429) {
    console.log("   ⏳ レートリミット、10秒後にリトライ...");
    await new Promise(r => setTimeout(r, 10000));
    const retry = await fetch(
      `https://${SERVICE_DOMAIN}.microcms.io/api/v1/staff_blog/${cmsId}`,
      {
        method: "PATCH",
        headers: {
          "X-MICROCMS-API-KEY": WRITE_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: htmlBody }),
      }
    );
    if (retry.ok) { console.log(`   ✅ 完了`); success++; }
    else { console.log(`   ❌ 失敗: ${retry.status}`); failed++; }
  } else if (res.ok) {
    console.log(`   ✅ 完了`);
    success++;
  } else {
    const text = await res.text();
    console.log(`   ❌ 失敗 (${res.status}): ${text}`);
    failed++;
  }

  await new Promise(r => setTimeout(r, 2000));
}

console.log(`\n==========================================`);
console.log(` 完了: ${success}件 / スキップ: ${skipped}件 / 失敗: ${failed}件`);
console.log(`==========================================`);
