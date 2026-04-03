#!/usr/bin/env node
// 既存staff_blog記事にinstagram_urlを一括PATCH
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
for (const dir of dirs) {
  const raw = fs.readFileSync(path.join(staffDir, dir, "article.md"), "utf-8");
  const slugMatch = raw.match(/^slug:\s*"(.+?)"\s*$/m);
  const igMatch = raw.match(/^instagram_url:\s*"(.+?)"\s*$/m);
  if (!slugMatch || !igMatch) continue;

  const cmsId = slugToId[slugMatch[1]];
  if (!cmsId) continue;

  console.log(`📝 ${dir} → ${igMatch[1].slice(0, 50)}...`);
  const res = await fetch(
    `https://${SERVICE_DOMAIN}.microcms.io/api/v1/staff_blog/${cmsId}`,
    {
      method: "PATCH",
      headers: { "X-MICROCMS-API-KEY": WRITE_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ instagram_url: igMatch[1] }),
    }
  );
  if (res.status === 429) {
    await new Promise(r => setTimeout(r, 10000));
    await fetch(`https://${SERVICE_DOMAIN}.microcms.io/api/v1/staff_blog/${cmsId}`, {
      method: "PATCH",
      headers: { "X-MICROCMS-API-KEY": WRITE_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ instagram_url: igMatch[1] }),
    });
  }
  if (res.ok) success++;
  await new Promise(r => setTimeout(r, 2000));
}
console.log(`\n✅ ${success}件更新完了`);
