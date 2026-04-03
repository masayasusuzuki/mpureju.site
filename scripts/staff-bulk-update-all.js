#!/usr/bin/env node
// staff_blog: author + images(サムネ以外) を一括PATCH
import fs from "fs";
import path from "path";

const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const WRITE_API_KEY = process.env.MICROCMS_WRITE_API_KEY;
const MGMT_API_KEY = process.env.MICROCMS_MANAGEMENT_API_KEY;

// slug→id マップ取得
const listRes = await fetch(
  `https://${SERVICE_DOMAIN}.microcms.io/api/v1/staff_blog?fields=id,slug&limit=100`,
  { headers: { "X-MICROCMS-API-KEY": WRITE_API_KEY } }
);
const listData = await listRes.json();
const slugToId = {};
for (const c of listData.contents) slugToId[c.slug] = c.id;

// 画像アップロード
async function uploadImage(imagePath) {
  const fileName = path.basename(imagePath);
  const fileBuffer = fs.readFileSync(imagePath);
  const ext = path.extname(fileName).toLowerCase();
  const mimeType = ext === ".png" ? "image/png" : "image/jpeg";
  const blob = new Blob([fileBuffer], { type: mimeType });
  const formData = new FormData();
  formData.append("file", blob, fileName);

  const res = await fetch(
    `https://${SERVICE_DOMAIN}.microcms-management.io/api/v1/media`,
    { method: "POST", headers: { "X-MICROCMS-API-KEY": MGMT_API_KEY }, body: formData }
  );
  if (res.status === 429) {
    console.log("      ⏳ レートリミット、10秒待ち...");
    await new Promise(r => setTimeout(r, 10000));
    const retry = await fetch(
      `https://${SERVICE_DOMAIN}.microcms-management.io/api/v1/media`,
      { method: "POST", headers: { "X-MICROCMS-API-KEY": MGMT_API_KEY }, body: formData }
    );
    if (!retry.ok) throw new Error(`画像アップロード失敗: ${retry.status}`);
    return (await retry.json()).url;
  }
  if (!res.ok) throw new Error(`画像アップロード失敗: ${res.status}`);
  return (await res.json()).url;
}

const staffDir = "public/staff";
const dirs = fs.readdirSync(staffDir)
  .filter(d => /^\d/.test(d) && fs.existsSync(path.join(staffDir, d, "article.md")))
  .sort();

let success = 0;
let failed = 0;

for (const dir of dirs) {
  const raw = fs.readFileSync(path.join(staffDir, dir, "article.md"), "utf-8");
  const slugMatch = raw.match(/^slug:\s*"(.+?)"\s*$/m);
  if (!slugMatch) continue;

  const cmsId = slugToId[slugMatch[1]];
  if (!cmsId) continue;

  const authorMatch = raw.match(/^author:\s*"(.+?)"\s*$/m);
  const author = authorMatch ? authorMatch[1] : "たむちゃんナース";

  const thumbnailMatch = raw.match(/^thumbnail:\s*"(.+?)"\s*$/m);
  const thumbnailName = thumbnailMatch ? thumbnailMatch[1] : "image_1.jpg";

  // サムネ以外の画像を取得
  const fullDir = path.join(staffDir, dir);
  const allImages = fs.readdirSync(fullDir)
    .filter(f => /^image_\d+\.(jpg|jpeg|png)$/i.test(f))
    .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]))
    .filter(f => f !== thumbnailName);

  const patchData = { author };

  // 画像アップロード（サムネ以外が1枚以上ある場合）
  if (allImages.length > 0) {
    console.log(`📤 ${dir}: ${allImages.length}枚の画像をアップロード中...`);
    const imageUrls = [];
    for (const imgFile of allImages) {
      try {
        const url = await uploadImage(path.join(fullDir, imgFile));
        imageUrls.push(url);
        console.log(`   ✅ ${imgFile}`);
      } catch (e) {
        console.log(`   ❌ ${imgFile}: ${e.message}`);
      }
      await new Promise(r => setTimeout(r, 1500));
    }
    if (imageUrls.length > 0) {
      patchData.images = imageUrls;
    }
  } else {
    console.log(`📝 ${dir}: author のみ更新`);
  }

  // PATCH
  const res = await fetch(
    `https://${SERVICE_DOMAIN}.microcms.io/api/v1/staff_blog/${cmsId}`,
    {
      method: "PATCH",
      headers: { "X-MICROCMS-API-KEY": WRITE_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(patchData),
    }
  );

  if (res.status === 429) {
    await new Promise(r => setTimeout(r, 10000));
    const retry = await fetch(
      `https://${SERVICE_DOMAIN}.microcms.io/api/v1/staff_blog/${cmsId}`,
      {
        method: "PATCH",
        headers: { "X-MICROCMS-API-KEY": WRITE_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify(patchData),
      }
    );
    if (retry.ok) { success++; console.log(`   ✅ PATCH完了`); }
    else { failed++; console.log(`   ❌ PATCH失敗: ${retry.status}`); }
  } else if (res.ok) {
    success++;
    console.log(`   ✅ PATCH完了`);
  } else {
    failed++;
    const text = await res.text();
    console.log(`   ❌ PATCH失敗 (${res.status}): ${text}`);
  }

  await new Promise(r => setTimeout(r, 2000));
}

console.log(`\n==========================================`);
console.log(` 完了: ${success}件 / 失敗: ${failed}件`);
console.log(`==========================================`);
