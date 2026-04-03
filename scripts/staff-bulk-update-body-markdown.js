#!/usr/bin/env node
// staff_blog: bodyをMarkdown（元のarticle.md）に戻して一括PATCH
import fs from "fs";
import path from "path";

const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const WRITE_API_KEY = process.env.MICROCMS_WRITE_API_KEY;

const listRes = await fetch(
  `https://${SERVICE_DOMAIN}.microcms.io/api/v1/staff_blog?fields=id,slug&limit=100`,
  { headers: { "X-MICROCMS-API-KEY": WRITE_API_KEY } }
);
const listData = await listRes.json();
const slugToId = {};
for (const c of listData.contents) slugToId[c.slug] = c.id;

const staffDir = "public/staff";
const dirs = fs.readdirSync(staffDir)
  .filter(d => /^\d/.test(d) && fs.existsSync(path.join(staffDir, d, "article.md")))
  .sort();

let success = 0;
let failed = 0;

for (const dir of dirs) {
  const raw = fs.readFileSync(path.join(staffDir, dir, "article.md"), "utf-8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) continue;

  const yamlStr = match[1];
  const content = match[2].trim();

  const slugMatch = yamlStr.match(/^slug:\s*"(.+?)"\s*$/m);
  if (!slugMatch) continue;

  const cmsId = slugToId[slugMatch[1]];
  if (!cmsId) continue;

  console.log(`📝 ${dir} (${slugMatch[1]})`);

  const res = await fetch(
    `https://${SERVICE_DOMAIN}.microcms.io/api/v1/staff_blog/${cmsId}`,
    {
      method: "PATCH",
      headers: { "X-MICROCMS-API-KEY": WRITE_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ body: content }),
    }
  );

  if (res.status === 429) {
    console.log("   ⏳ レートリミット...");
    await new Promise(r => setTimeout(r, 10000));
    const retry = await fetch(
      `https://${SERVICE_DOMAIN}.microcms.io/api/v1/staff_blog/${cmsId}`,
      {
        method: "PATCH",
        headers: { "X-MICROCMS-API-KEY": WRITE_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ body: content }),
      }
    );
    if (retry.ok) { success++; console.log("   ✅"); }
    else { failed++; console.log(`   ❌ ${retry.status}`); }
  } else if (res.ok) {
    success++;
    console.log("   ✅");
  } else {
    failed++;
    const text = await res.text();
    console.log(`   ❌ ${res.status}: ${text}`);
  }

  await new Promise(r => setTimeout(r, 2000));
}

console.log(`\n==========================================`);
console.log(` 完了: ${success}件 / 失敗: ${failed}件`);
console.log(`==========================================`);
