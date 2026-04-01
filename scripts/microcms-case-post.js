#!/usr/bin/env node
// ============================================================
// microcms-case-post.js
// article.md を読み込んで microCMS cases API に投稿する
//
// 使い方:
//   node scripts/microcms-case-post.js public/case-test/001
// ============================================================

import fs from "fs";
import path from "path";

// ── 引数チェック ──────────────────────────────────────────
const dir = process.argv[2];
if (!dir) {
  console.error("使い方: node scripts/microcms-case-post.js <ディレクトリパス>");
  process.exit(1);
}

const articlePath = path.join(dir, "article.md");
if (!fs.existsSync(articlePath)) {
  console.error(`❌ article.md が見つかりません: ${articlePath}`);
  process.exit(1);
}

// ── 環境変数 ──────────────────────────────────────────────
const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const WRITE_API_KEY  = process.env.MICROCMS_WRITE_API_KEY;
const MGMT_API_KEY   = process.env.MICROCMS_MANAGEMENT_API_KEY;

if (!SERVICE_DOMAIN || !WRITE_API_KEY || !MGMT_API_KEY) {
  console.error("❌ 環境変数が不足しています。.env.local を確認してください。");
  console.error("   必要: MICROCMS_SERVICE_DOMAIN, MICROCMS_WRITE_API_KEY, MICROCMS_MANAGEMENT_API_KEY");
  process.exit(1);
}

// ── frontmatter パース ────────────────────────────────────
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("frontmatter が見つかりません");

  const yamlStr = match[1];
  const content = match[2].trim();

  const meta = {};

  // title
  const title = yamlStr.match(/^title:\s*"(.+?)"\s*$/m);
  if (title) meta.title = title[1];

  // slug
  const slug = yamlStr.match(/^slug:\s*"(.+?)"\s*$/m);
  if (slug) meta.slug = slug[1];

  // pillar（配列）
  const pillarMatches = [...yamlStr.matchAll(/^\s+- "(.+?)"\s*$/gm)];
  if (pillarMatches.length) meta.pillar = pillarMatches.map(m => m[1]);

  // treatment_label
  const treatmentLabel = yamlStr.match(/^treatment_label:\s*"(.+?)"\s*$/m);
  if (treatmentLabel) meta.treatment_label = treatmentLabel[1];

  // timing
  const timing = yamlStr.match(/^timing:\s*"(.*)"\s*$/m);
  if (timing) meta.timing = timing[1];

  // concern
  const concern = yamlStr.match(/^concern:\s*"(.+?)"\s*$/m);
  if (concern) meta.concern = concern[1];

  // risks
  const risks = yamlStr.match(/^risks:\s*"(.+?)"\s*$/m);
  if (risks) meta.risks = risks[1];

  // tags
  const tags = yamlStr.match(/^tags:\s*"(.+?)"\s*$/m);
  if (tags) meta.tags = tags[1];

  // thumbnail
  const thumbnail = yamlStr.match(/^thumbnail:\s*"(.+?)"\s*$/m);
  if (thumbnail) meta.thumbnail = thumbnail[1];

  // instagram_url
  const igUrl = yamlStr.match(/^instagram_url:\s*"(.*)"\s*$/m);
  if (igUrl) meta.instagram_url = igUrl[1];

  // published_at
  const publishedAt = yamlStr.match(/^published_at:\s*"(.+?)"\s*$/m);
  if (publishedAt) meta.published_at = publishedAt[1];

  return { meta, content };
}

// ── 画像アップロード ──────────────────────────────────────
async function uploadImage(imagePath) {
  const fileName = path.basename(imagePath);
  const fileBuffer = fs.readFileSync(imagePath);
  const blob = new Blob([fileBuffer], { type: "image/jpeg" });

  const formData = new FormData();
  formData.append("file", blob, fileName);

  console.log(`📤 画像アップロード中: ${fileName}`);

  const res = await fetch(
    `https://${SERVICE_DOMAIN}.microcms-management.io/api/v1/media`,
    {
      method: "POST",
      headers: { "X-MICROCMS-API-KEY": MGMT_API_KEY },
      body: formData,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`画像アップロード失敗 (${res.status}): ${text}`);
  }

  const json = await res.json();
  console.log(`   ✅ アップロード完了: ${json.url}`);
  return json.url;
}

// ── microCMS に POST ──────────────────────────────────────
async function postCase(body) {
  const res = await fetch(
    `https://${SERVICE_DOMAIN}.microcms.io/api/v1/cases`,
    {
      method: "POST",
      headers: {
        "X-MICROCMS-API-KEY": WRITE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`投稿失敗 (${res.status}): ${text}`);
  }

  return await res.json();
}

// ── メイン ────────────────────────────────────────────────
async function main() {
  console.log(`\n📄 記事を読み込み中: ${articlePath}`);
  const raw = fs.readFileSync(articlePath, "utf-8");
  const { meta, content } = parseFrontmatter(raw);

  console.log(`   タイトル      : ${meta.title}`);
  console.log(`   slug          : ${meta.slug}`);
  console.log(`   pillar        : ${meta.pillar?.join(", ")}`);
  console.log(`   施術名        : ${meta.treatment_label}`);
  console.log(`   サムネイル    : ${meta.thumbnail}`);

  // サムネイルアップロード
  const thumbnailName = meta.thumbnail ?? "image_1.jpg";
  const thumbnailFile = path.join(dir, thumbnailName);
  if (!fs.existsSync(thumbnailFile)) {
    throw new Error(`サムネイル画像が見つかりません: ${thumbnailFile}`);
  }
  const thumbnailUrl = await uploadImage(thumbnailFile);

  // サムネ以外の画像をアップロード
  const allImages = fs.readdirSync(dir)
    .filter(f => /^image_\d+\.(jpg|jpeg|png)$/i.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)[0]);
      const nb = parseInt(b.match(/\d+/)[0]);
      return na - nb;
    })
    .filter(f => f !== thumbnailName);

  let imagesField = undefined;
  if (allImages.length > 0) {
    console.log(`📸 症例画像 ${allImages.length} 枚をアップロード中...`);
    const imageUrls = [];
    for (const imgFile of allImages) {
      const url = await uploadImage(path.join(dir, imgFile));
      imageUrls.push(url);
    }
    imagesField = imageUrls;
  }

  // 投稿データ組み立て
  const body = {
    title: meta.title,
    slug: meta.slug,
    pillar: meta.pillar ?? [],
    treatment_label: meta.treatment_label ?? "",
    timing: meta.timing ?? "",
    concern: meta.concern ?? "",
    risks: meta.risks ?? "",
    tags: meta.tags ?? "",
    content: content,
    thumbnail: thumbnailUrl,
    ...(imagesField ? { images: imagesField } : {}),
    instagram_url: meta.instagram_url ?? "",
    published_at: meta.published_at ? new Date(meta.published_at).toISOString() : new Date().toISOString(),
  };

  console.log("\n📨 microCMS に投稿中...");
  const result = await postCase(body);

  console.log("\n✅ 投稿完了");
  console.log(`   ID  : ${result.id}`);
  console.log(`   URL : https://app.microcms.io/services/${SERVICE_DOMAIN}/apis/cases/editor/${result.id}`);
}

main().catch((err) => {
  console.error(`\n❌ エラー: ${err.message}`);
  process.exit(1);
});
