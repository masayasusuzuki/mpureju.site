#!/usr/bin/env node
// ============================================================
// microcms-add-images.js
// 既存の columns 記事に images フィールドを追加（PATCH）する
//
// 使い方:
//   node scripts/microcms-add-images.js public/column/007_セレックV
//   node scripts/microcms-add-images.js public/column/007_セレックV public/column/008_サーマジェン ...
// ============================================================

import fs from "fs";
import path from "path";

const dirs = process.argv.slice(2);
if (dirs.length === 0) {
  console.error("使い方: node scripts/microcms-add-images.js <ディレクトリ> [...]");
  process.exit(1);
}

const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const WRITE_API_KEY  = process.env.MICROCMS_WRITE_API_KEY;
const MGMT_API_KEY   = process.env.MICROCMS_MANAGEMENT_API_KEY;

if (!SERVICE_DOMAIN || !WRITE_API_KEY || !MGMT_API_KEY) {
  console.error("❌ 環境変数が不足しています。.env.local を確認してください。");
  process.exit(1);
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error("frontmatter が見つかりません");
  const yamlStr = match[1];

  const slug = yamlStr.match(/^slug:\s*"(.+?)"\s*$/m)?.[1];
  const thumbnail = yamlStr.match(/^thumbnail:\s*"(.+?)"\s*$/m)?.[1] ?? "image_1.jpg";
  return { slug, thumbnail };
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function uploadImage(imagePath, retries = 3) {
  const fileName = path.basename(imagePath);
  const fileBuffer = fs.readFileSync(imagePath);
  const blob = new Blob([fileBuffer], { type: "image/jpeg" });
  const formData = new FormData();
  formData.append("file", blob, fileName);

  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(
      `https://${SERVICE_DOMAIN}.microcms-management.io/api/v1/media`,
      { method: "POST", headers: { "X-MICROCMS-API-KEY": MGMT_API_KEY }, body: formData }
    );
    if (res.status === 429) {
      const wait = attempt * 3000;
      console.log(`   ⏳ レート制限 (429)、${wait / 1000}秒待機...`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) throw new Error(`画像アップロード失敗 (${res.status}): ${await res.text()}`);
    const json = await res.json();
    console.log(`   ✅ ${fileName} → ${json.url}`);
    await sleep(800); // アップロード間の間隔
    return json.url;
  }
  throw new Error(`画像アップロード失敗（リトライ上限）: ${fileName}`);
}

async function getContentIdBySlug(slug) {
  const res = await fetch(
    `https://${SERVICE_DOMAIN}.microcms.io/api/v1/columns?filters=slug[equals]${encodeURIComponent(slug)}&limit=1`,
    { headers: { "X-MICROCMS-API-KEY": WRITE_API_KEY } }
  );
  if (!res.ok) throw new Error(`GET失敗 (${res.status}): ${await res.text()}`);
  const json = await res.json();
  if (!json.contents?.length) throw new Error(`slug "${slug}" の記事が見つかりません`);
  return json.contents[0].id;
}

async function patchImages(contentId, imageUrls) {
  const res = await fetch(
    `https://${SERVICE_DOMAIN}.microcms.io/api/v1/columns/${contentId}`,
    {
      method: "PATCH",
      headers: { "X-MICROCMS-API-KEY": WRITE_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ images: imageUrls }),
    }
  );
  if (!res.ok) throw new Error(`PATCH失敗 (${res.status}): ${await res.text()}`);
  return await res.json();
}

async function processDir(dir) {
  const articlePath = path.join(dir, "article.md");
  if (!fs.existsSync(articlePath)) {
    console.warn(`⚠️  スキップ（article.md なし）: ${dir}`);
    return;
  }

  const { slug, thumbnail } = parseFrontmatter(fs.readFileSync(articlePath, "utf-8"));
  if (!slug) throw new Error(`slug が見つかりません: ${articlePath}`);

  // サムネ以外の画像を番号順で取得（ファイル名規則に依存しない）
  const extraImages = fs.readdirSync(dir)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .sort((a, b) => {
      const na = parseInt((a.match(/\d+/) ?? ["0"])[0]);
      const nb = parseInt((b.match(/\d+/) ?? ["0"])[0]);
      return na !== nb ? na - nb : a.localeCompare(b);
    })
    .filter(f => f !== thumbnail);

  if (extraImages.length === 0) {
    console.log(`⏭️  スキップ（追加画像なし）: ${dir}`);
    return;
  }

  console.log(`\n📁 ${dir}`);
  console.log(`   slug: ${slug}  追加画像: ${extraImages.length} 枚`);

  // slug → content ID
  const contentId = await getContentIdBySlug(slug);
  console.log(`   ID  : ${contentId}`);

  // 画像アップロード
  const urls = [];
  for (const f of extraImages) {
    const url = await uploadImage(path.join(dir, f));
    urls.push(url);
  }

  // PATCH
  await patchImages(contentId, urls);
  console.log(`   ✅ images フィールド更新完了`);
}

async function main() {
  let ok = 0, skip = 0, errors = 0;

  for (const dir of dirs) {
    try {
      const before = skip;
      await processDir(dir);
      if (skip === before) ok++;
    } catch (err) {
      console.error(`❌ ${dir}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n================================================`);
  console.log(` 完了: ${ok} 件 / スキップ: ${skip} 件 / エラー: ${errors} 件`);
  console.log(`================================================`);
}

main();
