#!/usr/bin/env node
// ============================================================
// instagram-fetch-profile.js
// Instagram アカウントの全投稿URL + キャプション冒頭を取得する
//
// 使い方:
//   node scripts/instagram-fetch-profile.js [アカウント名]
//
// デフォルト: maison_pureju
// 出力: data/instagram-posts.txt
// ============================================================

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const USERNAME = process.argv[2] || 'maison_pureju';
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'instagram-posts.txt');

async function fetchProfile() {
  console.log(`📸 @${USERNAME} の投稿を取得中...`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // ── プロフィールページを開く ──
  await page.goto(`https://www.instagram.com/${USERNAME}/`, {
    waitUntil: 'networkidle',
    timeout: 30000,
  });
  await page.waitForTimeout(2000);

  // ── ログインモーダルを閉じる（出る場合がある） ──
  try {
    const closeBtn = page.locator('button:has-text("Not Now"), button:has-text("後で")');
    if (await closeBtn.isVisible({ timeout: 2000 })) {
      await closeBtn.click();
      await page.waitForTimeout(500);
    }
  } catch {}

  // ── スクロールして全投稿を読み込む ──
  let prevCount = 0;
  let sameCount = 0;
  while (sameCount < 3) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const count = await page.evaluate(
      () => document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]').length
    );
    if (count === prevCount) sameCount++;
    else sameCount = 0;
    prevCount = count;
  }

  // ── 投稿URLを収集 ──
  const urls = await page.evaluate(() =>
    [...new Set(
      Array.from(document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]'))
        .map(a => a.href)
    )]
  );

  console.log(`📋 ${urls.length} 件の投稿を発見`);

  // ── 各投稿のキャプションを取得 ──
  const results = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1500);

      const { caption, date } = await page.evaluate(() => {
        const meta = document.querySelector('meta[property="og:title"]');
        const captionText = meta ? meta.content : '(no caption)';

        // 投稿日付を取得（time要素のdatetime属性）
        const timeEl = document.querySelector('time[datetime]');
        const dateStr = timeEl ? timeEl.getAttribute('datetime') : '';

        return { caption: captionText, date: dateStr };
      });

      // "Maison PUREJU ... on Instagram: " プレフィックスを除去
      const cleaned = caption
        .replace(/^.*?on Instagram:\s*"?/, '')
        .replace(/"?\s*$/, '')
        .substring(0, 100);

      const dateFormatted = date ? date.split('T')[0] : '(日付不明)';

      results.push({ url, caption: cleaned, date: dateFormatted });
      console.log(`  [${i + 1}/${urls.length}] ${dateFormatted} | ${cleaned.substring(0, 50)}...`);
    } catch {
      results.push({ url, caption: '(取得エラー)' });
      console.log(`  [${i + 1}/${urls.length}] ⚠️ 取得エラー: ${url}`);
    }
  }

  await browser.close();

  // ── ファイル出力 ──
  const dir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const now = new Date().toISOString().split('T')[0];
  const lines = [
    `# @${USERNAME} Instagram投稿一覧`,
    `# 取得日: ${now}`,
    `# 件数: ${results.length}`,
    '',
  ];

  for (const { url, caption, date } of results) {
    lines.push(`[${date}] ${caption}`);
    lines.push(`${url}`);
    lines.push('');
  }

  fs.writeFileSync(OUTPUT_FILE, lines.join('\n'), 'utf-8');
  console.log(`\n✅ ${OUTPUT_FILE} に保存しました（${results.length} 件）`);
}

fetchProfile().catch(e => {
  console.error('❌ エラー:', e.message);
  process.exit(1);
});
