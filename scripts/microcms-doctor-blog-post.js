#!/usr/bin/env node
// ============================================================
// microcms-doctor-blog-post.js
// article.md を読み込んで microCMS blog API に投稿する
//
// 使い方:
//   node scripts/microcms-doctor-blog-post.js public/doctor/001_記事名
// ============================================================

import fs from "fs";
import path from "path";

// ── 引数チェック ──────────────────────────────────────────
const dir = process.argv[2];
if (!dir) {
  console.error("使い方: node scripts/microcms-doctor-blog-post.js <ディレクトリパス>");
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

  // category（配列）
  const categorySection = yamlStr.match(/^category:\n((?:\s+- .+\n?)+)/m);
  if (categorySection) {
    meta.category = [...categorySection[1].matchAll(/^\s+- "(.+?)"\s*$/gm)].map(m => m[1]);
  }

  // thumbnail
  const thumbnail = yamlStr.match(/^thumbnail:\s*"(.+?)"\s*$/m);
  if (thumbnail) meta.thumbnail = thumbnail[1];

  // instagram_url
  const igUrl = yamlStr.match(/^instagram_url:\s*"(.*)"\s*$/m);
  if (igUrl) meta.instagram_url = igUrl[1];

  // published_at
  const publishedAt = yamlStr.match(/^published_at:\s*"(.+?)"\s*$/m);
  if (publishedAt) meta.published_at = publishedAt[1];

  // author
  const author = yamlStr.match(/^author:\s*"(.+?)"\s*$/m);
  if (author) meta.author = author[1];

  return { meta, content };
}

// ── 画像アップロード ──────────────────────────────────────
async function uploadImage(imagePath) {
  const fileName = path.basename(imagePath);
  const fileBuffer = fs.readFileSync(imagePath);
  const ext = path.extname(fileName).toLowerCase();
  const mimeType = ext === ".png" ? "image/png" : "image/jpeg";
  const blob = new Blob([fileBuffer], { type: mimeType });

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

// ── 本文中の画像参照を microCMS URL に置換 ────────────────
function replaceImageRefs(content, imageMap) {
  return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    if (imageMap[src]) {
      return `![${alt}](${imageMap[src]})`;
    }
    return match;
  });
}

// ── microCMS に POST ──────────────────────────────────────
async function postStaffBlog(body) {
  const res = await fetch(
    `https://${SERVICE_DOMAIN}.microcms.io/api/v1/blog`,
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
  console.log(`   カテゴリ      : ${meta.category?.join(", ")}`);
  console.log(`   著者          : ${meta.author}`);
  console.log(`   サムネイル    : ${meta.thumbnail}`);

  // サムネイルアップロード
  const thumbnailName = meta.thumbnail ?? "image_1.jpg";
  const thumbnailFile = path.join(dir, thumbnailName);
  if (!fs.existsSync(thumbnailFile)) {
    throw new Error(`サムネイル画像が見つかりません: ${thumbnailFile}`);
  }
  const thumbnailUrl = await uploadImage(thumbnailFile);

  // 本文中の画像をアップロードして差し替え
  const allImages = fs.readdirSync(dir)
    .filter(f => /^image_\d+\.(jpg|jpeg|png)$/i.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)[0]);
      const nb = parseInt(b.match(/\d+/)[0]);
      return na - nb;
    });

  const imageMap = {};
  imageMap[thumbnailName] = thumbnailUrl;

  // サムネ以外の画像をアップロード
  const extraImages = allImages.filter(f => f !== thumbnailName);
  const imageUrls = [];
  for (const imgFile of extraImages) {
    const url = await uploadImage(path.join(dir, imgFile));
    imageMap[imgFile] = url;
    imageUrls.push(url);
  }

  const processedContent = replaceImageRefs(content, imageMap);

  // 投稿データ組み立て
  const body = {
    title: meta.title,
    slug: meta.slug,
    category: meta.category ?? [],
    body: processedContent,
    thumbnail: thumbnailUrl,
    ...(imageUrls.length > 0 ? { images: imageUrls } : {}),
    instagram_url: meta.instagram_url ?? "",
    published_at: meta.published_at ? new Date(meta.published_at).toISOString() : new Date().toISOString(),
  };

  console.log("\n📨 microCMS に投稿中...");
  const result = await postStaffBlog(body);

  console.log("\n✅ 投稿完了");
  console.log(`   ID  : ${result.id}`);
  console.log(`   URL : https://app.microcms.io/services/${SERVICE_DOMAIN}/apis/blog/editor/${result.id}`);
}

main().catch((err) => {
  console.error(`\n❌ エラー: ${err.message}`);
  process.exit(1);
});
