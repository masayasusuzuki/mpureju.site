#!/usr/bin/env node
import fs from "fs";
import path from "path";

const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const WRITE_API_KEY = process.env.MICROCMS_WRITE_API_KEY;

// slug→id マップ取得
const listRes = await fetch(
  `https://${SERVICE_DOMAIN}.microcms.io/api/v1/blog?fields=id,slug&limit=100`,
  { headers: { "X-MICROCMS-API-KEY": WRITE_API_KEY } }
);
const listData = await listRes.json();
const slugToId = {};
for (const c of listData.contents) {
  if (c.slug.startsWith("doctor")) slugToId[c.slug] = c.id;
}

const staffDir = "public/doctor";
const dirs = fs.readdirSync(staffDir)
  .filter(d => /^\d/.test(d) && fs.existsSync(path.join(staffDir, d, "article.md")))
  .sort();

let success = 0;
for (const dir of dirs) {
  const raw = fs.readFileSync(path.join(staffDir, dir, "article.md"), "utf-8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) continue;
  const yamlStr = match[1];
  const content = match[2].trim();
  const slugMatch = yamlStr.match(/^slug:\s*"(.+?)"\s*$/m);
  if (!slugMatch) continue;
  const cmsId = slugToId[slugMatch[1]];
  if (!cmsId) { console.log(`⏭ ${dir}: not found`); continue; }

  console.log(`📝 ${dir} (${slugMatch[1]} → ${cmsId})`);
  const res = await fetch(
    `https://${SERVICE_DOMAIN}.microcms.io/api/v1/blog/${cmsId}`,
    {
      method: "PATCH",
      headers: { "X-MICROCMS-API-KEY": WRITE_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ body: content }),
    }
  );
  if (res.ok) { success++; console.log("   ✅"); }
  else console.log(`   ❌ ${res.status}`);
  await new Promise(r => setTimeout(r, 2000));
}
console.log(`\n✅ ${success}件更新完了`);
