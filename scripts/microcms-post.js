#!/usr/bin/env node
// ============================================================
// microcms-post.js
// article.md を読み込んで microCMS columns API に下書き投稿する
//
// 使い方:
//   node scripts/microcms-post.js public/column/004_日焼け止めの選び方
// ============================================================

import fs from "fs";
import path from "path";

// ── 引数チェック ──────────────────────────────────────────
const dir = process.argv[2];
const instagramUrl = process.argv[3] ?? null; // 任意: 完了マーク用
if (!dir) {
  console.error("使い方: node scripts/microcms-post.js <ディレクトリパス> [InstagramURL]");
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
  const categoryMatches = [...yamlStr.matchAll(/^\s+- "(.+?)"\s*$/gm)];
  if (categoryMatches.length) meta.category = categoryMatches.map(m => m[1]);

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
async function postColumn(body) {
  const res = await fetch(
    `https://${SERVICE_DOMAIN}.microcms.io/api/v1/columns`,
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

  console.log(`   タイトル : ${meta.title}`);
  console.log(`   slug     : ${meta.slug}`);
  console.log(`   カテゴリ : ${meta.category?.join(", ")}`);
  console.log(`   サムネイル: ${meta.thumbnail}`);

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
    console.log(`📸 記事画像 ${allImages.length} 枚をアップロード中...`);
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
    category: meta.category ?? [],
    tags: meta.tags ?? "",
    content: content,
    thumbnail: thumbnailUrl,
    ...(imagesField ? { images: imagesField } : {}),
    instagram_url: meta.instagram_url ?? "",
    published_at: meta.published_at,
  };

  console.log("\n📨 microCMS に下書き投稿中...");
  const result = await postColumn(body);

  console.log("\n✅ 投稿完了（即公開）");
  console.log(`   ID  : ${result.id}`);
  console.log(`   URL : https://app.microcms.io/services/${SERVICE_DOMAIN}/apis/columns/editor/${result.id}`);

  // urls.txt に完了マークを付ける
  if (instagramUrl) {
    const urlsFile = "public/column/urls.txt";
    if (fs.existsSync(urlsFile)) {
      const lines = fs.readFileSync(urlsFile, "utf-8").split("\n");
      const updated = lines.map((line) => {
        const trimmed = line.trim();
        if (trimmed === instagramUrl || trimmed.replace(/\?.*$/, "") === instagramUrl.replace(/\?.*$/, "")) {
          return `# [完了] ${trimmed}`;
        }
        return line;
      });
      fs.writeFileSync(urlsFile, updated.join("\n"), "utf-8");
      console.log(`   📝 urls.txt に完了マークを付けました`);
    }
  }
}

main().catch((err) => {
  console.error(`\n❌ エラー: ${err.message}`);
  process.exit(1);
});
